<div align="center">
    <img width="196" height="96" vspace="20" src="http://assets.getme.co.uk/manhattan-logo--variation-b.svg">
    <h1>Manhattan Time Picker</h1>
    <p>Time parsing and picking for form fields.</p>
    <a href="https://badge.fury.io/js/manhattan-time-picker"><img src="https://badge.fury.io/js/manhattan-time-picker.svg" alt="npm version" height="18"></a>
    <a href="https://travis-ci.org/GetmeUK/manhattan-js-time-picker"><img src="https://travis-ci.org/GetmeUK/manhattan-js-time-picker.svg?branch=master" alt="Build Status" height="18"></a>
    <a href='https://coveralls.io/github/GetmeUK/manhattan-js-time-picker?branch=master'><img src='https://coveralls.io/repos/github/GetmeUK/manhattan-js-time-picker/badge.svg?branch=master' alt='Coverage Status' height="18"/></a>
    <a href="https://david-dm.org/GetmeUK/manhattan-js-time-picker/"><img src='https://david-dm.org/GetmeUK/manhattan-js-time-picker/status.svg' alt='dependencies status' height="18"/></a>
</div>

## Installation

`npm install manhattan-date-picker --save-dev`


## Usage

```html
<label>
    Time
    <input
        name="text"
        value="10:30"
        data-mh-time-picker
        >
</label>
```

```JavaScript
import * as $ from 'manhattan-essentials'
import {timePicker} from 'manhattan-time-picker'

const picker = new timePicker.DatePicker($.one('[data-mh-time-picker]'))
picker.init()
```
