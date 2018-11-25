'use strict';

var define = require('@fav/prop.define');
var isFunction = require('@fav/type.is-function');
var $tatic = require('./static');
var runner = require('./util/async-runner');

function implement(fw) {
  define.mutable(fw, '_skip', { flag: false });
  define.mutable(fw, 'skip', { flag: false });

  fw.skipSuite = skipSuite.bind(fw);
  fw.skipTest = skipTest.bind(fw);
}

function skipSuite(title, fn) {
  var fw = this;
  var skipBak = fw._skip;
  fw._skip = { flag: true };
  $tatic.registerSuite(fw, title, fn);
  fw._skip = skipBak;
}

function skipTest(title, fn) {
  var fw = this;
  var skipBak = fw._skip;
  fw._skip = { flag: true };
  $tatic.registerTest(fw, title, fn);
  fw._skip = skipBak;
}

define.override($tatic, function registerSuite(fw, title, fn) {
  var skipBak = fw._skip;
  var suite = registerSuite.$uper(fw, title, fn);
  fw._skip = skipBak;
  return suite;
});

define.override($tatic, function createSuite(fw, title, fn) {
  var suite = createSuite.$uper(fw, title, fn);
  suite.skip = fw._skip;
  if (!isFunction(fn) && !suite.skip.flag) {
    throw $tatic.errorOfSuiteNoCallback(title);
  }
  return suite;
});

define.override($tatic, function createSuiteContext(suite) {
  var fw = suite._framework;
  var ctx = createSuiteContext.$uper(suite);
  ctx.skip = function() {
    fw._skip = { flag: true };
    suite.skip = { flag: true };
  };
  return ctx;
});

define.override($tatic, function runSuite(suite, cb) {
  if (suite.skip.flag) {
    var fw = suite._framework;
    fw.emit('start', suite);
    runner.runAsyncIndividually(suite._children, function() {
      fw.emit('end', suite);
      cb();
    });
    return;
  }
  runSuite.$uper(suite, cb);
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.skip = !isFunction(fn) ? { flag: true } : fw._skip;
  return test;
});

define.override($tatic, function createTestContext(test) {
  var ctx = createTestContext.$uper(test);
  ctx.skip = function() {
    test.skip = { flag: true };
    throw { skip: true };
  };
  return ctx;
});

define.override($tatic, function runTest(test, cb) {
  var fw = test._framework;
  if (test.skip.flag) {
    fw.emit('start', test);
    fw.emit('skip', test);
    fw.emit('end', test);
    cb();
    return;
  }
  runTest.$uper(test, cb);
});

define.override($tatic, function emitTestError(err, test) {
  if (test.skip.flag) {
    var fw = test._framework;
    fw.emit('skip', test);
    return;
  }
  emitTestError.$uper(err, test);
});

$tatic.errorOfSuiteNoCallback = function(title) {
  return new Error('Suite "' + title + '" was defined ' +
    'but no callback was supplied. ' +
    'Supply a callback or explicitly skip the suite.');
};

define.override($tatic, function createHook(fw, type, title, fn) {
  var hook = createHook.$uper(fw, type, title, fn);
  hook.skip = fw._skip;
  return hook;
});

define.override($tatic, function createHookContext(hook) {
  var ctx = createHookContext.$uper(hook);
  ctx.skip = function() {
    hook.skip.flag = true;
  };
  return ctx;
});

module.exports = implement;
