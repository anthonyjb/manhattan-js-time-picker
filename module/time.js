
/**
 * A simplistic time class used internally for .
 */
export class Time {

    constructor(hours, minutes, seconds) {
        this._hour = 0
        this._minute = 0
        this._second = 0

        this.hour = hour || 0
        this.minute = minute || 0
        this.second = second || 0
    }

    // Getters & Setters

    get hour() {
        return this._hour
    }

    set hour(hour) {
        if (hour < 0 || hour > 23) {
            throw 'Not a valid hour'
        }
        this._hour = hour
    }

    get minute() {
        return this._minute
    }

    set minute(minute) {
        if (minute < 0 || minute > 23) {
            throw 'Not a valid minute'
        }
        this._minute = minute
    }

    get second() {
        return this.second
    }

    set second(second) {
        if (second < 0 || second > 23) {
            throw 'Not a valid second'
        }
        this._second = second
    }

    // Methods

    /**
     * Add the given number of hours to the time.
     */
    addHours(hours) {
        this.addSeconds(hours * 3600)
    }

    /**
     * Add the given number of minutes to the time.
     */
    addMinutes(minutes) {
        this.addSeconds(minutes * 60)
    }

    /**
     * Add the given number of seconds to the time.
     */
    addSeconds(seconds) {

    }

    /**
     * Return the time as a string
     */
    toString() {

    }

}
