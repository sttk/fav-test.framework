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
