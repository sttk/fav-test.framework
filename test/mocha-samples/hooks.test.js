'use strict';

var Reporter = require('../tool/report');
var report = new Reporter('Hooks');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var after = fw.after;
var beforeEach = fw.beforeEach;
var afterEach = fw.afterEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
    report.text('runs before all tests in this block');
  });

  after(function() {
    // runs after all tests in this block
    report.text('runs after all tests in this block');
  });

  beforeEach(function() {
    // runs before each test in this block
    report.text('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    report.text('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

fw.run(report.result(fw, [
  '',
  '    hooks',
  'runs before all tests in this block',
  'runs before each test in this block',
  '      ✓ test case 1',
  'runs after each test in this block',
  'runs before each test in this block',
  '      ✓ test case 2',
  'runs after each test in this block',
  'runs after all tests in this block',
  '',
  '',
  '    2 passing (${duration})',
  '',
]));
