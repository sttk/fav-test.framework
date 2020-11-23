(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.test||(g.test = {}));g.framework = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var implementEvent = require('./lib/event');
var implementTree = require('./lib/tree');
var implementHook = require('./lib/hook');
var implementAsync = require('./lib/async');
var implementRetry = require('./lib/retry');
var implementTimeout = require('./lib/timeout');
var implementSlow = require('./lib/slow');
var implementOnly = require('./lib/only');
var implementSkip = require('./lib/skip');

function Framework() {
  /* istanbul ignore if */
  if (!(this instanceof Framework)) {
    return new Framework();
  }

  implementEvent(this);
  implementTree(this);
  implementHook(this);
  implementAsync(this);
  implementRetry(this);
  implementTimeout(this);
  implementSlow(this);
  implementOnly(this);
  implementSkip(this);
}

module.exports = Framework;

},{"./lib/async":2,"./lib/event":3,"./lib/hook":4,"./lib/only":5,"./lib/retry":6,"./lib/skip":7,"./lib/slow":8,"./lib/timeout":10,"./lib/tree":11}],2:[function(require,module,exports){
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
    fn: hook.fn,
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

},{"./static":9,"./util/async-runner":12,"@fav/prop.define":16}],3:[function(require,module,exports){
'use strict';

var define = require('@fav/prop.define');
var isArray = require('@fav/type.is-array');

function implement(fw) {
  define.immutable(fw, '_eventHandlers', {});

  fw.on = register;
  fw.emit = emit;
}

function register(eventName, eventHandler) {
  if (!isArray(this._eventHandlers[eventName])) {
    define.immutable(this._eventHandlers, eventName, []);
  }
  this._eventHandlers[eventName].push(eventHandler);
}

function emit(eventName /* , ...args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  var arr = this._eventHandlers[eventName];
  if (isArray(arr)) {
    for (var i = 0, n = arr.length; i < n; i++) {
      var fn = arr[i];
      fn.apply(this, args);
    }
  }
}

module.exports = implement;

},{"@fav/prop.define":16,"@fav/type.is-array":17}],4:[function(require,module,exports){
'use strict';

var define = require('@fav/prop.define');
var callback = require('./util/callback');
var $tatic = require('./static');
var isFunction = require('@fav/type.is-function');

function implement(fw) {
  define.mutable(fw, '_before', []);
  define.mutable(fw, '_after', []);
  define.mutable(fw, '_beforeEach', []);
  define.mutable(fw, '_afterEach', []);

  fw.before = before.bind(fw);
  fw.after = after.bind(fw);
  fw.beforeEach = beforeEach.bind(fw);
  fw.afterEach = afterEach.bind(fw);
}

function before(title, fn) {
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerBefore(this, title, fn);
}

function after(title, fn) {
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerAfter(this, title, fn);
}

function beforeEach(title, fn) {
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerBeforeEach(this, title, fn);
}

function afterEach(title, fn) {
  if (isFunction(title)) {
    fn = title;
    title = fn.name || '';
  }
  $tatic.registerAfterEach(this, title, fn);
}

$tatic.registerBefore = function(fw, title, fn) {
  fw._current._before.push($tatic.createHook(fw, 'before', title, fn));
};

$tatic.registerAfter = function(fw, title, fn) {
  fw._current._after.push($tatic.createHook(fw, 'after', title, fn));
};

$tatic.registerBeforeEach = function(fw, title, fn) {
  fw._current._beforeEach.push($tatic.createHook(fw, 'beforeEach', title, fn));
};

$tatic.registerAfterEach = function(fw, title, fn) {
  fw._current._afterEach.push($tatic.createHook(fw, 'afterEach', title, fn));
};

$tatic.createHook = function(fw, type, title, fn) {
  return {
    title: title,
    type: type,
    fn: isFunction(fn) ? fn : $tatic.noop,
    run: $tatic.runHook,
    _framework: fw,
  };
};

/* istanbul ignore next */  /// overridden in async.js
$tatic.runHook = function(hook) {
  hook.fn();
};

define.override($tatic, function createSuite(fw, title, fn) {
  var suite = createSuite.$uper(fw, title, fn);
  suite._before = [];
  suite._after = [];
  suite._beforeEach = [];
  suite._afterEach = [];
  return suite;
});

/* istanbul ignore next */  /// overridden in async.js
define.override($tatic, function runSuite(suite, cb) {
  var fw = suite._framework;
  fw.emit('start', suite);
  suite._before.forEach(runNode);
  suite._children.forEach(runNode);
  suite._after.forEach(runNode);
  fw.emit('end', suite);
  callback(cb);
});

/* istanbul ignore next */  /// overridden in async.js
define.override($tatic, function runTest(test, cb) {
  var fw = test._framework;
  var hooks = $tatic.listEachHooks(test._parent);

  fw.emit('start', test);
  hooks.beforeEach.forEach(runNode);
  test.fn();
  hooks.afterEach.forEach(runNode);
  fw.emit('end', test);
  callback(cb);
});

$tatic.listEachHooks = function(node) {
  var beforeEach = [];
  var afterEach = [];
  var hasError = false;

  while (node) {
    var hooks = node._beforeEach;
    for (var i = hooks.length - 1; i >= 0; i--) {
      beforeEach.unshift(hooks[i]);
      hasError = hasError || Boolean(hooks[i].error);
    }
    hooks = node._afterEach;
    for (var j = hooks.length - 1; j >= 0; j--) {
      afterEach.unshift(hooks[j]);
      hasError = hasError || Boolean(hooks[j].error);
    }
    node = node._parent;
  }
  return {
    beforeEach: beforeEach,
    afterEach: afterEach,
    hasError: hasError,
  };
};

/* istanbul ignore next */  /// used only in overridden methods
function runNode(node) {
  node.run(node);
}

module.exports = implement;


},{"./static":9,"./util/callback":13,"@fav/prop.define":16,"@fav/type.is-function":18}],5:[function(require,module,exports){
'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');

function implement(fw) {
  define.mutable(fw, '_hasOnly', false);
  define.mutable(fw, '_only', { flag: false });
  define.mutable(fw, 'only', { flag: true });

  fw.onlySuite = onlySuite.bind(fw);
  fw.onlyTest = onlyTest.bind(fw);
}

function onlySuite(title, fn) {
  var fw = this;
  if (fw._only.flag) {
    fw._only.flag = false;
  }
  fw._only = { flag: true };
  var suite = $tatic.registerSuite(fw, title, fn);
  fw._only = { flag: true }; // Because fw._only may be updated by child node.
  updateOnlyFlagsOfAscendants(suite, fw._only);
  fw._only = { flag: false };
  fw._hasOnly = true;
}

function onlyTest(title, fn) {
  var fw = this;
  if (fw._only.flag) {
    fw._only.flag = false;
  }
  fw._only = { flag: true };
  var test = $tatic.registerTest(fw, title, fn);
  updateOnlyFlagsOfAscendants(test, fw._only);
  fw._only = { flag: false };
  fw._hasOnly = true;
}

function updateOnlyFlagsOfAscendants(node, only) {
  var fw = node._framework;
  while (node._parent !== fw) {
    node = node._parent;
    node.only = only;
  }
}

define.override($tatic, function createSuite(fw, title, fn) {
  var suite = createSuite.$uper(fw, title, fn);
  suite.only = fw._only;
  return suite;
});

define.override($tatic, function runSuite(suite, cb) {
  var fw = suite._framework;
  if (fw._hasOnly && !suite.only.flag) {
    cb();
    return;
  }
  runSuite.$uper(suite, cb);
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.only = fw._only;
  return test;
});

define.override($tatic, function runTest(test, cb) {
  var fw = test._framework;
  if (fw._hasOnly && !test.only.flag) {
    cb();
    return;
  }
  runTest.$uper(test, cb);
});

module.exports = implement;

},{"./static":9,"@fav/prop.define":16}],6:[function(require,module,exports){
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
      clearEndTime(test);
      hooks.beforeEach.forEach(clearEndTime);
      hooks.afterEach.forEach(clearEndTime);
      runTestRetriable(test, hooks, cb);
    });
  });
});

