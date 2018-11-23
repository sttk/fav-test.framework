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

},{"./static":9,"./util/define":13,"./util/run-async":16}],3:[function(require,module,exports){
'use strict';

var define = require('./util/define');
var isArray = require('@fav/type.is-array');

function implement(fw) {
  define.immutable(fw, '_eventHandlers', {});

  define.method(fw, 'on', register);
  define.method(fw, 'emit', emit);
}

function register(eventName, eventHandler) {
  if (!isArray(this._eventHandlers[eventName])) {
    define.immutable(this._eventHandlers, eventName, []);
  }
  this._eventHandlers[eventName].push(eventHandler);
}

function emit(eventName /* , ...args */) {
  var arr = this._eventHandlers[eventName];
  if (isArray(arr)) {
    for (var i = 0, n = arr.length; i < n; i++) {
      var fn = arr[i];
      fn.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
}

module.exports = implement;

},{"./util/define":13,"@fav/type.is-array":17}],4:[function(require,module,exports){
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

},{"./static":9,"./util/callback":12,"./util/define":13,"@fav/type.is-function":19}],5:[function(require,module,exports){
'use strict';

var define = require('./util/define');
var $tatic = require('./static');

function implement(fw) {
  define.mutable(fw, '_hasOnly', false);
  define.mutable(fw, '_only', { flag: false });
  define.mutable(fw, 'only', { flag: true });

  define.method(fw, 'onlySuite', onlySuite);
  define.method(fw, 'onlyTest', onlyTest);
}

function onlySuite(title, fn) {
  var fw = this;
  if (fw._only.flag) {
    fw._only.flag = false;
  }
  fw._only = { flag: true };
  var suite = $tatic.registerSuite(fw, title, fn);
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
    delete suite.yet;
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
    delete test.yet;
    return;
  }
  runTest.$uper(test, cb);
});

module.exports = implement;

},{"./static":9,"./util/define":13}],6:[function(require,module,exports){
(function (setImmediate){
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

}).call(this,require("timers").setImmediate)
},{"./static":9,"./util/define":13,"@fav/type.is-integer":20,"timers":23}],7:[function(require,module,exports){
'use strict';

var define = require('./util/define');
var $tatic = require('./static');

function implement(fw) {
  define.mutable(fw, '_skip', false);

  define.method(fw, 'skipSuite', skipSuite);
  define.method(fw, 'skipTest', skipTest);
}

function skipSuite(title, fn) {
  var fw = this;
  var skipBak = fw._skip;
  fw._skip = true;
  $tatic.registerSuite(fw, title, fn);
  fw._skip = skipBak;
}

function skipTest(title, fn) {
  var fw = this;
  var skipBak = fw._skip;
  fw._skip = true;
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
  return suite;
});

define.override($tatic, function createSuiteContext(suite) {
  var fw = suite._framework;
  var ctx = createSuiteContext.$uper(suite);
  ctx.skip = function() {
    fw._skip = true;
    // Don't do this, because some children may not be skipped.
    // suite.skip = true
  };
  return ctx;
});

define.override($tatic, function createTest(fw, title, fn) {
  var test = createTest.$uper(fw, title, fn);
  test.skip = fw._skip;
  return test;
});

define.override($tatic, function createTestContext(test) {
  var ctx = createTestContext.$uper(test);
  ctx.skip = function() {
    test.skip = true;
    throw { skip: true };
  };
  return ctx;
});

define.override($tatic, function runTest(test, cb) {
  var fw = test._framework;
  if (test.skip) {
    fw.emit('start', test);
    delete test.yet;
    fw.emit('end', test);
    cb();
    return;
  }

  runTest.$uper(test, cb);
});

module.exports = implement;

},{"./static":9,"./util/define":13}],8:[function(require,module,exports){
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

},{"./static":9,"./util/define":13,"@fav/type.is-integer":20}],9:[function(require,module,exports){
'use strict';

/* This is an object to hanging static (non-context) functions */
module.exports = {};

},{}],10:[function(require,module,exports){
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

},{"./static":9,"./util/define":13,"@fav/type.is-integer":20}],11:[function(require,module,exports){
'use strict';

var $tatic = require('./static');
var define = require('./util/define');
var callback = require('./util/callback');

function implement(fw) {
  define.immutable(fw, '_children', []);
  define.immutable(fw, '_framework', fw);
  define.mutable(fw, '_current', fw);
  define.mutable(fw, '_depth', 0);

  define.method(fw, 'suite', suite);
  define.method(fw, 'test', test);
  define.method(fw, 'run', run);
}

function suite(title, fn) {
  var fw = this;
  $tatic.registerSuite(fw, title, fn);
}

function test(title, fn) {
  var fw = this;
  $tatic.registerTest(fw, title, fn);
}

function run(cb) {
  var fw = this;
  $tatic.runTree(fw, cb);
}

define.override($tatic, function registerSuite(fw, title, fn) {
  var suite = $tatic.createSuite(fw, title, fn);
  fw._current._children.push(suite);

  fw._current = suite;
  fw._depth++;
  suite.fn();
  fw._depth--;
  fw._current = suite._parent;

  return suite;
});

define.override($tatic, function createSuite(fw, title, fn) {
  return {
    type: 'suite',
    title: title,
    depth: fw._depth,
    fn: fn,
    run: $tatic.runSuite,
    _parent: fw._current,
    _children: [],
    _framework: fw,
    yet: true,
  };
});

define.override($tatic, function runSuite(suite, cb) {
  var fw = suite._framework;
  fw.emit('start', suite);
  suite._children.forEach(function(child) {
    child.run(child);
  });
  fw.emit('end', suite);
  callback(cb);
});

define.override($tatic, function registerTest(fw, title, fn) {
  var test = $tatic.createTest(fw, title, fn);
  fw._current._children.push(test);
  return test;
});

define.override($tatic, function createTest(fw, title, fn) {
  return {
    type: 'test',
    title: title,
    depth: fw._depth,
    fn: fn,
    run: $tatic.runTest,
    _parent: fw._current,
    _children: [],
    _framework: fw,
    yet: true,
  };
});

define.override($tatic, function runTest(test, cb) {
  var fw = test._framework;
  fw.emit('start', test);
  test.fn();
  fw.emit('end', test);
  callback(cb);
});

define.override($tatic, function runTree(fw, cb) {
  $tatic.runSuite(fw);
  callback(cb);
});

module.exports = implement;

},{"./static":9,"./util/callback":12,"./util/define":13}],12:[function(require,module,exports){
'use strict';

var isFunction = require('@fav/type.is-function');

function callback(cb) {
  if (isFunction(cb)) {
    cb();
  }
}

module.exports = callback;

},{"@fav/type.is-function":19}],13:[function(require,module,exports){
'use strict';

var isFunction = require('@fav/type.is-function');

function immutable(obj, name, value) {
  Object.defineProperty(obj, name, {
    configurable: true,
    value: value,
  });
}

function mutable(obj, name, value) {
  Object.defineProperty(obj, name, {
    writable: true,
    configurable: true,
    value: value,
  });
}

function method(obj, name, fn) {
  Object.defineProperty(obj, name, {
    enumerable: true,
    writable: true,
    value: fn.bind(obj),
  });
}

function override(obj, name, fn) {
  if (isFunction(name)) {
    fn = name;
    name = fn.name;
  }

  var superFn = obj[name];
  if (isFunction(superFn)) {
    immutable(fn, '$uper', superFn);
  }

  Object.defineProperty(obj, name, {
    enumerable: true,
    writable: true,
    value: fn,
  });
}

module.exports = {
  immutable: immutable,
  mutable: mutable,
  method: method,
  override: override,
};

},{"@fav/type.is-function":19}],14:[function(require,module,exports){
'use strict';

function dontTwice(fn, errorFn) {
  return function() {
    if (fn._called) {
      errorFn();
      return;
    }
    Object.defineProperty(fn, '_called', { value: true });
    return fn.apply(this, arguments);
  };
}

module.exports = dontTwice;

},{}],15:[function(require,module,exports){
'use strict';

var isFunction = require('@fav/type.is-function');

function isPromiseLike(object) {
  return Boolean(object) &&
         typeof object === 'object' &&
         isFunction(object.then) &&
         isFunction(object.catch);
}

module.exports = isPromiseLike;

},{"@fav/type.is-function":19}],16:[function(require,module,exports){
(function (setImmediate){
'use strict';

var callback = require('./callback');
var dontTwice = require('./dont-twice');
var isPromiseLike = require('./is-promise-like');
var isEmpty = require('@fav/type.is-empty');

function done(cb, test, err) {
  delete test.yet;
  if (err instanceof Error) {
    test.error = err;

    var fw = test._framework;
    fw.emit('error', test);
  }
  callback(cb);
}

function causeErrorWhenDoneTwice(test) {
  delete test.yet;
  test.error = new Error('done() called multiple times');

  var fw = test._framework;
  fw.emit('error', test);
  fw.emit('end', test);
}

exports.byCallback = function(test, ctx, cb) {
  try {
    var isBothPromiseAndCallback = false;

    var end = dontTwice(function(err) {
      if (!isBothPromiseAndCallback) {
        done(cb, test, err);
      }
    }, function() {
      causeErrorWhenDoneTwice(test);
    });

    var ret = test.fn.call(ctx, end);

    if (isPromiseLike(ret)) {
      isBothPromiseAndCallback = true;
      done(cb, test, new Error('Resolution method is overspecified. ' +
        'Specify a callback *or* return a Promise; not both.'));
    }
  } catch (e) {
    done(cb, test, e);
  }
};

exports.byPromise = function(test, ctx, cb) {
  try {
    var promise = test.fn.call(ctx);
    if (!isPromiseLike(promise)) {
      done(cb, test);
      return;
    }
    promise.then(function() {
      done(cb, test);
    }).catch(function(err) {
      done(cb, test, err);
    });
  } catch (e) {
    done(cb, test, e);
  }
};

exports.sequentially = function(nodes, cb) {
  runSequentially(nodes, 0, cb);
};

function runSequentially(nodes, index, cb) {
  if (index >= nodes.length) {
    callback(cb);
    return;
  }

  var node = nodes[index];
  setImmediate(function() {
    node.run(node, function() {
      runSequentially(nodes, index + 1, cb);
    });
  });
}

exports.parallelly = function(nodes, cb) {
  if (!nodes.length) {
    callback(cb);
    return;
  }

  var yet = {};
  for (var i = 0, n = nodes.length; i < n; i++) {
    yet[i] = true;
  }
  nodes.forEach(function(node, i) {
    setImmediate(function() {
      node.run(node, function() {
        delete yet[i];
        if (isEmpty(yet)) {
          callback(cb);
        }
      });
    });
  });
};

}).call(this,require("timers").setImmediate)
},{"./callback":12,"./dont-twice":14,"./is-promise-like":15,"@fav/type.is-empty":18,"timers":23}],17:[function(require,module,exports){
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

var isArray = require('@fav/type.is-array');
var isPlainObject = require('@fav/type.is-plain-object');

function isEmpty(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (isArray(value) && value.length === 0) {
    return true;
  }

  if (isPlainObject(value)) {
    for (var key in value) {
      return false;
    }
    return true;
  }

  /* istanbul ignore next */
  switch (typeof HTMLCollection) {
    case 'object': // PhantomJS
    case 'function': {
      if (value instanceof HTMLCollection) {
        return value.length === 0;
      }
    }
  }

  /* istanbul ignore next */
  switch (typeof NodeList) {
    case 'object': // PhantomJS
    case 'function': {
      if (value instanceof NodeList) {
        return value.length === 0;
      }
    }
  }

  return false;
}

function isNotEmpty(value) {
  return !isEmpty(value);
}

Object.defineProperty(isEmpty, 'not', {
  enumerable: true,
  value: isNotEmpty,
});

module.exports = isEmpty;

},{"@fav/type.is-array":17,"@fav/type.is-plain-object":21}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
'use strict';

function isPlainObject(value) {
  if (typeof value !== 'object') {
    return false;
  }

  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  switch (Object.getPrototypeOf(value)) {
    case Object.prototype: {
      return true;
    }
    case null: {
      return true;
    }
    default: {
      return false;
    }
  }
}

function isNotPlainObject(value) {
  return !isPlainObject(value);
}

Object.defineProperty(isPlainObject, 'not', {
  enumerable: true,
  value: isNotPlainObject,
});

module.exports = isPlainObject;

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
},{"process/browser.js":22,"timers":23}]},{},[1])(1)
});
