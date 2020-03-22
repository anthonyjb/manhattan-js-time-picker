
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
    parsers(parsers, s) {
        let time = null
        for (let parser of parsers) {
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
TimeParser.formatter = {

    /**
     * Format time as 12h with minutes, e.g 11:00pm.
     */
    '12hm': (inst, time) => {
        let meridiem = 'am'
        let hour = time.hour
        if (hour > 12) {
            hour = time.hour - 12
            meridiem = 'pm'
        }
        const minuteStr = time.minute.toString().padStart(2, '0')
        return `${hour}:${minuteStr} ${meridiem}`
    },

    /**
     * Format time as 12h with minutes and seconds, e.g 11:00:00pm.
     */
    '12hms': (inst, time) => {
        let meridiem = 'am'
        let hour = time.hour
        if (hour > 12) {
            hour = time.hour - 12
            meridiem = 'pm'
        }
        const minuteStr = time.minute.toString().padStart(2, '0')
        const secondStr = time.second.toString().padStart(2, '0')
        return `${hour}:${minuteStr}:${secondStr} ${meridiem}`
    },

    /**
     * Format time as 24h with minutes, e.g 13:00.
     */
    '24hm': (inst, time) => {
        const minuteStr = time.minute.toString().padStart(2, '0')
        return `${time.hour}:${minuteStr}`
    },

    /**
     * Format time as 24h with minutes and seconds, e.g 13:00:00.
     */
    '24hms': (inst, time) => {
        const minuteStr = time.minute.toString().padStart(2, '0')
        const secondStr = time.second.toString().padStart(2, '0')
        return `${time.hour}:${minuteStr}:${secondStr}`
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
        let ts = s.toLowerCase().trim()

    },

    /**
     * Return a time from a string in the hms 24h format, e.g: 1h15m10s.
     */
    'hms': () => {
        let ts = s.toLowerCase().trim()
        let [hour, remainder] = ts.split('h')
        let [minute, remainder] = remainder.split('m')
        let [second, remainder] = remainder.split('s')

        if (hour.length > 2 || minute.length > 2 || second.length > 2) {
            return null
        }

        hour = parseInt((hour, 0), 10)
        minute = parseInt((minute, 0), 10)
        second = parseInt((second, 0), 10)

        if (hour + minute + second === NaN) {
            return null
        }

        try {
            return new Time(hour, minute, second)
        } catch (error) {
            if (error.startsWith('TimeError:')) {
                return null
            }
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

        if (ts.length == 5) {
            [hour, minute] = ts.split(':')
        } else if (ts.length == 7) {
            [hour, minute, second] = ts.split(':')
        } else if (ts.length == 6) {
            hour = ts.substring(2)
            minute = ts.substring(2, 2)
            second = ts.substring(4, 2)
        } else if (ts.length == 3) {
            hour = ts.substring(2)
            minute = ts.substring(2, 2)
        } else if (ts.length == 2) {
            hour = ts
        } else {
            return null
        }

        hour = parseInt((hour, 0), 10)
        minute = parseInt((minute, 0), 10)
        second = parseInt((second, 0), 10)

        if (hour + minute + second === NaN) {
            return null
        }

        try {
            return new Time(hour, minute, second)
        } catch (error) {
            if (error.startsWith('TimeError:')) {
                return null
            }
            throw error
        }
    }
}
