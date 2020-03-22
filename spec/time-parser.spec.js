
import * as chai from 'chai'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import {Time} from '../module/time.js'
import {TimeParser} from '../module/time-parser.js'

chai.should()
chai.use(require('sinon-chai'))


// Tests

describe('TimeParser', () => {

    describe('constructor', () => {

        it('should generate a new `TimeParser` instance', () => {
            const parser = new TimeParser()
            parser.should.be.an.instanceof(TimeParser)
        })

    })

    describe('public methods', () => {
        let parser = null

        beforeEach(() => {
            parser = new TimeParser()
        })

        afterEach(() => {
            parser = new TimeParser()
        })

        describe('format', () => {
            it('should format the given time using the named formatter', () => {
                const time = new Time(11, 12, 13)
                parser.format('12hm', time).should.equal('11:12am')
            })
        })

        describe('parse', () => {
            it('should parse the given string using the list of named '
                + 'parsers', () => {

                let time = null
                time = parser.parse(['12h', 'iso'], '11:12:13am')
                time.toString().should.equal('11:12:13')
                time = parser.parse(['iso', '12h'], '11:12:13am')
                time.toString().should.equal('11:12:13')
            })
        })
    })

    describe('formatters', () => {
        const {formatters} = TimeParser
        let parser = null

        beforeEach(() => {
            parser = new TimeParser()
        })

        describe('12hm', () => {
            it('should format the time using 12h format `hh:mm(am|pm)`', () => {
                formatters['12hm'](parser, new Time(11, 12, 13))
                    .should
                    .equal('11:12am')
                formatters['12hm'](parser, new Time(23, 12, 13))
                    .should
                    .equal('11:12pm')
            })
        })

        describe('12hms', () => {
            it('should format the time using 12h format '
                + '`hh:mm:ss(am|pm)`', () => {

                formatters['12hms'](parser, new Time(11, 12, 13))
                    .should
                    .equal('11:12:13am')
                formatters['12hms'](parser, new Time(23, 12, 13))
                    .should
                    .equal('11:12:13pm')
            })
        })

        describe('24hm', () => {
            it('should format the time using 24h format `hh:mm`', () => {
                formatters['24hm'](parser, new Time(11, 12, 13))
                    .should
                    .equal('11:12')
            })
        })

        describe('24hms', () => {
            it('should format the time using 24h format `hh:mm:ss`', () => {
                formatters['24hms'](parser, new Time(11, 12, 13))
                    .should
                    .equal('11:12:13')
            })
        })
    })

    describe('parsers', () => {
        const {parsers} = TimeParser
        let parser = null

        beforeEach(() => {
            parser = new TimeParser()
        })

        describe('12h', () => {

            it('should parse a time string format `12 noon` or `noon`', () => {
                parsers['12h'](parser, '12 noon')
                    .toString()
                    .should
                    .equal('12:00:00')
                parsers['12h'](parser, 'noon')
                    .toString()
                    .should
                    .equal('12:00:00')
            })

            it('should parse a time string format `12 midnight` or '
                + '`midnight`', () => {

                parsers['12h'](parser, '12 midnight')
                    .toString()
                    .should
                    .equal('00:00:00')
                parsers['12h'](parser, 'midnight')
                    .toString()
                    .should
                    .equal('00:00:00')
            })

            it('should parse a time string format `h(h)`', () => {
                parsers['12h'](parser, '1')
                    .toString()
                    .should
                    .equal('01:00:00')
                parsers['12h'](parser, '10')
                    .toString()
                    .should
                    .equal('10:00:00')
            })

            it('should parse a time string format `h(h)(.|:)mm`', () => {
                parsers['12h'](parser, '1.12')
                    .toString()
                    .should
                    .equal('01:12:00')
                parsers['12h'](parser, '10.12')
                    .toString()
                    .should
                    .equal('10:12:00')
                parsers['12h'](parser, '1:12')
                    .toString()
                    .should
                    .equal('01:12:00')
                parsers['12h'](parser, '10:12')
                    .toString()
                    .should
                    .equal('10:12:00')
            })

            it('should parse a time string format `h(h)(.|:)mm(.|:)ss`', () => {
                parsers['12h'](parser, '1.12.13')
                    .toString()
                    .should
                    .equal('01:12:13')
                parsers['12h'](parser, '10.12.13')
                    .toString()
                    .should
                    .equal('10:12:13')
                parsers['12h'](parser, '1:12:13')
                    .toString()
                    .should
                    .equal('01:12:13')
                parsers['12h'](parser, '10:12:13')
                    .toString()
                    .should
                    .equal('10:12:13')
            })

            it('should parse a time string format `(am|pm)`', () => {
                parsers['12h'](parser, '10am')
                    .toString()
                    .should
                    .equal('10:00:00')
                parsers['12h'](parser, '10pm')
                    .toString()
                    .should
                    .equal('22:00:00')
                parsers['12h'](parser, '10a.m')
                    .toString()
                    .should
                    .equal('10:00:00')
                parsers['12h'](parser, '10a.m.')
                    .toString()
                    .should
                    .equal('10:00:00')
            })

            it('should not allow an hour greater than 12', () => {
                const time = parsers['12h'](parser, '13')
                chai.expect(time).to.be.null
            })

            it('should not allow non-integer values for hours, minutes, '
                + 'seconds', () => {
                let time = null

                time = parsers['12h'](parser, 'a')
                chai.expect(time).to.be.null

                time = parsers['12h'](parser, '1:aa')
                chai.expect(time).to.be.null

                time = parsers['12h'](parser, '1:11:aa')
                chai.expect(time).to.be.null
            })

            it('should not allow minutes or seconds with more than '
                + '2 digits', () => {

                let time = null

                time = parsers['12h'](parser, '10:111')
                chai.expect(time).to.be.null

                time = parsers['12h'](parser, '10:11:122')
                chai.expect(time).to.be.null
            })

            it('should not allow an invalid time', () => {
                const time = parsers['12h'](parser, '10:11:80')
                chai.expect(time).to.be.null
            })
        })

        describe('iso', () => {

            it('should parse a time string format `10`', () => {
                parsers['iso'](parser, '10')
                    .toString()
                    .should
                    .equal('10:00:00')
            })

            it('should parse a time string format `10(:)11`', () => {
                parsers['iso'](parser, '10:11')
                    .toString()
                    .should
                    .equal('10:11:00')
                parsers['iso'](parser, '1011')
                    .toString()
                    .should
                    .equal('10:11:00')
            })

            it('should parse a time string format `10(:)11(:)12`', () => {
                parsers['iso'](parser, '10:11:12')
                    .toString()
                    .should
                    .equal('10:11:12')
                parsers['iso'](parser, '101112')
                    .toString()
                    .should
                    .equal('10:11:12')
            })

            it('should not allow non-integer values for hours, minutes, '
                + 'seconds', () => {
                let time = null

                time = parsers['iso'](parser, 'aa')
                chai.expect(time).to.be.null

                time = parsers['iso'](parser, '10:aa')
                chai.expect(time).to.be.null

                time = parsers['iso'](parser, '10:11:aa')
                chai.expect(time).to.be.null
            })

            it('should not allow an invalid time', () => {
                const time = parsers['iso'](parser, '10:11:80')
                chai.expect(time).to.be.null
            })
        })
    })
})
