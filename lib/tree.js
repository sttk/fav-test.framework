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
