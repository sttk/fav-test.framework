'use strict';

var assert = require('assert');
var test = require('../tool/test');
var run = require('../../lib/util/run-async').parallelly;

test.desc('lib/util/run-async - runAsyncParallelly');

test.add('Run async functions parallelly', function(done) {
  var logs = [];

  function runTest(test, cb) {
    logs.push(test.title + ' - (1)');
    var tm;
    switch (test.title) {
      case 'case 1': tm = 100; break;
      case 'case 2': tm = 1000; break;
      case 'case 3': tm = 500; break;
    }
    setTimeout(function() {
      logs.push(test.title + ' - (2)');
      cb();
    }, tm);
  };

  var nodes = [
    { title: 'case 1', run: runTest },
    { title: 'case 2', run: runTest },
    { title: 'case 3', run: runTest },
  ];
  var cb = function() {
    assert.deepEqual(logs, [
      'case 1 - (1)',
      'case 2 - (1)',
      'case 3 - (1)',
      'case 1 - (2)',
      'case 3 - (2)',
      'case 2 - (2)',
    ]);
    done();
  };

  run(nodes, cb);
});

test.add('Run sync functions parallelly', function(done) {
  var logs = [];
  function runTest(test, cb) {
    logs.push(test.title + ' run');
    cb();
  };
  var nodes = [
    { title: 'case 1', run: runTest },
    { title: 'case 2', run: runTest },
    { title: 'case 3', run: runTest },
  ];
  var cb = function() {
    assert.deepEqual(logs, [
      'case 1 run',
      'case 2 run',
      'case 3 run',
    ]);
    done();
  };

  run(nodes, cb);
});

test.add('Run no test', function(done) {
  var logs = [];
  var nodes = [];
  var cb = function() {
    try {
      assert.deepEqual(logs, []);
      done();
    } catch (e) {
      done(e);
    }
  };

  run(nodes, cb);
});

test.run();
