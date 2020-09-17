'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Describing Hooks');

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

describe('hooks (before/after)', function() {

  before(function() {
    // runs before all tests in this block
    throw new Error('runs before all tests in this block');
  });

  after(function() {
    // runs after all tests in this block
    throw new Error('runs after all tests in this block');
  });

  beforeEach(function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

describe('describing hooks (before/after)', function() {

  before('BeforeHook', function() {
    // runs before all tests in this block
    throw new Error('runs before all tests in this block');
  });

  after('AfterHook', function() {
    // runs after all tests in this block
    throw new Error('runs after all tests in this block');
  });

  beforeEach('BeforeEachHook', function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach('AfterEachHook', function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

describe('hooks (beforeEach/afterEach)', function() {

  beforeEach(function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

describe('describing hooks (beforeEach/afterEach)', function() {

  beforeEach('BeforeEachHook', function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach('AfterEachHook', function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

fw.run(report.result(fw, [
  '',
  '    hooks (before/after)',
  '      1) "before all" hook',
  '      2) "after all" hook',
  '',
  '    describing hooks (before/after)',
  '      3) "before all" hook: BeforeHook',
  '      4) "after all" hook: AfterHook',
  '',
  '    hooks (beforeEach/afterEach)',
  '      5) "before each" hook for "test case 1"',
  '      6) "after each" hook for "test case 1"',
  '',
  '    describing hooks (beforeEach/afterEach)',
  '      7) "before each" hook: BeforeEachHook for "test case 1"',
  '      8) "after each" hook: AfterEachHook for "test case 1"',
  '',
  '',
  '    0 passing (${duration})',
  '    8 failing',
  '',
  '    1) hooks (before/after)',
  '         "before all" hook:',
  '       Error: runs before all tests in this block',
  '',
  '    2) hooks (before/after)',
  '         "after all" hook:',
  '       Error: runs after all tests in this block',
  '',
  '    3) describing hooks (before/after)',
  '         "before all" hook: BeforeHook:',
  '       Error: runs before all tests in this block',
  '',
  '    4) describing hooks (before/after)',
  '         "after all" hook: AfterHook:',
  '       Error: runs after all tests in this block',
  '',
  '    5) hooks (beforeEach/afterEach)',
  '         "before each" hook for "test case 1":',
  '       Error: runs before each test in this block',
  '',
  '    6) hooks (beforeEach/afterEach)',
  '         "after each" hook for "test case 1":',
  '       Error: runs after each test in this block',
  '',
  '    7) describing hooks (beforeEach/afterEach)',
  '         "before each" hook: BeforeEachHook for "test case 1":',
  '       Error: runs before each test in this block',
  '',
  '    8) describing hooks (beforeEach/afterEach)',
  '         "after each" hook: AfterEachHook for "test case 1":',
  '       Error: runs after each test in this block',
  '',
]));
