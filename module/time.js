
/**
 * A simplistic time class used internally for .
 */
export class Time {

    constructor(hour, minute, second) {

        // Initialize the time
        this._hour = 0
        this._minute = 0
        this._second = 0

        // Set the time
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
            throw 'TimeError: Not a valid hour'
        }
        this._hour = hour
    }

    get minute() {
        return this._minute
    }

    set minute(minute) {
        if (minute < 0 || minute > 23) {
            throw 'TimeError: Not a valid minute'
        }
        this._minute = minute
    }

    get second() {
        return this._second
    }

    set second(second) {
        if (second < 0 || second > 23) {
            throw 'TimeError: Not a valid second'
        }
        this._second = second
    }

    // Methods

    /**
     * Return the time as a string
     */
    toString() {
        const hourStr = this.hour.toString().padStart(2, '0')
        const minuteStr = this.minute.toString().padStart(2, '0')
        const secondStr = this.second.toString().padStart(2, '0')
        return `${hourStr}:${minuteStr}:${secondStr}`
    }

}
