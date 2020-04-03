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
            'clock': null
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

        // Build the calendar component...
        const {css} = this.constructor
        this._dom.clock = $.create('div', {'class': css['calendar']})

        // @@

        // Add the calendar to the parent element
        this.parent.appendChild(this.clock)

    }

}


// -- CSS classes --

Clock.css = {

}

