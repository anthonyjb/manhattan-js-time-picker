
import * as chai from 'chai'
import * as $ from 'manhattan-essentials'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import {Clock} from '../module/clock.js'
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

})
