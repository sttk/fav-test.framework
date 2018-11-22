'use strict';

var assert = require('assert');
var test = require('../tool/test');
var run = require('../../lib/util/run-async').byCallback;

var implementEvents = require('../../lib/event');

test.desc('lib/util/run-async.js - runAsyncByCallback');

test.add('Run an async function', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);

  fw.on('error', function(node) {
    logs.push(node.title + node.error.message);
  });

  var ctx = {};
  var test = {
    fn: function(cb) {
      assert.notEqual(this, undefined);
      setTimeout(function() {
        logs.push('run test');
        cb();
      }, 1000);
    },
    _framework: fw,
  };
  var cb = function() {
    assert.deepEqual(logs, [
      'run test',
    ]);
    done();
  };

  run(test, ctx, cb);
});

test.add('Run a sync function', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);
  fw.on('error', function(node) {
    logs.push(node.title + node.error);
  });
  var ctx = {};
  var test = {
    fn: function(cb) {
      logs.push('run test');
      cb();
    },
    _framework: fw,
  };
  var cb = function() {
    assert.deepEqual(logs, [
      'run test',
    ]);
    done();
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
    fn: function(cb) {
      logs.push('run test - (1)');
      throw new TypeError('run error');
      logs.push('run test - (e)');
      cb();
    },
    _framework: fw,
  };
  var cb = function() {
    try {
      assert.deepEqual(logs, [
        'run test - (1)',
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

test.add('Pass an error to the callback function', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);
  fw.on('error', function(node) {
    logs.push(node.title + ' ' + node.error.message);
  });
  var ctx = {};
  var test = {
    title: 'Test',
    fn: function(cb) {
      assert.notEqual(this, undefined);
      setTimeout(function() {
        logs.push('run test - (1)');
        cb(new TypeError('run error'));
        logs.push('run test - (2)');
      }, 1000);
    },
    _framework: fw,
  };
  var cb = function() {
    try {
      assert.deepEqual(logs, [
        'run test - (1)',
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

test.add('Cause an error when run callback twice', function(done) {
  var logs = [];
  var fw = {};
  implementEvents(fw);
  fw.on('error', function(node) {
    logs.push(node.title + ' ' + node.error.message);
    assert.ok(node.error instanceof Error);
    assert.ok(node.error.message, 'done() called multiple times');
    done();
  });
  var ctx = {};
  var test = {
    title: 'Test',
    fn: function(cb) {
      assert.notEqual(this, undefined);
      logs.push('run test - (1)');
      cb();
      cb();
      logs.push('run test - (2)');
    },
    _framework: fw,
  };
  var count = 0;
  var cb = function() {
    if (count === 0) {
      assert.deepEqual(logs, [
        'run test - (1)',
      ]);
      count++;
    } else if (count === 1) {
      assert.fail();
    }
  };

  run(test, ctx, cb);
});

test.run();
