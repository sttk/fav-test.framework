'use strict';

var define = require('./util/define');
var $tatic = require('./static');
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

define.override($tatic, function runTestRetriable(test, cb) {
  test.retried = test.retried || 0;
  runTestRetriable.$uper(test, function() {
    if (!test.error || test.retries <= test.retried) {
      cb();
      return;
    }
    setImmediate(function() {
      test.retried++;
      test.error = null;
      test.yet = true;
      runTestRetriable(test, cb);
    });
  });
});

module.exports = implement;
