'use strict';

var define = require('./util/define');
var $tatic = require('./static');
var isInteger = require('@fav/type.is-integer');

function implement(fw) {
  define.mutable(fw, '_slow', 100);
}

define.override($tatic, function registerSuite(fw, title, fn) {
  var slowBak = fw._slow;
  var suite = registerSuite.$uper(fw, title, fn);
  fw._slow = slowBak;
  return suite;
});

define.override($tatic, function createSuiteContext(suite) {
  var fw = suite._framework;
  var ctx = createSuiteContext.$uper(suite);
  ctx.slow = function(tm) {
    if (isInteger(tm)) {
      fw._slow = tm;
    }
  };
  return ctx;
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.slow = fw._slow;
  return test;
});

define.override($tatic, function createTestContext(test) {
  var ctx = createTestContext.$uper(test);
  ctx.slow = function(tm) {
    if (isInteger(tm)) {
      test.slow = tm;
    }
  };
  return ctx;
});

module.exports = implement;
