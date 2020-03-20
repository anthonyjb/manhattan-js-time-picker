
// 10:00:00
// 10:00
// 10am
// 10:00am
// 10.00
// 10.00am
// 10.00a.m
// 10.00a.m.
// 21h45
// 21h45min
// noon
// 12 noon
// midnight
// 12 midnight


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

/**
 * A set of functions that can ouput 24h times (string) in various string
 * formats.
 */
TimeParser.formatter = {

    /**
     * Format time as `12h`, e.g 11:00pm
     */


}

