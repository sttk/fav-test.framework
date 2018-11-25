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

fw.title = 'Delayed Root Suite';

setTimeout(function() {
  describe('my suite', function() {
    it('my test', function() {
    });
  });

  fw.run(report(fw));
}, 5000);

}());
