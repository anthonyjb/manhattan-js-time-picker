import * as $ from 'manhattan-essentials'

import {Time} from './time'


// -- Class definition --

/**
 * A clock UI component (used by the time picker to provide a clock to pick a
 * time from).
 */
export class Clock {

    constructor(parent) {

        // The time displayed on the clock
        this._time = new Time()

        // The clock can be in 2 modes, pick `hour` or pick `minute`,
        // depending on the mode the relevant dial is displayed.
        this._mode = 'hour'

        // Domain for related DOM elements
        this._dom = {
            'clock': null,
            'hand': null,
            'hour': null,
            'hourDial': null,
            'minuteDial': null,
            'time': null
        }

        // Store a reference to the time picker
        this._dom.parent = parent

        // Set up event handlers
        this._handlers = {

            'keepFocus': (event) => {
                event.preventDefault()
            },

            'switchToHour': (event) => {
                event.preventDefault()
                this.mode = 'hour'
            },

            'switchToMinute': (event) => {
                event.preventDefault()
                this.mode = 'minute'
            }

        }
    }

    // -- Getters & Setters --

    get clock() {
        return this._dom.clock
    }

    get parent() {
        return this._dom.parent
    }

    get mode() {
        return this._mode
    }

    set mode(mode) {
        if (mode !== this._mode) {
            this._mode = mode
            this._update()
        }
    }

    get time() {
        return this._time.copy()
    }

    set time(time) {
        if (time.toString() !== this._time.toString()) {
            this._time = time.copy()
            this._update()
        }
    }

    // -- Public methods --

    /**
     * Remove the clock.
     */
    destroy() {
        console.log(this, 'destroy')
    }

    /**
     * Initialize the clock.
     */
    init() {
        // Store a reference to the clock instance against the parent
        this._dom.parent._mhClock = this

        // Build the clock component...
        const {css} = this.constructor
        this._dom.clock = $.create('div', {'class': css['clock']})

        // Time
        const timeElm = $.create('div', {'class': css['time']})
        this._dom.clock.append(timeElm)

        this._dom.hour = $.create('div', {'class': css['hour']})
        timeElm.appendChild(this._dom.hour)

        this._dom.minute = $.create('div', {'class': css['minute']})
        timeElm.appendChild(this._dom.minute)

        // Dials
        const dialsElm = $.create('div', {'class': css['dials']})
        this._dom.clock.append(dialsElm)

        // Hours dial
        this._dom.hourDial = $.create(
            'div',
            {'class': `${css['dial']} ${css['hourDial']}`}
        )
        dialsElm.append(this._dom.hourDial)

        for (let hour = 0; hour < 24; hour += 1) {
            let markStr = hour.toString().padStart(2, '0')
            const markElm = $.create(
                'div',
                {'class': `${css['mark']} ${css['mark']}--h${hour}`}
            )
            markElm.textContent = markStr
            this._dom.hourDial.appendChild(markElm)
        }

        // Minutes dial
        this._dom.minuteDial = $.create(
            'div',
            {'class': `${css['dial']} ${css['minuteDial']}`}
        )
        dialsElm.appendChild(this._dom.minuteDial)

        for (let minute = 0; minute < 60; minute += 5) {
            let markStr = minute.toString().padStart(2, '0')
            const markElm = $.create(
                'div',
                {'class': `${css['mark']} ${css['mark']}--m${minute}`}
            )
            markElm.textContent = markStr
            this._dom.minuteDial.appendChild(markElm)
        }

        // Hand
        this._dom.hand = $.create(
            'div',
            {'class': css['hand']}
        )
        dialsElm.appendChild(this._dom.hand)

        // Set up event listeners
        $.listen(this.clock, {'mousedown': this._handlers.keepFocus})
        $.listen(this._dom.hour, {'click': this._handlers.switchToHour})
        $.listen(this._dom.minute, {'click': this._handlers.switchToMinute})

        // Add the clock to the parent element
        this.parent.appendChild(this.clock)

        // Update the clock
        this._update()
    }

    // -- Private methods --

    _update() {
        const {css} = this.constructor

        // Set the time displayed
        this._dom.hour.textContent = this._time
            .hour
            .toString()
            .padStart(2, '0')

        this._dom.minute.textContent = this._time
            .minute
            .toString()
            .padStart(2, '0')

        let angle = 0

        if (this._mode === 'hour') {

            // Set CSS modifier to the relevant mode
            this.clock.classList.remove(css['minuteMode'])
            this.clock.classList.add(css['hourMode'])

            // Move the hand to the relevant position on the dial
            if (this.time.hour === 0 || this.time.hour > 12) {

                // Angle
                if (this.time.hour > 0) {
                    angle = (360.0 / 12.0) * (this.time.hour - 12)
                }
                this._dom.hand.style.setProperty('--angle', `${angle}deg`)

                // Size
                this._dom.hand.classList.remove(css['handSmall'])

            } else {

                // Angle
                if (this.time.hour < 12) {
                    angle = (360.0 / 12.0) * this.time.hour
                }
                this._dom.hand.style.setProperty('--angle', `${angle}deg`)

                // Size
                this._dom.hand.classList.add(css['handSmall'])

            }

            // Content
            this._dom.hand.dataset.mark = this.time
                .hour
                .toString()
                .padStart(2, '0')

        } else if (this._mode === 'minute') {

            // Set CSS modifier to the relevant mode
            this._dom.clock.classList.remove(css['hourMode'])
            this._dom.clock.classList.add(css['minuteMode'])

            // Move the hand to the relevant position on the dial

            // Angle
            angle = (360.0 / 60.0) * this.time.minute
            this._dom.hand.style.setProperty('--angle', `${angle}deg`)

            // Size
            this._dom.hand.classList.remove(css['handSmall'])

            // Content
            if (this.time.minute % 5 === 0) {
                this._dom.hand.dataset.mark = this.time
                    .minute
                    .toString()
                    .padStart(2, '0')
            } else {
                this._dom.hand.dataset.mark = ''
            }

        } else {
            throw new TypeError('Mode must be \'hour\' or \'minute\'.')
        }

    }
}


// -- CSS classes --

Clock.css = {

    /**
     * Applied to the root clock element.
     */
    'clock': 'mh-clock',

    /**
     * Applied to a dial along with a modifier indicating if it
     * it contains hours or minutes.
     */
    'dial': 'mh-clock__dial',

    /**
     * Applied to the container for the hour and minute dials.
     */
    'dials': 'mh-clock__dials',

    /**
     * Applied to the hand indicating the hour/minute on a dial.
     */
    'hand': 'mh-clock__hand',

    /**
     * Applied to the hand when it is pointing to an hour between 1am and 12pm.
     */
    'handSmall': 'mh-clock__hand--small',

    /**
     * Applied to the hour element within the time.
     */
    'hour': 'mh-clock__hour',

    /**
     * Applied to the dial that displays hours.
     */
    'hourDial': 'mh-clock__dial--hour',

    /**
     * Applied to the clock when in pick 'hour' mode.
     */
    'hourMode': 'mh-clock--hour-mode',

    /**
     * Applied to all marks (hour or minute) on a dial.
     */
    'mark': 'mh-clock__mark',

    /**
     * Applied to the minute element within the time.
     */
    'minute': 'mh-clock__minute',

    /**
     * Applied to the dial that displays minutes.
     */
    'minuteDial': 'mh-clock__dial--minute',

    /**
     * Applied to the clock when in pick 'minute' mode.
     */
    'minuteMode': 'mh-clock--minute-mode',

    /**
     * Applied to the element that displays the time.
     */
    'time': 'mh-clock__time'

}