function clearEndTime(node) {
  node.endTime = null;
}

define.override($tatic, function emitTestError(err, test) {
  if (test.retries > test._retried) {
    var fw = test._framework;
    fw.emit('retry', test);
    return;
  }
  emitTestError.$uper(err, test);
});

module.exports = implement;

},{"./static":9,"./util/async-runner":12,"@fav/prop.define":16,"@fav/type.is-integer":19}],7:[function(require,module,exports){
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

},{"./static":9,"./util/async-runner":12,"@fav/prop.define":16,"@fav/type.is-function":18}],8:[function(require,module,exports){
'use strict';

var define = require('@fav/prop.define');
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

},{"./static":9,"@fav/prop.define":16,"@fav/type.is-integer":19}],9:[function(require,module,exports){
'use strict';

/* This is an object to hanging static (non-context) functions */
module.exports = {
  noop: function() {},
};

},{}],10:[function(require,module,exports){
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

},{"./static":9,"./util/async-runner":12,"@fav/prop.define":16,"@fav/type.is-integer":19}],11:[function(require,module,exports){
'use strict';

var $tatic = require('./static');
var callback = require('./util/callback');
var define = require('@fav/prop.define');
var isFunction = require('@fav/type.is-function');

function implement(fw) {
  define.immutable(fw, '_children', []);
  define.immutable(fw, '_framework', fw);
  define.mutable(fw, '_current', fw);
  define.immutable(fw, 'depth', 0);

  fw.suite = suite.bind(fw);
  fw.test = test.bind(fw);
  fw.run = run.bind(fw);
}

function suite(title, fn) {
  $tatic.registerSuite(this, title, fn);
}
function test(title, fn) {
  $tatic.registerTest(this, title, fn);
}
function run(cb) {
  $tatic.runTree(this, cb || $tatic.noop);
}

$tatic.registerSuite = function(fw, title, fn) {
  var suite = $tatic.createSuite(fw, title, fn);
  fw._current._children.push(suite);

  fw._current = suite;
  suite.fn();
  fw._current = suite._parent;

  return suite;
};


$tatic.createSuite = function(fw, title, fn) {
  return {
    type: 'suite',
    title: title,
    depth: fw._current.depth + 1,
    fn: isFunction(fn) ? fn : $tatic.noop,
    run: $tatic.runSuite,
    _parent: fw._current,
    _children: [],
    _framework: fw,
  };
};

/* istanbul ignore next */  /// overridden in `hook.js`
$tatic.runSuite = function(suite, cb) {
  var fw = suite._framework;
  fw.emit('start', suite);
  suite._children.forEach(function(child) {
    child.run(child);
  });
  fw.emit('end', suite);
  callback(cb);
};

$tatic.registerTest = function(fw, title, fn) {
  var test = $tatic.createTest(fw, title, fn);
  fw._current._children.push(test);
  return test;
};

$tatic.createTest = function(fw, title, fn) {
  return {
    type: 'test',
    title: title,
    depth: fw._current.depth + 1,
    fn: isFunction(fn) ? fn : $tatic.noop,
    run: $tatic.runTest,
    _parent: fw._current,
    _children: [],
    _framework: fw,
  };
};

/* istanbul ignore next */  /// overridden in hook.js
$tatic.runTest = function(test, cb) {
  var fw = test._framework;
  fw.emit('start', test);
  test.fn();
  fw.emit('end', test);
  callback(cb);
};

$tatic.runTree = function(fw, cb) {
  $tatic.runSuite(fw, cb);
};

module.exports = implement;

},{"./static":9,"./util/callback":13,"@fav/prop.define":16,"@fav/type.is-function":18}],12:[function(require,module,exports){
(function (setImmediate){
'use strict';

var define = require('@fav/prop.define');
var isPromiseLike = require('./is-promise-like');
var dontTwice = require('./dont-twice');

var runner = {};

runner.runAsync = function(node, ctx, cb) {
  try {
    if (node.fn.length > 0) {
      runner.runAsyncByCallback(node, ctx, cb);
      return;
    }
    runner.runAsyncByPromise(node, ctx, cb);
  } catch (e) {
    cb(e);
  }
};

runner.runAsyncByPromise = function(node, ctx, cb) {
  var promise = node.fn.call(ctx);
  if (!isPromiseLike(promise)) {
    cb();
    return;
  }
  promise.then(function() { // Promise can pass value to thennable,
    cb();        // but callback args must be nullish if succeeded.
  }).catch(cb);
};

runner.runAsyncByCallback = function(node, ctx, cb) {
  return node.fn.call(ctx, cb);
};

define.override(runner, function runAsyncByCallback(node, ctx, cb) {
  var done = dontTwice(cb, function() {
    var err = runner.errorOfDoneTwice(node);
    if (err) {
      cb(err);
    }
  });
  return runAsyncByCallback.$uper(node, ctx, done);
});

runner.errorOfDoneTwice = function(/* node */) {
  var err = new Error('done() called multiple times');
  define.immutable(err, 'isDoneTwice', true);
  return err;
};

runner.isErrorOfDoneTwice = function(err) {
  return err.isDoneTwice;
};

define.override(runner, function runAsyncByCallback(node, ctx, cb) {
  var isBothPromiseAndCallback = false;

  var done = function(err) {
    if (!isBothPromiseAndCallback) {
      cb(err);
    }
  };
  var ret = runAsyncByCallback.$uper(node, ctx, done);

  if (isPromiseLike(ret)) {
    var err = runner.errorOfBothPromiseAndCallback(node);
    if (err) {
      isBothPromiseAndCallback = true;
      cb(err);
    }
  }
  return ret;
});

runner.errorOfBothPromiseAndCallback = function(/* node */) {
  return new Error(
    'Resolution method is overspecified. ' +
    'Specify a callback *or* return a Promise; not both.');
};

runner.runAsyncSequentially = function(nodes, cb) {
  runner.runAsyncRecursively(nodes, cb, true, 0);
};

runner.runAsyncIndividually = function(nodes, cb) {
  runner.runAsyncRecursively(nodes, cb, false, 0);
};

runner.runAsyncRecursively = function(nodes, cb, stopOnError, index) {
  if (index >= nodes.length) {
    cb();
    return;
  }

  var node = nodes[index];
  runner.setImmediate(function() {
    node.run(node, function(err) {
      if (err && stopOnError) {
        cb(err, node);
        return;
      }
      runner.runAsyncRecursively(nodes, cb, stopOnError, index + 1);
    });
  });
};

/* istanbul ignore next */
if (typeof setImmediate === 'function') {
  runner.setImmediate = setImmediate;
} else {
  runner.setImmediate = function(fn) {
    setTimeout(fn, 0);
  };
}

module.exports = runner;

}).call(this,require("timers").setImmediate)
},{"./dont-twice":14,"./is-promise-like":15,"@fav/prop.define":16,"timers":21}],13:[function(require,module,exports){
'use strict';

var isFunction = require('@fav/type.is-function');

function callback(cb, err) {
  if (isFunction(cb)) {
    cb(err);
  }
}

module.exports = callback;

},{"@fav/type.is-function":18}],14:[function(require,module,exports){
'use strict';

var define = require('@fav/prop.define');

function dontTwice(fn, errorFn) {
  return function() {
    if (fn._called) {
      errorFn();
      return;
    }
    define.immutable(fn, '_called', true);
    return fn.apply(this, arguments);
  };
}

module.exports = dontTwice;

},{"@fav/prop.define":16}],15:[function(require,module,exports){
'use strict';

var isFunction = require('@fav/type.is-function');

function isPromiseLike(obj) {
  return Boolean(obj) &&
         typeof obj === 'object' &&
         (isFunction(obj.then) || isFunction(obj.catch));
}

module.exports = isPromiseLike;

},{"@fav/type.is-function":18}],16:[function(require,module,exports){
'use strict';

var isFunction = require('@fav/type.is-function');

exports.immutable = function(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
  });
};

