'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');
var isInteger = require('@fav/type.is-integer');

var runner = require('./util/async-runner');

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

define.override($tatic, function createHook(fw, type, title, fn) {
  var hook = createHook.$uper(fw, type, title, fn);
  hook.timeout = fw._timeout;
  return hook;
});

define.override($tatic, function runHook(hook, cb) {
  var ctx = $tatic.createHookContext(hook);
  ctx.timeout = function(tm) {
    /* istanbul ignore else */
    if (hook.timer && isInteger(tm)) {
      hook.timeout = tm;
      setupTimer(hook, cb);
    }
  };

  hook.startTime = Date.now();
  setupTimer(hook, cb);

  runner.runAsync(hook, ctx, function(err) {
    if (hook.endTime == null) {
      hook.endTime = Date.now();
    }
    if (hook.timer) {
      clearTimeout(hook.timer);
      delete hook.timer;
    }
    if (!hook.isTimeout) {
      cb(err);
    }
  });
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.timeout = fw._timeout;
  return test;
});

define.override($tatic, function runTestBody(test, ctx, cb) {
  ctx.timeout = function(tm) {
    /* istanbul ignore else */
    if (test.timer && isInteger(tm)) {
      test.timeout = tm;
      setupTimer(test, cb);
    }
  };

  test.startTime = Date.now();
  setupTimer(test, cb);
  runTestBody.$uper(test, ctx, function(err) {
    if (test.endTime == null) {
      test.endTime = Date.now();
    }
    if (test.timer) {
      clearTimeout(test.timer);
      delete test.timer;
    }
    if (!test.isTimeout) {
      cb(err);
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
    clearTimeout(test.timer);
    delete test.timer;

    define.immutable(test, 'isTimeout', true);
    cb($tatic.errorOfTimeout(test));
  }, test.timeout - (Date.now() - test.startTime));
}

$tatic.errorOfTimeout = function(test) {
  var fw = test._framework;
  fw.emit('timeout', test);
  return new Error('Timeout of ' + test.timeout + 'ms exceeded. ' +
    'For async tests and hooks, ensure "done()" is called; ' +
    'if returning a Promise, ensure it resolves.');
};

module.exports = implement;
