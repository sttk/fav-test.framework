'use strict';

var $tatic = require('./static');
var runner = require('./util/async-runner');
var define = require('@fav/prop.define');
var isInteger = require('@fav/type.is-integer');

function implement(fw) {
  define.mutable(fw, '_retries', 0);
}

define.override($tatic, function registerSuite(fw, title, fn) {
  var retriesBak = fw._retries;
  var suite = registerSuite.$uper(fw, title, fn);
  fw._retries = retriesBak;
  return suite;
});

define.override($tatic, function createSuiteContext(suite) {
  var fw = suite._framework;
  var ctx = createSuiteContext.$uper(suite);
  ctx.retries = function(n) {
    if (isInteger(n)) {
      fw._retries = n;
    }
  };
  return ctx;
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.retries = fw._retries;
  return test;
});

define.override($tatic, function createTestContext(test) {
  var ctx = createTestContext.$uper(test);
  ctx.retries = function(n) {
    if (isInteger(n)) {
      test.retries = n;
    }
  };
  return ctx;
});

define.override($tatic, function runTestRetriable(test, hooks, cb) {
  test._retried = test._retried || 0;
  runTestRetriable.$uper(test, hooks, function() {
    if (!test.error || test.retries <= test._retried) {
      cb();
      return;
    }
    runner.setImmediate(function() {
      test._retried++;
      test.error = null;
      runTestRetriable(test, hooks, cb);
    });
  });
});

define.override($tatic, function emitTestError(err, test) {
  if (test.retries > test._retried) {
    var fw = test._framework;
    fw.emit('retry', test);
    return;
  }
  emitTestError.$uper(err, test);
});

module.exports = implement;
