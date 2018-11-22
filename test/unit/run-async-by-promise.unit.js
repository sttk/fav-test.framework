'use strict';

var assert = require('assert');
var test = require('../tool/test');
var run = require('../../lib/util/run-async').byPromise;

var implementEvents = require('../../lib/event');

test.desc('lib/util/run-async.js - runAsyncByPromise');

test.add('Run an promisified function', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);

  fw.on('error', function(node) {
    logs.push(node.title + ' ' + node.error.message);
  });

  var ctx = {};
  var test = {
    title: 'Test',
    fn: function() {
      logs.push('run before promise');
      return new Promise(function (resolve) {
        setTimeout(function() {
          logs.push('run resolved promise');
          resolve();
        }, 1000);
      });
    },
    _framework: fw,
  };
  var cb = function() {
    try {
      assert.deepEqual(logs, [
        'run before promise',
        'run resolved promise',
      ]);
      done();
    } catch (e) {
      done(e);
    }
  };

  run(test, ctx, cb);
});

test.add('Run a normal function', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);
  fw.on('error', function(node) {
    logs.push(node.title + ' ' + node.error.message);
  });
  var ctx = {};
  var test = {
    title: 'Test',
    fn: function() {
      logs.push('run non promise');
    },
    _framework: fw,
  };
  var cb = function() {
    try {
      assert.deepEqual(logs, [
        'run non promise',
      ]);
      done();
    } catch (e) {
      done(e);
    }
  };

  run(test, ctx, cb);
});

test.add('Catch an error', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);
  fw.on('error', function(node) {
    logs.push(node.title + ' ' + node.error.message);
  });
  var ctx = {};
  var test = {
    title: 'Test',
    fn: function() {
      logs.push('run non promise (1)');
      throw new TypeError('run error');
      logs.push('run non promise (2)');
    },
    _framework: fw,
  };
  var cb = function() {
    try {
      assert.deepEqual(logs, [
       'run non promise (1)',
       'Test run error',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  };

  run(test, ctx, cb);
});

test.add('Reject promise', function(done) {
  var logs = [];
  var ctx = {};
  var fw = {};
  implementEvents(fw);
  fw.on('error', function(node) {
    logs.push(node.title + ' ' + node.error.message);
  });
  var test = {
    title: 'Test',
    fn: function() {
      logs.push('run before promise');
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          logs.push('run rejected promise');
          reject(new TypeError('reject promise'));
        }, 1000);
      });
    },
    _framework: fw,
  };
  var cb = function() {
    try {
      assert.deepEqual(logs, [
        'run before promise',
        'run rejected promise',
        'Test reject promise',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  };

  run(test, ctx, cb);
});

test.run();
