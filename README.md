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
    suite = fw.suite,
    test = fw.test,
    before = fw.before,
    after = fw.after,
    beforeEach = fw.beforeEach,
    afterEach = fw.afterEach;
suite.skip = fw.skipSuite;
test.skip = fw.skipTest;
suite.only = fw.onlySuite;
test.only = fw.onlyTest;
```

```html
<script src="fav.test.framework.min.js"></script>
<script>
var Framework = fav.test.framework;
var fw = new Framework(),
    suite = fw.suite,
    test = fw.test,
    before = fw.before,
    after = fw.after,
    beforeEach = fw.beforeEach,
    afterEach = fw.afterEach;
suite.skip = fw.skipSuite;
test.skip = fw.skipTest;
suite.only = fw.onlySuite;
test.only = fw.onlyTest;
</script>
```

### 

## API


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