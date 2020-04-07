
import * as chai from 'chai'
import * as $ from 'manhattan-essentials'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import {Clock} from '../module/clock.js'
import {Time} from '../module/time.js'
import {TimeParser} from '../module/time-parser.js'
import {TimePicker} from '../module/time-picker.js'

chai.should()
chai.use(require('sinon-chai'))


describe('TimePicker', () => {

    let inputElm = null
    let otherInputElm = null

    beforeEach(() => {
        inputElm = $.create(
            'input',
            {
                'type': 'text',
                'value': '10:30'
            }
        )
        document.body.appendChild(inputElm)    })

    afterEach(() => {
        document.body.removeChild(inputElm)
    })

    describe('constructor', () => {
        it('should generate a new `TimePicker` instance', () => {
            const timePicker = new TimePicker(inputElm)
            timePicker.should.be.an.instanceof(TimePicker)
        })
    })


    describe('option parsing', () => {

        describe('parsers', () => {
            it('should accept a comma separated string and convert it to a '
                + 'list of parser names', () => {
                const parsersStr = 'iso,24h'
                const timePicker = new TimePicker(
                    inputElm,
                    {'parsers': parsersStr}
                )
                const {parsers} = timePicker._options
                parsers.should.deep.equal(parsersStr.split(','))
            })
        })

    })

    describe('getters & setters', () => {
        let timePicker = null

        beforeEach(() => {
            timePicker = new TimePicker(inputElm)
            timePicker.init()
        })

        afterEach(() => {
            timePicker.destroy()
        })

        describe('clock', () => {
            it('should return the clock instance for the time picker', () => {
                timePicker.clock.should.be.an.instanceof(Clock)
            })
        })

        describe('input', () => {
            it('should return the input element for the time picker', () => {
                timePicker.input.should.equal(inputElm)
            })
        })

        describe('isOpen', () => {
            it('should return false if the time picker is closed', () => {
                timePicker.close()
                timePicker.isOpen.should.be.false
            })

            it('should return true if the time picker is open', () => {
                timePicker.open()
                timePicker.isOpen.should.be.true
            })
        })

        describe('picker', () => {
            it('should return the picker element for the time picker', () => {
                timePicker.picker
                    .classList
                    .contains(TimePicker.css['picker'])
                    .should
                    .be
                    .true
            })
        })

        describe('timeParser', () => {
            it('should return the time parser instance for the time '
                + 'picker', () => {
                timePicker.timeParser.should.be.an.instanceof(TimeParser)
            })
        })
    })

    describe('public methods', () => {
        let timePicker = null

        beforeEach(() => {
            timePicker = new TimePicker(inputElm)
            timePicker.init()
        })

        afterEach(() => {
            timePicker.destroy()
        })

        describe('close', () => {

            beforeEach(() => {
                timePicker.open()
            })

            it('should remove the open class from the time picker', () => {
                timePicker.close()
                const openClass = TimePicker.css['open']
                timePicker.picker.classList.contains(openClass).should.be.false
            })

            it('should set the isOpen flag to false', () => {
                timePicker.close()
                timePicker.isOpen.should.be.false
            })

            it('should dispatch a closed event against the input '
                + 'element', () => {

                const onClose = sinon.spy()
                $.listen(inputElm, {'closed': onClose})
                timePicker.close()
                onClose.should.have.been.called
            })

            it('should not dispatch a closed event if the time picker '
                + 'is already closed', () => {

                const onClose = sinon.spy()
                $.listen(inputElm, {'closed': onClose})
                timePicker.close()
                timePicker.close()
                onClose.should.have.been.calledOnce
            })
        })

        describe('destroy', () => {

            beforeEach(() => {
                timePicker.destroy()

                sinon.spy(timePicker._handlers, 'close')
                sinon.spy(timePicker._handlers, 'input')
                sinon.spy(timePicker._handlers, 'open')

                timePicker.init()
            })

            it('should destroy the time picker', () => {
                timePicker.destroy()

                // Resizing the window should no longer trigger the close
                // event.
                $.dispatch(window, 'fullscreenchange')
                $.dispatch(window, 'orientationchange')
                $.dispatch(window, 'resize')
                timePicker._handlers.close.should.not.have.been.called

                // If the input is blurred it should no longer trigger the
                // close event handler.
                $.dispatch(inputElm, 'blur')
                timePicker._handlers.close.should.not.have.been.called

                // If the input's value is changed is should no longer
                // trigger the input event handler.
                $.dispatch(inputElm, 'change')
                timePicker._handlers.input.should.not.have.been.called

                // If the input is clicked or given focus it should not longer
                // trigger the open event handler.
                $.dispatch(inputElm, 'click')
                $.dispatch(inputElm, 'focus')
                timePicker._handlers.open.should.not.have.been.called

                // The clock should have been destroyed
                chai.expect(timePicker.clock).to.be.null

                // The picker element should have been removed from the DOM
                $.many(`.${TimePicker.css['picker']}`).length.should.equal(0)
                chai.expect(timePicker.picker).to.be.null

                // The reference to the time picker should have been removed
                // from the input.
                chai.expect(inputElm._mhTimePicker).to.be.undefined
            })

            it('should allow the time picker to be destroyed even if it has '
                + 'not been initialized', () => {
                timePicker.destroy()
                timePicker.destroy()
            })
        })

        describe('init', () => {

            beforeEach(() => {
                timePicker.destroy()

                sinon.spy(timePicker._handlers, 'close')
                sinon.spy(timePicker._handlers, 'input')
                sinon.spy(timePicker._handlers, 'open')
                sinon.spy(timePicker._handlers, 'picked')
            })

            it('should add a reference for the time picker to the '
                + 'input', () => {
                timePicker.init()
                inputElm._mhTimePicker.should.equal(timePicker)
            })

            it('should add a picker element that will be the parent for the '
                + 'clock component', () => {

                timePicker.init()
                timePicker.picker
                    .classList
                    .contains(TimePicker.css['picker'])
                    .should
                    .be
                    .true
            })

            it('should initialize a clock with time set', () => {
                timePicker.init()
                timePicker.clock.should.be.an.instanceof(Clock)

                const time = new Time(10, 30)
                timePicker.clock.time.toString().should.equal(time.toString())
            })

            it('should initialize a clock with no time set', () => {
                inputElm.value = ''
                timePicker.init()
                timePicker.clock.should.be.an.instanceof(Clock)

                const time = new Time()
                timePicker.clock.time.toString().should.equal(time.toString())
            })

            it('should set up event handlers for the time picker', () => {
                timePicker.init()

                // Resizing the window should call the close event handler
                $.dispatch(window, 'fullscreenchange')
                $.dispatch(window, 'orientationchange')
                $.dispatch(window, 'resize')
                timePicker._handlers.close.callCount.should.equal(3)

                // If the input is blurred it should trigger the close event
                // handler.
                $.dispatch(inputElm, 'blur')
                timePicker._handlers.close.callCount.should.equal(4)

                // If the input's value is changed is should trigger the
                // input event handler.
                $.dispatch(inputElm, 'change')
                timePicker._handlers.input.should.have.been.called

                // If the input is clicked or given focus it should trigger
                // the open event handler.
                $.dispatch(inputElm, 'click')
                $.dispatch(inputElm, 'focus')
                timePicker._handlers.open.should.have.been.calledTwice

                // If the clock tiggers a picked event it should trigger the
                // picked event handler.
                $.dispatch(
                    timePicker.clock.clock,
                    'picked',
                    {'time': new Time()}
                )
                timePicker._handlers.picked.should.have.been.called
            })
        })

        describe('open', () => {

            beforeEach(() => {
                sinon.spy(timePicker, '_track')
            })

            afterEach(() => {
                timePicker._track.restore()
            })

            it('should set the selected time on the clock to that in the '
                + 'input', () => {
                timePicker.open()
                const {time} = timePicker.clock
                time.toString().should.equal('10:30:00')
            })

            it('should set a default open time for the clock if the input\'s '
                + 'value is not a valid time', () => {
                inputElm.value = 'querty'
                timePicker.open()

                const date = new Date()
                const now = new Time(date.getHours(), date.getMinutes())
                const {time} = timePicker.clock
                time.toString().should.equal(now.toString())
            })

            it('should call _track to make sure the picker is inline with '
                + 'the input', () => {
                timePicker.open()
                timePicker._track.should.have.been.called
            })

            it('should add the open class from the time picker', () => {
                timePicker.open()
                const openClass = TimePicker.css['open']
                timePicker.picker.classList.contains(openClass).should.be.true
            })

            it('should set the isOpen flag to true', () => {
                timePicker.open()
                timePicker.isOpen.should.be.true
            })

            it('should dispatch a opened event against the input '
                + 'element', () => {

                const onOpen = sinon.spy()
                $.listen(inputElm, {'opened': onOpen})
                timePicker.open()
                onOpen.should.have.been.called
            })

            it('should not dispatch a opened event if the time picker is '
                + 'already open', () => {

                const onOpen = sinon.spy()
                $.listen(inputElm, {'opened': onOpen})
                timePicker.open()
                timePicker.open()
                onOpen.should.have.been.calledOnce
            })
        })

        describe('pick', () => {
            let time = null

            beforeEach(() => {
                time = new Time(12, 15)
            })

            it('should select the given time in the clock', () => {
                timePicker.pick(time)
                const clockTime = timePicker.clock.time
                clockTime.toString().should.equal(time.toString())
            })

            it('should dispatched the picked event against the input', () => {
                const onPicked = sinon.spy()
                $.listen(inputElm, {'picked': onPicked})
                timePicker.pick(time)
                onPicked.should.have.been.called
            })

            it('should close the picker if the stayOpenOnPick flag is '
                + 'false', () => {
                timePicker.open()
                timePicker.pick(time)
                timePicker.isOpen.should.be.false
            })

            it('should not close the picker if the stayOpenOnPick flag is '
                + 'true', () => {

                timePicker.destroy()
                timePicker = new TimePicker(
                    inputElm,
                    {'stayOpenOnPick': true}
                )
                timePicker.init()
                timePicker.open()
                timePicker.pick(time)
                timePicker.isOpen.should.be.true
            })
        })
    })

    describe('private methods', () => {
        let timePicker = null

        beforeEach(() => {
            timePicker = new TimePicker(inputElm)
            timePicker.init()

            inputElm.getBoundingClientRect = () => {
                return {
                    'bottom': 40,
                    'height': 20,
                    'left': 30,
                    'right': 130,
                    'top': 20,
                    'width': 100
                }
            }

            window.pageXOffset = 10
            window.pageYOffset = 10
        })

        afterEach(() => {
            timePicker.destroy()
        })

        describe('track', () => {

            it('should position the picker inline with the input', () => {
                timePicker._track()
                timePicker.picker.style.top.should.equal('50px')
                timePicker.picker.style.left.should.equal('40px')
            })

        })
    })

    describe('behaviours > input', () => {
        const behaviours = TimePicker.behaviours.input
        let timePicker = null

        beforeEach(() => {
            timePicker = new TimePicker(inputElm)
            timePicker.init()
        })

        afterEach(() => {
            timePicker.destroy()
        })

        describe('setValue', () => {
            it('should set the value of the input element to the formatted '
                + 'time', () => {

                behaviours.setValue(timePicker, new Time(12, 15))
                inputElm.value.should.equal('12:15')
            })

            it('should dispatch a change event against the input if the '
                + 'value has changed', () => {

                const onChange = sinon.spy()
                $.listen(inputElm, {'change': onChange})
                behaviours.setValue(timePicker, new Time(12, 15))
                onChange.should.have.been.called
            })

            it('should not dispatch a change event against the input if the '
                + 'value has not changed', () => {

                inputElm.value = '12:15'

                const onChange = sinon.spy()
                $.listen(inputElm, {'change': onChange})
                behaviours.setValue(timePicker, new Time(12, 15))
                onChange.should.not.have.been.called
            })
        })
    })

    describe('behaviours > openTime', () => {
        const behaviours = TimePicker.behaviours.openTime
        let timePicker = null

        beforeEach(() => {
            timePicker = new TimePicker(inputElm)
            timePicker.init()
        })

        afterEach(() => {
            timePicker.destroy()
        })

        describe('now', () => {

            it('should return the current time', () => {
                const time = behaviours.now(timePicker)
                const date = new Date()
                const now = new Time(date.getHours(), date.getMinutes())
                time.toString().should.equal(now.toString())
            })
        })
    })

    describe('events', () => {
        let timePicker = null

        beforeEach(() => {
            timePicker = new TimePicker(inputElm)
            timePicker.init()
        })

        afterEach(() => {
            timePicker.destroy()
        })

        describe('close', () => {

            it('should close the picker', () => {
                timePicker.open()
                $.dispatch(window, 'resize')
                timePicker.isOpen.should.be.false
            })
        })

        describe('input', () => {

            it('should pick the time using the input\'s value', () => {
                const time = new Time(10, 30)
                $.dispatch(inputElm, 'change')
                const clockTime = timePicker.clock.time
                clockTime.toString().should.equal(time.toString())
            })

            it('should not set a time if the input\'s value is not a valid '
                + 'time', () => {
                const time = new Time(10, 30)
                timePicker.clock.time = time
                inputElm.value = 'querty'

                $.dispatch(inputElm, 'change')
                const clockTime = timePicker.clock.time
                clockTime.toString().should.equal(time.toString())
            })
        })

        describe('open', () => {

            it('should open the picker', () => {
                timePicker.close()
                $.dispatch(inputElm, 'focus')
                timePicker.isOpen.should.be.true
            })

            it('should not open the picker if the noPopup option is '
                + 'true', () => {
                timePicker.destroy()
                timePicker = new TimePicker(inputElm, {'noPopup': true})
                timePicker.init()

                timePicker.close()
                $.dispatch(inputElm, 'focus')
                timePicker.isOpen.should.be.false
            })
        })

        describe('pick', () => {

            it('should trigger picked event against the input', () => {
                const onPicked = sinon.spy()
                $.listen(inputElm, {'picked': onPicked})
                $.dispatch(
                    timePicker.clock.clock,
                    'picked',
                    {'time': new Time(12, 15)}
                )
                onPicked.should.have.been.called
            })

        })
    })
})
