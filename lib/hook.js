'use strict';

var define = require('./util/define');
var callback = require('./util/callback');
var $tatic = require('./static');
var isFunction = require('@fav/type.is-function');

function implement(fw) {
  define.mutable(fw, '_before', []);
  define.mutable(fw, '_after', []);
  define.mutable(fw, '_beforeEach', []);
  define.mutable(fw, '_afterEach', []);

  define.method(fw, 'before', before);
  define.method(fw, 'after', after);
  define.method(fw, 'beforeEach', beforeEach);
  define.method(fw, 'afterEach', afterEach);
}

function before(title, fn) {
  var fw = this;
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerBefore(fw, title, fn);
}

function after(title, fn) {
  var fw = this;
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerAfter(fw, title, fn);
}

function beforeEach(title, fn) {
  var fw = this;
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerBeforeEach(fw, title, fn);
}

function afterEach(title, fn) {
  var fw = this;
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerAfterEach(fw, title, fn);
}

define.override($tatic, function registerBefore(fw, title, fn) {
  fw._current._before.push($tatic.createHook(fw, title, fn));
});

define.override($tatic, function registerAfter(fw, title, fn) {
  fw._current._after.push($tatic.createHook(fw, title, fn));
});

define.override($tatic, function registerBeforeEach(fw, title, fn) {
  fw._current._beforeEach.push($tatic.createHook(fw, title, fn));
});

define.override($tatic, function registerAfterEach(fw, title, fn) {
  fw._current._afterEach.push($tatic.createHook(fw, title, fn));
});

define.override($tatic, function createHook(fw, title, fn) {
  return {
    title: title,
    fn: fn,
    run: $tatic.runHook,
    _framework: fw,
  };
});

define.override($tatic, function runHook(hook) {
  hook.fn();
});

define.override($tatic, function createSuite(fw, title, fn) {
  var suite = createSuite.$uper(fw, title, fn);
  suite._before = [];
  suite._after = [];
  suite._beforeEach = suite._parent._beforeEach.slice();
  suite._afterEach = suite._parent._afterEach.slice();
  return suite;
});

define.override($tatic, function runSuite(suite, cb) {
  var fw = suite._framework;
  fw.emit('start', suite);
  $tatic.runSuiteBefore(suite, function() {
    $tatic.runSuiteBody(suite, function() {
      $tatic.runSuiteAfter(suite, function() {
        fw.emit('end', suite);
        callback(cb);
      });
    });
  });
});

define.override($tatic, function runSuiteBefore(suite, cb) {
  suite._before.forEach($tatic.runHook);
  cb();
});

define.override($tatic, function runSuiteBody(suite, cb) {
  suite._children.forEach(function(child) {
    child.run(child);
  });
  cb();
});

define.override($tatic, function runSuiteAfter(suite, cb) {
  suite._after.forEach($tatic.runHook);
  cb();
});

define.override($tatic, function runTest(test, cb) {
  var fw = test._framework;
  fw.emit('start', test);
  $tatic.runTestRetriable(test, function() {
    fw.emit('end', test);
    callback(cb);
  });
});

define.override($tatic, function runTestRetriable(test, cb) {
  $tatic.runTestBefore(test, function() {
    $tatic.runTestBody(test, function() {
      $tatic.runTestAfter(test, cb);
    });
  });
});

define.override($tatic, function runTestBefore(test, cb) {
  test._parent._beforeEach.forEach($tatic.runHook);
  cb();
});

define.override($tatic, function runTestBody(test, cb) {
  test.fn();
  cb();
});

define.override($tatic, function runTestAfter(test, cb) {
  test._parent._afterEach.forEach($tatic.runHook);
  cb();
});

module.exports = implement;
