'use strict';

var $tatic = require('./static');
var define = require('./util/define');

var runAsync = require('./util/run-async');
var runAsyncByCallback = runAsync.byCallback;
var runAsyncByPromise = runAsync.byPromise;
var runAsyncSequentially = runAsync.sequentially;

function implement(/* fw */) {
}

define.override($tatic, function runHook(hook, cb) {
  var run = (hook.fn.length > 0) ? runAsyncByCallback : runAsyncByPromise;
  hook.context = $tatic.createHookContext(hook);
  run(hook, hook.context, cb);
});

define.override($tatic, function createHookContext(/* hook */) {
  return {};
});

define.override($tatic, function createSuite(fw, title, fn) {
  var suite = createSuite.$uper(fw, title, fn);
  suite.context = $tatic.createSuiteContext(suite);
  define.override(suite, function fn() {
    fn.$uper.call(suite.context, arguments);
  });
  return suite;
});

define.override($tatic, function createSuiteContext(/* suite */) {
  return {};
});

define.override($tatic, function runSuiteBefore(suite, cb) {
  runAsyncSequentially(suite._before, cb);
});

define.override($tatic, function runSuiteBody(suite, cb) {
  runAsyncSequentially(suite._children, cb);
});

define.override($tatic, function runSuiteAfter(suite, cb) {
  runAsyncSequentially(suite._after, cb);
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.context = $tatic.createTestContext(test);
  return test;
});

define.override($tatic, function runTestBefore(test, cb) {
  runAsyncSequentially(test._parent._beforeEach, cb);
});

define.override($tatic, function runTestBody(test, cb) {
  var run = (test.fn.length > 0) ? runAsyncByCallback : runAsyncByPromise;
  run(test, test.context, cb);
});

define.override($tatic, function runTestAfter(test, cb) {
  runAsyncSequentially(test._parent._afterEach, cb);
});

define.override($tatic, function createTestContext(/* test */) {
  return {};
});

define.override($tatic, function runTree(fw, cb) {
  $tatic.runSuite(fw, cb);
});

module.exports = implement;
