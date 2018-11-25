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

fw.title = 'Hooks';

var expect = chai.expect;

var logs = [];

describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
    logs.push('runs before all tests in this block');
  });

  after(function() {
    // runs after all tests in this block
    logs.push('runs after all tests in this block');
  });

  beforeEach(function() {
    // runs before each test in this block
    logs.push('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    logs.push('runs after each test in this block');
  });
  
  it('test case 1', function() {
    logs.push('runs test case 1');
  });
  it('test case 2', function() {
    logs.push('runs test case 2');
  });
});

after(function() {
  expect(logs).to.deep.equal([
    'runs before all tests in this block',
    'runs before each test in this block',
    'runs test case 1',
    'runs after each test in this block',
    'runs before each test in this block',
    'runs test case 2',
    'runs after each test in this block',
    'runs after all tests in this block',
  ]);
});

fw.run(report(fw));

}());
