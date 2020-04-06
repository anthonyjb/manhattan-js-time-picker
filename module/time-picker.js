import * as $ from 'manhattan-essentials'
import {Clock} from './clock'
import {Time} from './time'
import {TimeParser} from './time-parser'


// -- Class definition --

/**
 * A time picker.
 */
export class TimePicker {

    constructor(input, options={}, prefix='data-mh-time-picker--') {

        // Configure the options
        this._options = {}

        $.config(
            this._options,
            {

                /**
                 * The radius of the inner set of hour marks on the clock.
                 */
                'innerHourRadius': 72.0,

                /**
                 * The format that times should be displayed in.
                 */
                'format': '24hm',

                /**
                 * Flag indicating if the time picker should display the popup
                 * when the input field is in focus (by default the popup is
                 * displayed).
                 */
                'noPopup': false,

                /**
                 * A list of parsers that will be used to attempt to parse
                 * an input string as a time (strings are parsed using each
                 * parser in turn and in the order given).
                 */
                'parsers': ['iso', '12h'],

                /**
                 * Flag indicating if the time picker should stay open when a
                 * time is picked.
                 */
                'stayOpenOnPick': false
            },
            options,
            input,
            prefix
        )

        // Handle list based options
        let _toArray = (s) => {
            return s.split(',').map((v) => {
                return v.trim()
            })
        }

        if (typeof this._options.parsers === 'string') {
            this._options.parsers = _toArray(this._options.parsers)
        }

        // Set up time parser (the parser must be initialized before we can
        // parse options that contain times).
        this._timeParser = new TimeParser()

        // Configure the behaviours
        this._behaviours = {}

        $.config(
            this._behaviours,
            {
                'input': 'setValue',
                'openTime': 'now'
            },
            options,
            input,
            prefix
        )

        // A handle to the clock component
        this._clock = null

        // A flag indicating if the time picker is open (visible)
        this._open = false

        // Domain for related DOM elements
        this._dom = {
            'input': null,
            'picker': null
        }

        // Store a reference to the input element
        this._dom.input = input

        // Set up event handlers
        this._handlers = {

            'close': () => {
                this.close()
            },

            'input': () => {
                // When the input changes attempt to parse its value as a
                // time, if successful then we pick that time.
                const time = this.timeParser.parse(
                    this._options.parsers,
                    this.input.value
                )
                if (time !== null) {
                    this.pick(time)
                }
            },

            'open': () => {
                if (!this._options.noPopup) {
                    this.open()
                }
            },

            'picked': (event) => {
                this.pick(event.time)
            }

        }
    }

    // -- Getters & Setters --

    get clock() {
        return this._clock
    }

    get timeParser() {
        return this._timeParser
    }

    get input() {
        return this._dom.input
    }

    get isOpen() {
        return this._open
    }

    get picker() {
        return this._dom.picker
    }

    // -- Public methods --

    /**
     * Close the time picker.
     */
    close() {
        if (!this.isOpen) {
            return
        }

        // Hide the time picker
        this.picker.classList.remove(this.constructor.css['open'])

        // Flag the time picker as closed
        this._open = false

        // Dispatch closed event against the input
        $.dispatch(this.input, 'closed')
    }

    /**
     * Remove the time picker.
     */
    destroy() {

        // Remove event listeners
        $.ignore(
            window,
            {
                'fullscreenchange': this._handlers.close,
                'orientationchange': this._handlers.close,
                'resize': this._handlers.close
            }
        )

        $.ignore(
            this.input,
            {
                'blur': this._handlers.close,
                'change': this._handlers.input,
                'click': this._handlers.open,
                'focus': this._handlers.open
            }
        )

        // Destroy the clock
        if (this.clock !== null) {
            $.ignore(this.clock.clock, {'picked': this._handlers.picked})

            this.clock.destroy()
            this._clock = null
        }

        // Remove the time picker element
        if (this._dom.picker !== null) {
            document.body.removeChild(this._dom.picker)
            this._dom.picker = null
        }

        // Remove the time picker reference from the input
        delete this._dom.input._mhTimePicker
    }

