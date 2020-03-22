import * as $ from 'manhattan-essentials'


/**
 * A clock UI component (used by the time picker to provide a clock to pick a
 * time from).
 */
export class Clock {

    constructor(parent, timeTest) {

        // Set the clock options
        this._timeTest = timeTest

        // The time displayed on the clock
        this._time = time

        // Domain for related DOM elements
        this._dom = {
            'clock': null
        }

        // Store a reference to the time picker
        this._dom.parent = parent

        // Set up event handlers
        this._handlers = {}
    }

    get clock() {
        return this._dom.clock
    }

    get time() {
        return new time.copy()
    }

    set time(time) {
        this._time = new time.copy()
        // @@ Update
    }
}
