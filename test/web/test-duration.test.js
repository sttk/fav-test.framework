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

fw.title = 'Test duration';

describe('durations', function() {
  this.slow(10000);

  describe('when slow', function() {
    it('should highlight in red', function(done) {
      this.slow(200);
      setTimeout(done, 201);
    });
  });

  describe('when reasonable', function() {
    it('should highlight in yellow', function(done) {
      this.slow(400);
      setTimeout(done, 201);
    });
  });

  describe('when fast', function() {
    it('should highlight in green', function(done) {
      setTimeout(done, 200);
    });
  });
});

fw.run(report(fw));

}());
