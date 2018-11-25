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

function User(name) {
}
User.prototype.save = function(cb) {
  setTimeout(function() {
    cb();
  }, 1000);
}

var expect = chai.expect;

fw.title = 'Asynchronous code';

describe('User', function() {
  describe('#save', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
    it('should save without error (2)', function(done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});

fw.run(report(fw));

}());
