'use strict';

var Reporter = require('../tool/report');
var report = new Reporter('Timeouts');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var beforeEach = fw.beforeEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

// Suite Level

describe('a suite of tests', function() {
  this.timeout(500);

  it('should take less than 500ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function(done) {
    setTimeout(done, 250);
  });
});

describe('a suite of tests (error)', function() {
  this.timeout(200);

  it('should take less than 200ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 200ms as well', function(done) {
    setTimeout(done, 250);
  });
});

// Test level

it('should take less than 500ms', function(done) {
  this.timeout(500);
  setTimeout(done, 300);
});
it('should take less than 200ms (error)', function(done) {
  this.timeout(200);
  setTimeout(done, 300);
});

describe('a suite of tests (hook)', function() {
  beforeEach(function(done) {
    this.timeout(3000);
    setTimeout(done, 2500);
  });

  it('test', function() {
  });
});

describe('a suite of tests (hook error)', function() {
  beforeEach(function(done) {
    this.timeout(300);
    setTimeout(done, 500);
  });

  it('test', function() {
  });
});


fw.run(report.result(fw, [
  '',
  '    a suite of tests',
  '      ✓ should take less than 500ms',
  '      ✓ should take less than 500ms as well',
  '',
  '    a suite of tests (error)',
  '      1) should take less than 200ms',
  '      2) should take less than 200ms as well',
  '',
  '    ✓ should take less than 500ms',
  '    3) should take less than 200ms (error)',
  '',
  '    a suite of tests (hook)',
  '      ✓ test',
  '',
  '    a suite of tests (hook error)',
  '      4) "before each" hook for "test"',
  '',
  '',
  '    4 passing (${duration})',
  '    4 failing',
  '',
  '    1) a suite of tests (error)',
  '         should take less than 200ms:',
  '       Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
  '    2) a suite of tests (error)',
  '         should take less than 200ms as well:',
  '       Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
  '    3) should take less than 200ms (error):',
  '       Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
  '    4) a suite of tests (hook error)',
  '         "before each" hook for "test":',
  '       Error: Timeout of 300ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
]));
