import * as $ from 'manhattan-essentials'

import {Time} from './time'


// -- Utils --

/**
 * Return the `[x, y]` position of an event.
 */
function getEventPosition(event) {
    let _event = event
    if (event.touches) {
        [_event] = event.touches
    }
    return [
        _event.pageX - window.pageXOffset,
        _event.pageY - window.pageYOffset
    ]
}


// -- Class definition --

/**
 * A clock UI component (used by the time picker to provide a clock to pick a
 * time from).
 */
export class Clock {

    constructor(parent, innerHourRadius=72.0) {

        // The radius of the inner set of hour marks
        this._innerHourRadius = innerHourRadius

        // The clock can be in 2 modes, pick `hour` or pick `minute`,
        // depending on the mode the relevant dial is displayed.
        this._mode = 'hour'

        // Flag indicating if the user is currently picking an hour or minute
        this._picking = false

        // The time displayed on the clock
        this._time = new Time()

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

            'endPick': (event) => {
                if (!this._picking) {
                    return
                }

                event.preventDefault()
                this._picking = false
                this.clock
                    .classList
                    .remove(this.constructor.css['clockPicking'])

                if (this.mode === 'hour') {

                    // Switch to minute mode now the hour has been set
                    this.mode = 'minute'

                } else {

                    // Dispatch an event indicating that a time has been
                    // picked.
                    $.dispatch(this.clock, 'picked', {'time': this.time})
                }
            },

            'keepFocus': (event) => {
                event.preventDefault()
            },

            'pick': (event) => {
                if (!this._picking) {
                    return
                }

                event.preventDefault()

                const center = this._getDialCenter()
                const position = getEventPosition(event)

                // Calculate the angle
                let angle = Math.atan2(
                    position[1] - center[1],
                    position[0] - center[0]
                )

                // Convert to degrees
                angle *= 180.0 / Math.PI

                // Align the angle to the dial
                angle += 90

                // Normalize the angle (0-360)
                angle = ((angle % 360) + 360) % 360

                // Calculate the distance between the points
                const powX = Math.pow(center[0] - position[0], 2)
                const powY = Math.pow(center[1] - position[1], 2)
                const distance = Math.abs(Math.sqrt(powX + powY))

                // Determine the time based on the current angle and distance
                // of the mouse from the center of the dial.
                if (this.mode === 'hour') {

                    // Get the hour
                    let hour = Math.round((angle / 360.0) * 12.0)
                    if (hour > 11) {
                        hour = 0
                    }
                    hour = parseInt(hour, 10)

                    // Switch the hour based on which row of marks the user is
                    // hovering over (based on distance from the center of the
                    // dial).
                    if (distance > this._innerHourRadius) {
                        if (hour > 0) {
                            hour += 12
                        }
                    } else if (hour === 0) {
                        hour = 12
                    }

                    // Update the time
                    this.time = new Time(hour, this.time.minute)

                } else {

                    // Get the minute
                    let minute = Math.round((angle / 360.0) * 60.0)
                    if (minute > 59) {
                        minute = 0
                    }
                    minute = parseInt(minute, 10)

                    // Update the time
                    this.time = new Time(this.time.hour, minute)
                }
            },

            'startPick': (event) => {
                event.preventDefault()
                this._picking = true
                this.clock.classList.add(this.constructor.css['clockPicking'])

                // Make initial pick
                this._handlers.pick(event)
            },

            'switchToHour': (event) => {
                event.preventDefault()
                if (!this._picking) {
                    this.mode = 'hour'
                }
            },

            'switchToMinute': (event) => {
                event.preventDefault()
                if (!this._picking) {
                    this.mode = 'minute'
                }
            }
        }
    }

    // -- Getters & Setters --

    get clock() {
        return this._dom.clock
    }

    get mode() {
        return this._mode
    }

    set mode(mode) {
        if (mode !== 'hour' && mode !== 'minute') {
            throw new TypeError('Mode must be \'hour\' or \'minute\'.')
        }
        this._mode = mode
        this._update()
    }

    get parent() {
        return this._dom.parent
    }

    get time() {
        return this._time.copy()
    }

    set time(time) {
        this._time = time.copy()
        this._update()
    }

    // -- Public methods --

    /**
     * Remove the clock.
     */
    destroy() {
        if (this.clock) {
            // Remove event handlers
            $.ignore(this.clock, {'mousedown': this._handlers.keepFocus})
            $.ignore(this._dom.hour, {'click': this._handlers.switchToHour})
            $.ignore(
                this._dom.minute,
                {'click': this._handlers.switchToMinute}
            )
            $.ignore(
                this._dom.hourDial,
                {'mousedown': this._handlers.startPick}
            )
            $.ignore(
                this._dom.minuteDial,
                {'mousedown': this._handlers.startPick}
            )
            $.ignore(document, {'mousemove': this._handlers.pick})
            $.ignore(document, {'mouseup': this._handlers.endPick})

            // Remove the clock from the parent
            this.parent.removeChild(this.clock)
            this._dom.clock = null
        }

        // Remove the clock reference from the parent
        delete this._dom.parent._mhClock
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
        $.listen(this._dom.hourDial, {'mousedown': this._handlers.startPick})
        $.listen(this._dom.minuteDial, {'mousedown': this._handlers.startPick})
        $.listen(document, {'mousemove': this._handlers.pick})
        $.listen(document, {'mouseup': this._handlers.endPick})

        // Add the clock to the parent element
        this.parent.appendChild(this.clock)

        // Update the clock
        this._update()
    }

    // -- Private methods --

    /**
     * Get the center of the dial based on the current mode.
     */
    _getDialCenter() {
        let dial = null
        if (this.mode === 'hour') {
            dial = this._dom.hourDial
        } else {
            dial = this._dom.minuteDial
        }

        const dialRect = dial.getBoundingClientRect()
        return [
            window.pageXOffset + dialRect.left + (dialRect.width / 2.0),
            window.pageYOffset + dialRect.top + (dialRect.height / 2.0)
        ]
    }

    /**
     * Update the view of the clock to display the current time and dial for
     * the given mode.
     */
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
            this._dom.hand.dataset.mhMark = this.time
                .hour
                .toString()
                .padStart(2, '0')

        } else {

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
                this._dom.hand.dataset.mhMark = this.time
                    .minute
                    .toString()
                    .padStart(2, '0')
            } else {
                this._dom.hand.dataset.mhMark = ''
            }
        }

        // Dispatch an updated event against the calendar
        $.dispatch(this.clock, 'updated', {'time': this.time})
    }
}


// -- CSS classes --

Clock.css = {

    /**
     * Applied to the root clock element.
     */
    'clock': 'mh-clock',

    /**
     * Applied to the clock when the user is picking an hour or minute.
     */
    'clockPicking': 'mh-clock--picking',

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
