'use strict';

var assert = require('assert');
var test = require('../../tool/run-test');

var runner = require('../../../lib/util/async-runner');

test.desc('lib/util/async-runner.js - (sequentially)');

test.add('Run async functions sequentially', function(done) {
  var logs = [];
  function runTest(test, cb) {
    logs.push(test.title + ' - (1)');
    setTimeout(function() {
      logs.push(test.title + ' - (2)');
      cb();
    }, 200);
  }
  var nodes = [
    { title: 'case 1', run: runTest },
    { title: 'case 2', run: runTest },
    { title: 'case 3', run: runTest },
  ];
  var cb = function() {
    assert.deepEqual(logs, [
      'case 1 - (1)',
      'case 1 - (2)',
      'case 2 - (1)',
      'case 2 - (2)',
      'case 3 - (1)',
      'case 3 - (2)',
    ]);
    done();
  };

  runner.runAsyncSequentially(nodes, cb);
});

test.add('Run no test', function(done) {
  var logs = [];
  var nodes = [];
  var cb = function() {
    assert.deepEqual(logs, []);
    done();
  };

  runner.runAsyncSequentially(nodes, cb);
});

test.add('Catch an error and stop', function(done) {
  var logs = [];
  function runTest(test, cb) {
    logs.push(test.title + ' - (1)');
    setTimeout(function() {
      logs.push(test.title + ' - (2)');
      cb(new TypeError('run error'));
    }, 200);
  }
  var nodes = [
    { title: 'case 1', run: runTest },
    { title: 'case 2', run: runTest },
    { title: 'case 3', run: runTest },
  ];
  var cb = function(err) {
    assert.deepEqual(logs, [
      'case 1 - (1)',
      'case 1 - (2)',
    ]);
    assert.ok(err instanceof TypeError);
    assert.equal(err.message, 'run error');
    done();
  };

  runner.runAsyncSequentially(nodes, cb);
});

test.run();
