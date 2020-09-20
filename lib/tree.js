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
