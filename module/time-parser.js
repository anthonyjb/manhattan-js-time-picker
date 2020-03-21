


/**
 * A time parser.
 */
export class TimeParser {

    /**
     * Format (and return) a 24h time (string) as a string using the named
     * formatter.
     */
    format(formatter, time) {
        return this.constructor.formatters[formatter](this, time)
    }

    /**
     * Attempt to parse (and return) a string as a 24h time (string) using the
     * list of named parsers.
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
 * A set of functions that can ouput 24h times (string) in various string
 * formats.
 */
TimeParser.formatter = {

    /**
     * Format time as 12h with minutes, e.g 11:00pm.
     */
    '12hm': (inst, time) => {
        return '@@'
    },

    /**
     * Format time as 12h with minutes and seconds, e.g 11:00:00pm.
     */
    '12hms': (inst, time) => {
        return '@@'
    },

    /**
     * Format time as 24h with minutes, e.g 13:00.
     */
    '24hm': (inst, time) => {
        return '@@'
    },

    /**
     * Format time as 24h with minutes and seconds, e.g 13:00:00.
     */
    '24hms': (inst, time) => {
        return '@@'
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

    },

    /**
     * Return a 24h time (string) from a string using the 12h format, e.g:
     *
     * - 1 am
     * - 1 a.m
     * - 1 a.m.
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
