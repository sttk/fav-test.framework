'use strict';

var define = require('./util/define');
var $tatic = require('./static');
var isInteger = require('@fav/type.is-integer');

function implement(fw) {
  define.mutable(fw, '_timeout', 2000);
}

define.override($tatic, function registerSuite(fw, title, fn) {
  var timeoutBak = fw._timeout;
  var suite = registerSuite.$uper(fw, title, fn);
  fw._timeout = timeoutBak;
  return suite;
});

define.override($tatic, function createSuiteContext(suite) {
  var fw = suite._framework;
  var ctx = createSuiteContext.$uper(suite);
  ctx.timeout = function(tm) {
    if (isInteger(tm)) {
      fw._timeout = tm;
    }
  };
  return ctx;
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.timeout = fw._timeout;
  return test;
});

define.override($tatic, function runTestBody(test, cb) {
  test.context.timeout = function(tm) {
    /* istanbul ignore else */
    if (test.timer && isInteger(tm)) {
      test.timeout = tm;
      setupTimer(test, cb);
    }
  };

  test.startTime = Date.now();
  setupTimer(test, cb);
  runTestBody.$uper(test, function() {
    if (test.timer || !test.timeout) {
      test.endTime = Date.now();
      clearTimeout(test.timer);
      delete test.timer;
      cb();
    }
  });
});

function setupTimer(test, cb) {
  clearTimeout(test.timer);

  if (!test.timeout) {
    delete test.timer;
    return;
  }

  test.timer = setTimeout(function() {
    test.endTime = Date.now();
    test.isTimeout = true;

    clearTimeout(test.timer);
    delete test.timer;
    delete test.yet;

    var fw = test._framework;
    fw.emit('timeout', test);
    cb();
  }, test.timeout - (Date.now() - test.startTime));
}

module.exports = implement;
