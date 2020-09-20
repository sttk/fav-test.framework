'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');

var runner = require('./util/async-runner');

function implement(/* fw */) {
}

/* istanbul ignore next */  /// overridden in timeout.js
define.override($tatic, function runHook(hook, cb) {
  var ctx = $tatic.createHookContext(hook);
  runner.runAsync(hook, ctx, cb);
});

$tatic.createHookContext = function(/* hook */) {
  return {};
};

define.override($tatic, function createSuite(fw, title, fn) {
  var suite = createSuite.$uper(fw, title, fn);
  var ctx = $tatic.createSuiteContext(suite);
  suite.fn = suite.fn.bind(ctx);
  return suite;
});

$tatic.createSuiteContext = function(/* suite */) {
  return {};
};

define.override($tatic, function runSuite(suite, cb) {
  var fw = suite._framework;
  var hooks = $tatic.listEachHooks(suite);

  if (hooks.hasError) {
    cb();
    fw.emit('end', suite);
    return;
  }

  fw.emit('start', suite);
  runner.runAsyncSequentially(suite._before, endBefore);

  function endBefore(err, hook) {
    if (err) {
      hook.error = err;
      $tatic.emitHookError(err, hook, suite);
      if (runner.isErrorOfDoneTwice(err)) {
        return;
      }
      runner.runAsyncSequentially(suite._after, endAfter);
      return;
    }
    runner.runAsyncIndividually(suite._children, function() {
      runner.runAsyncSequentially(suite._after, endAfter);
    });
  }

  function endAfter(err, hook) {
    if (err) {
      hook.error = err;
      $tatic.emitHookError(err, hook, suite);
      if (runner.isErrorOfDoneTwice(err)) {
        return;
      }
    }
    fw.emit('end', suite);
    cb(err);
  }
});

$tatic.runTest = function(test, cb) {
  var fw = test._framework;
  var hooks = $tatic.listEachHooks(test._parent);

  if (hooks.hasError) {
    fw.emit('end', test);
    cb();
    return;
  }

  fw.emit('start', test);
  $tatic.runTestRetriable(test, hooks, function() {
    fw.emit('end', test);
    cb();
  });
};

$tatic.emitHookError = function(err, hook, node) {
  var fw = node._framework;
  fw.emit('error', {
    type: hook.type,
    title: hook.title,
    depth: node.depth + 1,
    error: err,
    node: node,
  });
};

$tatic.runTestRetriable = function(test, hooks, cb) {
  runner.runAsyncSequentially(hooks.beforeEach, endBeforeEach);

  function endBeforeEach(err, hook) {
    if (err) {
      hook.error = err;
      $tatic.emitHookError(err, hook, test);
      if (runner.isErrorOfDoneTwice(err)) {
        return;
      }
      runner.runAsyncSequentially(hooks.afterEach, endAfterEach);
      return;
    }

    var ctx = $tatic.createTestContext(test);
    $tatic.runTestBody(test, ctx, function(err) {
      if (!err) {
        var fw = test._framework;
        fw.emit('succeed', test);
      } else {
        if (err instanceof Error) {
          test.error = err;
        }
        $tatic.emitTestError(err, test);
        if (runner.isErrorOfDoneTwice(err)) {
          return;
        }
      }
      runner.runAsyncSequentially(hooks.afterEach, endAfterEach);
    });
  }

  function endAfterEach(err, hook) {
    if (err) {
      hook.error = err;
      $tatic.emitHookError(err, hook, test);
      if (runner.isErrorOfDoneTwice(err)) {
        return;
      }
    }
    cb(err);
  }
};

$tatic.runTestBody = function(test, ctx, cb) {
  runner.runAsync(test, ctx, cb);
};

$tatic.createTestContext = function(/* test */) {
  return {};
};

$tatic.emitTestError = function(err, test) {
  var fw = test._framework;
  fw.emit('error', test);
};

module.exports = implement;
