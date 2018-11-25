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

var expect = chai.expect;

fw.title = 'Retry Tests';

var browser = {
  get: function() {},
};
var count = 0;
var $ = function() {
  return {
    isDisplayed: function() {
      count++;
      return Promise.resolve(count > 3);
    },
  };
};

describe('retries (2 times)', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  before(function() {
    count = 0;
  });

  beforeEach(function() {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    return $('.foo').isDisplayed().then(function(value) {
      expect(value).to.be.true;
      return Promise.resolve();
    });
  });
});

describe('retries (3 times)', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  before(function() {
    count = 0;
  });

  beforeEach(function() {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    this.retries(3);
    return $('.foo').isDisplayed().then(function(value) {
      expect(value).to.be.true;
      return Promise.resolve();
    });
  });
});

fw.run(report(fw));

}());
