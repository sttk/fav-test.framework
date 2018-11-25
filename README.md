# [@fav/test.framework][repo-url] [![NPM][npm-img]][npm-url] [![MIT Licese][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Coverage status][coverage-img]][coverage-url]

Javascript test framework like Mocha.

> "fav" is an abbreviation of "favorite" and also the acronym of "for all versions".
> This package is intended to support all Node.js versions and many browsers as possible.
> At least, this package supports Node.js >= v0.10 and major Web browsers: Chrome, Firefox, IE11, Edge, Vivaldi and Safari.


## Install

To install from npm:

```sh
$ npm install --save @fav/test.framework
```

***NOTE:*** *npm < 2.7.0 does not support scoped package, but old version Node.js supports it. So when you use such older npm, you should download this package from [github.com][repo-url], and move it in `node_modules/@fav/test.framework/` directory manually.*

## Usage

For Node.js:

```js
var Framework = require('@fav/test.framework');
var fw = new Framework(),
    describe = fw.suite,
    it = fw.test,
    before = fw.before,
    after = fw.after,
    beforeEach = fw.beforeEach,
    afterEach = fw.afterEach;

describe.skip = fw.skipSuite;
it.skip = fw.skipTest;
describe.only = fw.onlySuite;
it.only = fw.onlyTest;
```

```html
<script src="fav.test.framework.min.js"></script>
<script>
var Framework = fav.test.framework;
var fw = new Framework(),
    describe = fw.suite,
    it = fw.test,
    before = fw.before,
    after = fw.after,
    beforeEach = fw.beforeEach,
    afterEach = fw.afterEach;

describe.skip = fw.skipSuite;
it.skip = fw.skipTest;
describe.only = fw.onlySuite;
it.only = fw.onlyTest;
</script>
```

## API

### <u>class Framework</u>

This class is a test framework like [Mocha](https://github.com/mochajs/mocha).

#### *constructor*(void)

Creates an instance of this class.
This constructor receives no arguments.

#### .suite(title, cb) : void

Registers a test suite to a test tree.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this suite. |
| *cb*      | function | The callback function to create a test tree |

#### .test(title, cb) : void

Registers a test case to a test tree.

If *fn* is not specified, this test is regarded as a skipped test.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this test   |
| *cb*      | function | The callback function which runs a test case |

#### .before([ title, ] cb) : void

Registers a 'before' hook which runs before all suites and tests in the same level of this hook.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this hook (Optional) |
| *cb*      | function | The callback function of this hook |

#### .after([ title, ] cb) : void

Registers a 'after' hook which runs after all suites and tess in the same level of this hook.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this hook (Optional) |
| *cb*      | function | The callback function of this hook |

#### .beforeEach([ title, ] cb) : void

Registers a 'beforeEach' hook which runs before each test in the same and lower levels of this hook.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this hook (Optional) |
| *cb*      | function | The callback function of this hook |

#### .afterEach([ title, ] cb) : void

Registers a 'afterEach' hook which runs after each test in the same and lower levels of this hook. 

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this hook (Optional) |
| *cb*      | function | The callback function of this hook |

#### .skipSuite(title, fn) : void

Registers a skipped suite which skips all child suites and tests of this suite to a test tree.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this suite  |
| *cb*      | function | The callback function to create a test tree |

#### .skipTest(title, fn) : void

Registers a skipped test which skips all child suites and tests of this suite to a test tree.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this test   |
| *cb*      | function | The callback function of a test case |

#### .onlySuite(title, fn) : void

Registers an exclusive test suite which runs child tests in this suite exclusively.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this suite  |
| *cb*      | function | The callback function to create a test tree |

#### .onlyTest(title, fn) : void

Registers an exclusive test case.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *title*   | string   | The title of this test   |
| *cb*      | function | The callback function which runs a test case |

#### .run(cb) : void

Runs tests in the test tree of this framework object.

| Parameter | Type     | Description              |
|:----------|:--------:|:-------------------------|
| *cb*      | function | The callback function which run when all tests finished. |

#### .on(eventName, handler) : void

Registers an event handler.

| Parameter   | Type     | Description              |
|:------------|:--------:|:-------------------------|
| *eventName* | string   | An event name            |
| *handler*   | function | An event handler         |

## Events

#### 'start' event

Is fired when a suite or a test is started.
This event is fired even suite or test are skipped, but not when they are excluded by other `.onlySuite` or `.onlyTest`. 

#### 'succeed' event

Is fired when a test ends with no error.

#### 'error' event

Is fired when a test ends with errors.
This event is also fired when a test is timeout.

#### 'timeout' event

Is fired when a test is timeout.

#### 'skip' event

Is fired when a test is skipped.

#### 'end' event

Is fired when a suite or a test ends.
This event is fired even when a test is error or skipped, but not when they are excluded by other `.onlySuite` or `.onlyTest`.


## Checked

### Node.js (11〜)

| Platform  |   11   |
|:---------:|:------:|
| macOS     |&#x25ef;|
| Windows10 |&#x25ef;|
| Linux     |&#x25ef;|

### Node.js (4〜10)

| Platform  |   4    |   5    |   6    |   7    |   8    |   9    |   10   |
|:---------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### io.js (1〜3)

| Platform  |   1    |   2    |   3    |
|:---------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|

### Node.js (〜0.12)

| Platform  |  0.8   |  0.9   |  0.10  |  0.11  |  0.12  |
|:---------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### Web browsers

| Platform  | Chrome | Firefox | Vivaldi | Safari |  Edge  | IE11   |
|:---------:|:------:|:-------:|:-------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef; |&#x25ef; |&#x25ef;|   --   |   --   |
| Windows10 |&#x25ef;|&#x25ef; |&#x25ef; |   --   |&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef; |&#x25ef; |   --   |   --   |   --   |

## License

Copyright (C) 2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE is this distribution for more details.

[repo-url]: https://github.com/sttk/fav-test.framework/
[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.com/package/@fav/test.framework
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT
[travis-img]: https://travis-ci.org/sttk/fav-test.framework.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/fav-test.framework
[coverage-img]: https://coveralls.io/repos/github/sttk/fav-test.framework/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/fav-test.framework?branch=master
