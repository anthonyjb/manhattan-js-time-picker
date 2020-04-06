import * as chai from 'chai'
import * as $ from 'manhattan-essentials'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import {Clock} from '../module/clock.js'
import {Time} from '../module/time.js'

chai.should()
chai.use(require('sinon-chai'))

describe('Clock', () => {

    let pickerElm = null

    beforeEach(() => {
        pickerElm = $.create('div')
        document.body.appendChild(pickerElm)
    })

    afterEach(() => {
        document.body.removeChild(pickerElm)
    })

    describe('constructor', () => {
        it('should generate a new `Clock` instance', () => {
            const clock = new Clock(pickerElm)
            clock.should.be.an.instanceof(Clock)
        })
    })

    describe('getters & setters', () => {
        let clock = null

        beforeEach(() => {
            clock = new Clock(pickerElm)
            clock.init()
        })

        afterEach(() => {
            clock.destroy()
        })

        describe('clock', () => {
            it('should return the clock UI component element', () => {
                clock.clock
                    .classList
                    .contains(Clock.css['clock'])
                    .should
                    .be
                    .true
            })
        })

        describe('mode', () => {

            beforeEach(() => {
                sinon.spy(clock, '_update')
            })

            afterEach(() => {
                clock._update.restore()
            })

            it('should return the pick mode the clock is currently in', () => {
                clock.mode.should.equal('hour')
            })

            it('should set the pick mode the clock', () => {
                clock.mode = 'minute'
                clock.mode.should.equal('minute')
                clock._update.should.have.been.calledOnce
            })

            it('should throw an error if mode not set to minute or '
                + 'hour', () => {

                chai
                    .expect(() => { clock.mode = 'foobar' })
                    .to
                    .throw('Mode must be \'hour\' or \'minute\'.')
            })
        })

        describe('parent', () => {
            it('should return the parent element for the clock', () => {
                clock.parent.should.equal(pickerElm)
            })
        })

        describe('time', () => {

            beforeEach(() => {
                sinon.spy(clock, '_update')
            })

            afterEach(() => {
                clock._update.restore()
            })

            it('should return the time the clock is displaying', () => {
                clock.time.toString().should.equal('00:00:00')
            })

            it('should set the thime for the clock to display', () => {
                clock.time = new Time(13, 30)
                clock.time.toString().should.equal('13:30:00')
                clock._update.should.have.been.calledOnce
            })
        })

    })

    describe('public methods', () => {
        let clock = null

        beforeEach(() => {
            clock = new Clock(pickerElm)
            clock.init()
        })

        afterEach(() => {
            clock.destroy()
        })

        describe('destroy', () => {

            afterEach(() => {
                clock.init()
            })

            it('should destroy the clock', () => {
                clock.destroy()
                chai.expect(clock.clock).to.be.null
                chai.expect(pickerElm._mhClock).to.be.undefined
            })

            it('should allow the clock to be destroyed even if it has not '
                + 'been initialized', () => {
                clock.destroy()
                clock.destroy()
                chai.expect(clock.clock).to.be.null
                chai.expect(pickerElm._mhClock).to.be.undefined
            })
        })

        describe('init', () => {

            beforeEach(() => {
                clock.destroy()

                sinon.spy(clock._handlers, 'keepFocus')
                sinon.spy(clock._handlers, 'switchToHour')
                sinon.spy(clock._handlers, 'switchToMinute')

                sinon.spy(clock, '_update')
            })

            afterEach(() => {
                clock._handlers.keepFocus.restore()
                clock._handlers.switchToHour.restore()
                clock._handlers.switchToMinute.restore()

                clock._update.restore()
            })

            it('should add a reference for the clock to the parent', () => {
                clock.init()
                pickerElm._mhClock.should.equal(clock)
            })

            it('should create a clock UI component', () => {
                const {css} = Clock

                clock.init()

                $.many(`.${css['clock']}`, pickerElm).length
                    .should
                    .equal(1)

                $.many(`.${css['dial']}`, pickerElm).length
                    .should
                    .equal(2)

                $.many(`.${css['dials']}`, pickerElm).length
                    .should
                    .equal(1)

                $.many(`.${css['hand']}`, pickerElm).length
                    .should
                    .equal(1)

                $.many(`.${css['hour']}`, pickerElm).length
                    .should
                    .equal(1)

                $.many(`.${css['mark']}`, pickerElm).length
                    .should
                    .equal(36)

                $.many(`.${css['minute']}`, pickerElm).length
                    .should
                    .equal(1)

                $.many(`.${css['time']}`, pickerElm).length
                    .should
                    .equal(1)

                clock._update.should.have.been.calledOnce
            })

            it('should set up event handlers for the date picker', () => {
                clock.init()

                // Keep focus
                $.dispatch(clock.clock, 'mousedown')
                clock._handlers.keepFocus.should.have.been.called

                // Switch to hour
                $.dispatch(clock._dom.hour, 'click')
                clock._handlers.switchToHour.should.have.been.called

                // Switch to minute
                $.dispatch(clock._dom.minute, 'click')
                clock._handlers.switchToMinute.should.have.been.called

                // @@ endPick

                // @@ pick

                // @@ startPick
            })

        })

    })
})


