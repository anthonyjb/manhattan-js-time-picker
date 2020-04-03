import * as $ from 'manhattan-essentials'

import {Time} from './time'


// -- Class definition --

/**
 * A clock UI component (used by the time picker to provide a clock to pick a
 * time from).
 */
export class Clock {

    constructor(parent, minTime, maxTime) {

        // Set the clock options
        this._minTime = minTime
        this.maxTime = maxTime

        // The time displayed on the clock
        this._time = new Time()

        // Domain for related DOM elements
        this._dom = {
            'clock': null,
            'hour': null,
            'time': null
        }

        // Store a reference to the time picker
        this._dom.parent = parent

        // Set up event handlers
        this._handlers = {}
    }

    // -- Getters & Setters --

    get clock() {
        return this._dom.clock
    }

    get parent() {
        return this._dom.parent
    }

    get time() {
        return this._time.copy()
    }

    set time(time) {
        this._time = time.copy()

        console.log('here')

        this._dom.hour.textContent = '09'
        this._dom.minute.textContent = '30'
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

        // @@
        this._dom.clock.classList.add('mh-clock--hour-dial')

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

        // clock__dials
        // clock__dial
        // clock__mark
        // clock__hand

        // Add the clock to the parent element
        this.parent.appendChild(this.clock)

    }

}


// -- CSS classes --

Clock.css = {

    /**
     * Applied to the root clock element.
     */
    'clock': 'mh-clock',

    /**
     * Applied to the container for the hour and minute dials.
     */
    'dials': 'mh-clock__dials',

    /**
     * Applied to the hour element within the time.
     */
    'hour': 'mh-clock__hour',

    /**
     * Applied to the minute element within the time.
     */
    'minute': 'mh-clock__minute',

    /**
     * Applied to the element that displays the time.
     */
    'time': 'mh-clock__time'

}

// @@ hour dial
// @@ minute dial