    /**
     * Initialize the time picker.
     */
    init() {
        // Store a reference to the time picker instance against the input
        this._dom.input._mhTimePicker = this

        // Create the time picker element
        this._dom.picker = $.create(
            'div',
            {'class': this.constructor.css['picker']}
        )
        document.body.appendChild(this._dom.picker)

        // Set up clock
        this._clock = new Clock(this.picker, this._options.innerHourRadius)
        this.clock.init()

        // Attempt to get the the time from initial field value
        const time = this.timeParser.parse(
            this._options.parsers,
            this.input.value
        )
        if (time !== null) {
            this.clock.time = time
        }

        // Set up event listeners
        $.listen(
            window,
            {
                'fullscreenchange': this._handlers.close,
                'orientationchange': this._handlers.close,
                'resize': this._handlers.close
            }
        )

        $.listen(
            this.input,
            {
                'blur': this._handlers.close,
                'change': this._handlers.input,
                'click': this._handlers.open,
                'focus': this._handlers.open
            }
        )

        $.listen(this.clock.clock, {'picked': this._handlers.picked})
    }

    /**
     * Open the time picker.
     */
    open() {
        if (this.isOpen) {
            return
        }

        // Parse the input's value as a time, if the value is a valid time
        // then select it in the clock.
        const time = this.timeParser.parse(
            this._options.parsers,
            this.input.value
        )

        if (time === null) {
            const openTime = this.constructor
                .behaviours
                .openTime[this._behaviours.openTime](this)
            this.clock.time = openTime
        } else {
            this.clock.time = time
        }
        this.clock.mode = 'hour'

        // Update the position of the picker inline with the associated input
        this._track()

        // Show the date picker
        this.picker.classList.add(this.constructor.css['open'])

        // Flag the date picker as open
        this._open = true

        // Dispatch opened event against the input
        $.dispatch(this.input, 'opened')
    }

    /**
     * Pick (select) the given time within the time picker and clock.
     */
    pick(time) {
        // Select the time in the clock
        this.clock.time = time

        // Update the input value with the time
        this.constructor.behaviours.input[this._behaviours.input](this, time)

        // Dispatch a picked event against the input
        $.dispatch(this.input, 'picked', {'date': time.copy()})

        // Close the date picker if configured to
        if (!this._options.stayOpenOnPick) {
            this.close()
        }
    }

    // -- Private methods --

    /**
     * Position the date picker inline with the associated input element.
     */
    _track() {
        const rect = this.input.getBoundingClientRect()
        const top = rect.top + window.pageYOffset
        const left = rect.left + window.pageXOffset
        this.picker.style.top = `${top + rect.height}px`
        this.picker.style.left = `${left}px`
    }
}


// -- Behaviours --

TimePicker.behaviours = {

    /**
     * The `input` behaviour is used to set the value of the associated input
     * for the time picker when a time is picked.
     */
    'input': {

        /**
         * Set the value of the input to the formatted time.
         */
        'setValue': (inst, time) => {

            // Set the input value to the new time
            const orginalValue = inst.input.value
            inst.input.value = inst.timeParser.format(
                inst._options.format,
                time
            )

            if (inst.input.value !== orginalValue) {

                // Dispatch a change event against the input
                $.dispatch(inst.input, 'change')
            }
        }

    },

    /**
     * The `openTime` behaviour is used to set the time displayed when the
     * time picker is opened (e.g what time is displayed) and no time has
     * been set. The behaviours should return a `Time` instance to display.
     */
    'openTime': {

        /**
         * Show the current time.
         */
        'now': (inst) => {
            const date = new Date()
            return new Time(date.getHours(), date.getMinutes())
        }

    }
}


// -- CSS classes --

TimePicker.css = {

    /**
     * Applied to the time picker when it is open.
     */
    'open': 'mh-time-picker--open',

    /**
     * Applied to the time picker element.
     */
    'picker': 'mh-time-picker'

}
