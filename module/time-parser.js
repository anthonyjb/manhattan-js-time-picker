import {Time} from './time'


/**
 * A time parser.
 */
export class TimeParser {

    /**
     * Format (and return) a time as a string using the named formatter.
     */
    format(formatter, time) {
        return this.constructor.formatters[formatter](this, time)
    }

    /**
     * Attempt to parse (and return) a string as a time using the list of
     * named parsers.
     */
    parse(parsers, s) {
        let time = null
        for (const parser of parsers) {
            time = this.constructor.parsers[parser](this, s)
            if (time !== null) {
                break
            }
        }
        return time
    }

}


// -- Formatters --

/**
 * A set of functions that can ouput times in various string formats.
 */
TimeParser.formatters = {

    /**
     * Format time as 12h with minutes, e.g 11:00pm.
     */
    '12hm': (inst, time) => {
        let meridiem = 'am'
        let {hour} = time
        if (hour > 12) {
            hour = time.hour - 12
            meridiem = 'pm'
        }
        const minuteStr = time.minute.toString().padStart(2, '0')
        return `${hour}:${minuteStr}${meridiem}`
    },

    /**
     * Format time as 12h with minutes and seconds, e.g 11:00:00pm.
     */
    '12hms': (inst, time) => {
        let meridiem = 'am'
        let {hour} = time
        if (hour > 12) {
            hour = time.hour - 12
            meridiem = 'pm'
        }
        const minuteStr = time.minute.toString().padStart(2, '0')
        const secondStr = time.second.toString().padStart(2, '0')
        return `${hour}:${minuteStr}:${secondStr}${meridiem}`
    },

    /**
     * Format time as 24h with minutes, e.g 13:00.
     */
    '24hm': (inst, time) => {
        const hourStr = time.hour.toString().padStart(2, '0')
        const minuteStr = time.minute.toString().padStart(2, '0')
        return `${hourStr}:${minuteStr}`
    },

    /**
     * Format time as 24h with minutes and seconds, e.g 13:00:00.
     */
    '24hms': (inst, time) => {
        const hourStr = time.hour.toString().padStart(2, '0')
        const minuteStr = time.minute.toString().padStart(2, '0')
        const secondStr = time.second.toString().padStart(2, '0')
        return `${hourStr}:${minuteStr}:${secondStr}`
    }
}


// -- Parsers --

/**
 * A set of functions that can parse various different time formats.
 */
TimeParser.parsers = {

    /**
     * Return a 24h time (string) from a string using the 12h format, e.g:
     *
     * - 1
     * - 1.00
     * - 1.00.00
     * - 1 am
     * - 1 a.m
     * - 1 a.m.
     * - 1.00 am
     * - 1.00.00 am
     * - 1:00 am
     * - 1:00:00 am
     * - noon
     * - 12 noon
     * - midnight
     * - 12 midnight
     *
     * the separator can be a `:` or '.', minutes and seconds are optional.
     */
    '12h': (inst, s) => {

        // Normalize the string
        let ts = s
            .toLowerCase()
            .trim()
            .replace(/ /g, '')
            .replace(/\.+$/, '')
            .replace('a.m', 'am')
            .replace('p.m', 'pm')

        // Check for noon and midnight
        if (ts === '12midnight' || ts === 'midnight') {
            return new Time()
        }

        if (ts === '12noon' || ts === 'noon') {
            return new Time(12)
        }

        // Check for am/pm and strip meridian
        let am = true
        if (ts.endsWith('pm')) {
            am = false
        }
        ts = ts.replace('am', '').replace('pm', '')

        // Split the time by either : or .
        let parts = [ts]
        if (ts.includes(':')) {
            parts = ts.split(':')
        } else if (ts.includes('.')) {
            parts = ts.split('.')
        }

        let hour = parseInt(parts[0], 10)
        let minute = 0
        let second = 0

        if (hour > 12) {
            return null
        }

        if (!am) {
            hour += 12
        }

        if (parts.length > 1) {
            if (parts[1].length !== 2) {
                return null
            }
            minute = parseInt(parts[1], 10)
        }

        if (parts.length > 2) {
            if (parts[2].length !== 2) {
                return null
            }
            second = parseInt(parts[2], 10)
        }

        if (isNaN(hour + minute + second)) {
            return null
        }

        try {
            return new Time(hour, minute, second)
        } catch (error) {
            /* istanbul ignore next */
            if (error instanceof RangeError) {
                /* istanbul ignore next */
                return null
            }
            /* istanbul ignore next */
            throw error
        }
    },

    /**
     * Return a time from a string in ISO 8601 format (e.g `hh:mm:ss`).
     */
    'iso': (inst, s) => {
        let ts = s.trim()
        let hour = 0
        let minute = 0
        let second = 0

        if (ts.length === 5) {
            [hour, minute] = ts.split(':')
        } else if (ts.length === 8) {
            [hour, minute, second] = ts.split(':')
        } else if (ts.length === 6) {
            hour = ts.substring(0, 2)
            minute = ts.substring(2, 4)
            second = ts.substring(4, 6)
        } else if (ts.length === 4) {
            hour = ts.substring(0, 2)
            minute = ts.substring(2, 4)
        } else if (ts.length === 2) {
            hour = ts
        } else {
            return null
        }

        hour = parseInt(hour, 10)
        minute = parseInt(minute || 0, 10)
        second = parseInt(second || 0, 10)

        if (isNaN(hour + minute + second)) {
            return null
        }

        try {
            return new Time(hour, minute, second)
        } catch (error) {
            /* istanbul ignore next */
            if (error instanceof RangeError) {
                /* istanbul ignore next */
                return null
            }
            /* istanbul ignore next */
            throw error
        }
    }
}
