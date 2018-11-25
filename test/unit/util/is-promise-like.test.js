'use strict';

var assert = require('assert');
var test = require('../../tool/run-test');

if (typeof global.Promise !== 'function') {
  global.Promise = require('promise-polyfill');
}

var isPromiseLike = require('../../../lib/util/is-promise-like');

test.desc('lib/util/is-promise-like.js');

test.add('Should return true when Promise', function(done) {
  function fn() {}
  assert.equal(isPromiseLike(new Promise(fn)), true);
  assert.equal(isPromiseLike(Promise.resolve(fn)), true);
  assert.equal(isPromiseLike(new Promise(function() {}).then(fn)), true);
  done();
});

test.add('Should return true when the like Promise', function(done) {
  function fn() {}
  assert.equal(isPromiseLike({ then: fn, catch: fn }), true);
  assert.equal(isPromiseLike({ then: fn }), true);
  assert.equal(isPromiseLike({ catch: fn }), true);
  done();
});

test.add('Should return false when not like Promise', function(done) {
  assert.equal(isPromiseLike({}), false);
  done();
});

test.add('Should return false when other types', function(done) {
  done();
});

test.run();
