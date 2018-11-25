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

fw.title = 'Detects Multiple Calls To Done';

it('double done', function(done) {
  // Calling `done()` twice is an error
  setTimeout(done, 0);
  setTimeout(done, 0);
});

fw.run(report(fw));

}());