exports.mutable = function(obj, name, value) {
  Object.defineProperty(obj, name, {
    writable: true,
    configurable: true,
    value: value,
  });
};

exports.override = function(obj, name, fn) {
  if (isFunction(name)) {
    fn = name;
    if (!(name = fn.name || getFunctionName(fn))) {
      return;
    }
  }

  var superFn = obj[name];
  if (isFunction(superFn)) {
    Object.defineProperty(fn, '$uper', {
      value: superFn.bind(obj),
    });
  }

  Object.defineProperty(obj, name, {
    enumerable: true,
    writable: true,
    value: fn,
  });
};

/* istanbul ignore next */
function getFunctionName(fn) {  // for IE11
  var result = /^\s*function ([^(]+)\(/.exec(fn.toString());
  if (result) {
    return result[1];
  }
}

},{"@fav/type.is-function":18}],17:[function(require,module,exports){
'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !Array.isArray(value);
}

Object.defineProperty(isArray, 'not', {
  enumerable: true,
  value: isNotArray,
});

module.exports = isArray;

},{}],18:[function(require,module,exports){
'use strict';

function isFunction(value) {
  return (typeof value === 'function');
}

function isNotFunction(value) {
  return (typeof value !== 'function');
}

Object.defineProperty(isFunction, 'not', {
  enumerable: true,
  value: isNotFunction,
});

module.exports = isFunction;

},{}],19:[function(require,module,exports){
'use strict';

function isInteger(value) {
  if (typeof value === 'number') {
    return checkInteger(value);
  }
  if (Object.prototype.toString.call(value) === '[object Number]') {
    return checkInteger(Number(value));
  }
  return false;
}

function checkInteger(num) {
  /* istanbul ignore if */
  if (typeof Number.isInteger !== 'function') {
    if (!isFinite(num)) {
      return false;
    }
    return (num < 0 ? Math.ceil(num) : Math.floor(num)) === num;
  }
  return Number.isInteger(num);
}

function isNotInteger(value) {
  return !isInteger(value);
}

Object.defineProperty(isInteger, 'not', {
  enumerable: true,
  value: isNotInteger,
});

module.exports = isInteger;

},{}],20:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],21:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":20,"timers":21}]},{},[1])(1)
});
