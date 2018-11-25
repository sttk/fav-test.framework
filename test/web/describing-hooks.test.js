(function() {

'use strict';

var Framework = fav.test.framework;
var fw = new Framework(),
    describe = fw.suite,
    it = fw.test,
    before = fw.before,
    after = fw.after,
    beforeEach = fw.beforeEach,
    afterEach = fw.afterEach;
describe.skip = fw.skipSuite;
describe.only = fw.onlySuite;
it.skip = fw.skipTest;
it.only = fw.onlyTest;

fw.title = 'Describing Hooks';

var expect = chai.expect;

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
    throw new Error('runs before each in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    throw new Error('runs after each in this block');
  });

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
  it ('test case 1', function() {
  });
  it ('test case 2', function() {
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
  it ('test case 1', function() {
  });
  it ('test case 2', function() {
  });
});

fw.run(report(fw));

}());
