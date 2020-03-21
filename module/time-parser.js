
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
     * Return a 24h time (string) from a string using the 24h format
     * (`HH:MM:SS`), e.g:
     *
     * - 1
     * - 1:00
     * - 1:00:00
     * - 01
     * - 13
     * - 13:00
     * - 13:00:00
     * - 13.00
     * - 13.00.00
     * - 13h
     * - 13h00m
     * - 13h00m00s
     *
     */
    '24h': (inst, s) => {

        // Get groups of digits
        let groups = s.match(/(\d{1,2})/g)

        // Validate the number of groups
        if (!groups || group.length > 3) {
            return null
        }

        if (groups.length > 1 && groups[1].length !== 2) {
            return null
        }

        if (groups.length > 2 && groups[2].length !== 2) {
            return null
        }

        // Convert groups to integers
        groups = groups.map(g => parseInt(g, 10))

        // Convert to time
        let hour = groups[0]
        let minute = 0
        let second = 0

        if (groups.length > 1) {
            minute = groups[1]
        }

        if (groups.length > 2) {
            minute = groups[2]
        }

        try {
            return new Time(hour, minute, second)
        } catch (error){
            if (error.startswith('TimeError: ')) {
                return null
            } else {
                throw error
            }
        }
    },

    /**
     * Return a 24h time (string) from a string using the 12h format, e.g:
     *
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

    }

}
