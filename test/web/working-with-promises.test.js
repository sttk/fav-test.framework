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

var assert = chai.assert;

fw.title = 'Working with promises';

function DB() {
}
DB.prototype.clear = function() {
  return new Promise(function (cb) {
    cb();
  });
};
DB.prototype.save = function() {
  return new Promise(function (cb) {
    cb();
  });
};
DB.prototype.find = function() {
  return new Promise(function(resolve) {
    resolve(['Tobi', 'Loki', 'Jane']);
  });
};

var tobi = 'Tobi',
    loki = 'Loki',
    jane = 'Jane';

var db = new DB();

beforeEach(function() {
  return db.clear()
    .then(function() {
      return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
  it('respond with matching records', function() {
    return db.find({ type: 'User' }).then(function(value) {
      assert.equal(value.length, 3);
    });
  });
  it('should complete this test', function(done) {
    return new Promise(function(resolve) {
      assert.ok(true);
      resolve();
    }).then(done);
  });
});

fw.run(report(fw));

}());
