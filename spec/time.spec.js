
import * as chai from 'chai'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import {Time} from '../module/time.js'

chai.should()
chai.use(require('sinon-chai'))


// Tests

describe('Time', () => {

    describe('constructor', () => {
        it('should generate a new `Time` instance', () => {
            const time = new Time()
            time.should.be.an.instanceof(Time)
        })

        it('should allow the initial time to be set', () => {
            const time = new Time(11, 12, 13)
            time.toString().should.equal('11:12:13')
        })

    })

    describe('getters & setters', () => {
        let time = null

        beforeEach(() => {
            time = new Time(11, 12, 13)
        })

        describe('hour', () => {

            it('should get the hour for the time', () => {
                time.hour.should.equal(11)
            })

            it('should set the hour for the time', () => {
                time.hour = 14
                time.hour.should.equal(14)
            })

            it('should throw an error an invalid hour is specified', () => {
                chai
                    .expect(() => { time.hour = 25 })
                    .to
                    .throw('Not a valid hour')
            })
        })

        describe('minute', () => {

            it('should get the minute for the time', () => {
                time.minute.should.equal(12)
            })

            it('should set the minute for the time', () => {
                time.minute = 20
                time.minute.should.equal(20)
            })

            it('should throw an error an invalid minute is specified', () => {
                chai
                    .expect(() => { time.minute = 80 })
                    .to
                    .throw('Not a valid minute')
            })
        })

        describe('second', () => {

            it('should get the second for the time', () => {
                time.second.should.equal(13)
            })

            it('should set the second for the time', () => {
                time.second = 20
                time.second.should.equal(20)
            })

            it('should throw an error an invalid second is specified', () => {
                chai
                    .expect(() => { time.second = 80 })
                    .to
                    .throw('Not a valid second')
            })
        })
    })

    describe('public methods', () => {
        let time = null

        beforeEach(() => {
            time = new Time(11, 12, 13)
        })

        describe('toString', () => {
            it('should return a string representing the time', () => {
                time.toString().should.equal('11:12:13')
            })
        })

    })
})
