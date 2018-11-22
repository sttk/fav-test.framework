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
