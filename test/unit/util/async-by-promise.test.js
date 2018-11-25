'use strict';

var assert = require('assert');
var test = require('../../tool/run-test');

if (typeof global.Promise !== 'function') {
  global.Promise = require('promise-polyfill');
}

var runner = require('../../../lib/util/async-runner');

test.desc('lib/util/async-runner.js (by promise)');

test.add('Run an async function', function(done) {
  var logs = [];
  var ctx = {};
  var test = {
    fn: function() {
      logs.push('run before promise');
      return new Promise(function(resolve) {
        setTimeout(function() {
          logs.push('run resolve of promise');
          resolve();
        }, 300);
      });
    },
  };
  var cb = function() {
    assert.deepEqual(logs, [
      'run before promise',
      'run resolve of promise',
    ]);
    done();
  };

  runner.runAsync(test, ctx, cb);
});

test.add('Run a sync function', function(done) {
  var logs = [];
  var ctx = {};
  var test = {
    fn: function() {
      logs.push('run non-promisified function');
    },
  };
  var cb = function() {
    assert.deepEqual(logs, [
      'run non-promisified function',
    ]);
    done();
  };

  runner.runAsync(test, ctx, cb);
});

test.add('Catch an error - async', function(done) {
  var logs = [];
  var ctx = {};
  var test = {
    fn: function() {
      logs.push('run non-promisified function (1)');
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          logs.push('run non-promisified function (2)');
          reject(new TypeError('run error'));
        }, 300);
      });
    },
  };
  var cb = function(err) {
    assert.deepEqual(logs, [
      'run non-promisified function (1)',
      'run non-promisified function (2)',
    ]);
    assert.ok(err instanceof TypeError);
    assert.equal(err.message, 'run error');
    done();
  };

  runner.runAsync(test, ctx, cb);
});

test.add('Catch an error - sync', function(done) {
  var logs = [];
  var ctx = {};
  var test = {
    fn: function() {
      logs.push('run non-promisified function');
      throw new TypeError('run error');
    },
  };
  var cb = function(err) {
    assert.deepEqual(logs, [
      'run non-promisified function',
    ]);
    assert.ok(err instanceof TypeError);
    assert.equal(err.message, 'run error');
    done();
  };

  runner.runAsync(test, ctx, cb);
});

test.run();
