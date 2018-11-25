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

fw.title = 'Synchronouse Code';

var expect = chai.expect;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
    });
  });
});

fw.run(report(fw));

}());
