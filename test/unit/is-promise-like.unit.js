'use strict';

var assert = require('assert');
var test = require('../tool/test');

var isPromiseLike = require('../../lib/util/is-promise-like');

test.desc('lib/util/is-promise-like.js');

test.add('isPromiseLike - Promise', function(done) {
  assert.strictEqual(isPromiseLike(new Promise(function() {})), true);
  done();
});

test.add('isPromiseLike - Object like Promise', function(done) {
  function fn() {}
  assert.strictEqual(isPromiseLike({ then: fn, catch: fn }), true);
  done();
});

test.add('isPromiseLike - Object not like Promise', function(done) {
  assert.strictEqual(isPromiseLike({}), false);
  done();
});

test.add('isPromiseLike - Any type', function(done) {
  assert.strictEqual(isPromiseLike(undefined), false);
  assert.strictEqual(isPromiseLike(null), false);
  assert.strictEqual(isPromiseLike(false), false);
  assert.strictEqual(isPromiseLike(false), false);
  assert.strictEqual(isPromiseLike(0), false);
  assert.strictEqual(isPromiseLike(123), false);
  assert.strictEqual(isPromiseLike(''), false);
  assert.strictEqual(isPromiseLike('ABC'), false);
  assert.strictEqual(isPromiseLike([]), false);
  assert.strictEqual(isPromiseLike(new Date()), false);
  done();
});

test.run();
