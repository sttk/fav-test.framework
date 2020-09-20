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

