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

fw.title = 'Using Async / Await';

var expect = chai.expect;

function DB() {
}
DB.prototype.clear = function() {
  return new Promise(function (cb) {
    setTimeout(function() {
      cb();
    }, 200);
  });
};
DB.prototype.save = function() {
  return new Promise(function (cb) {
    setTimeout(function() {
      cb();
    }, 200);
  });
};
DB.prototype.find = function() {
  return new Promise(function (resolve) {
    setTimeout(function() {
      resolve([tobi, loki, jane]);
    }, 200);
  });
};

var tobi = 'Tobi',
    loki = 'Loki',
    jane = 'Jane';

var db = new DB();

beforeEach(async function() {
  await db.clear();
  await db.save([tobi, loki, jane]);
});

describe('#find()', function() {
  it('respond with matching records', async function() {
    const users = await db.find({ type: 'user' });
    expect(users.length).to.equal(3);
  });
});

fw.run(report(fw));

}());
