'use strict';

var assert = require('assert');
var test = require('../../tool/run-test');
var override = require('@fav/prop.define').override;

if (typeof global.Promise !== 'function') {
  global.Promise = require('promise-polyfill');
}

var runner = require('../../../lib/util/async-runner');

test.desc('lib/util/async-runner.js (by callback)');

test.add('Run an async function', function(done) {
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      assert.equal(this, ctx);
      logs.push('run - (1)');
      setTimeout(function() {
        logs.push('run - (2)');
        cb();
      }, 200);
    },
  };
  var cb = function(err) {
    try {
      assert.deepEqual(logs, [
        'run - (1)',
        'run - (2)',
      ]);
      assert.equal(err, undefined);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  };
  runner.runAsync(node, ctx, cb);
});

test.add('Run a sync function', function(done) {
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      assert.equal(this, ctx);
      logs.push('run');
      cb();
    }
  };
  var cb = function(err) {
    try {
      assert.deepEqual(logs, ['run']);
      assert.equal(err, undefined);
      done();
    } catch (e) {
      console.log(e);
      cb(e);
    }
  };
  runner.runAsync(node, ctx, cb);
});

test.add('Catch an error - async', function(done) {
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      assert.equal(this, ctx);
      logs.push('run - (1)');
      setTimeout(function() {
        logs.push('run - (2)');
        cb(new Error('async error'));
      }, 200);
    },
  };
  var cb = function(err) {
    try {
      assert.deepEqual(logs, [
        'run - (1)',
        'run - (2)',
      ]);
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'async error');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  };
  runner.runAsync(node, ctx, cb);
});

test.add('Catch an error - sync', function(done) {
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      assert.equal(this, ctx);
      logs.push('run');
      throw new Error('sync error');
      cb();
    },
  };
  var cb = function(err) {
    try {
      assert.deepEqual(logs, ['run']);
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'sync error');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  };
  runner.runAsync(node, ctx, cb);
});

test.add('Cause an error when running callback twice', function(done) {
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      assert.equal(this, ctx);
      logs.push('run - (1)');
      cb();
      cb();
      logs.push('run - (2)');
    },
  };
  var count = 0;
  var cb = function(err) {
    count++;
    if (count === 1) {
      assert.deepEqual(logs, ['run - (1)']);
      assert.equal(err, null);
    } else {
      assert.deepEqual(logs, ['run - (1)']);
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'done() called multiple times');
      done();
    }
  };
  runner.runAsync(node, ctx, cb);
});

test.add('Enable to ignore to running callback twice', function(done) {
  override(runner, function errorOfDoneTwice() {});
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      assert.equal(this, ctx);
      logs.push('run - (1)');
      cb();
      cb();
      logs.push('run - (2)');
    },
  };
  var count = 0;
  var cb = function(err) {
    count++;
    if (count === 1) {
      assert.deepEqual(logs, ['run - (1)']);
      assert.equal(err, null);
    } else {
      assert.deepEqual(logs, [
        'run - (1)',
      ]);
      assert.equal(err, undefined);
    }
  };
  runner.runAsync(node, ctx, cb);
  done();
});


test.add('Cause an error when using both promise and callback',
function(done) {
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      logs.push('run - (1)');
      return new Promise(function(resolve) {
        resolve();
      }).then(function() {
        logs.push('run - (2)');
        cb();
      });
    },
  };
  var cb = function(err) {
    try {
      assert.deepEqual(logs, ['run - (1)']);
      assert.ok(err instanceof Error);
      assert.equal(err.message,
        'Resolution method is overspecified. ' +
        'Specify a callback *or* return a Promise; not both.');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  };
  runner.runAsync(node, ctx, cb);
});

test.add('Enable to ignore to run as both promise and callback',
function(done) {
  override(runner, function errorOfBothPromiseAndCallback() {});
  var logs = [];
  var ctx = {};
  var node = {
    fn: function(cb) {
      logs.push('run - (1)');
      return new Promise(function(resolve) {
        logs.push('run - (2)');
        resolve();
      }).then(cb);
    },
  };
  var cb = function(err) {
    assert.deepEqual(logs, [
      'run - (1)',
      'run - (2)',
    ]);
    assert.equal(err, undefined);
    done();
  };
  runner.runAsync(node, ctx, cb);
});

test.run();

