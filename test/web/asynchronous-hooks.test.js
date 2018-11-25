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

fw.title = 'Asynchronous Hooks';

function Connection() {
  this.saveError = null;
  this.clearError = null;
  this.findError = null;
  this.users = [];
}
Connection.prototype.save = function(users, cb) {
  this.users = users;
  cb(this.saveError);
};
Connection.prototype.clear = function(cb) {
  cb(this.clearError);
};
Connection.prototype.find = function(obj, cb) {
  cb(this.findError, this.users);
};

function user(name) {
  this.name = name;
}

var expect = chai.expect;

describe('Connection', function() {
  var db = new Connection,
    tobi = new user('tobi'),
    loki = new user('loki'),
    jane = new user('jane');

  beforeEach(function(done) {
    db.clear(function(err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe('#find()', function() {
    it('respond with matching records', function(done) {
      db.find({ type: 'user' }, function(err, res) {
        if (err) return done(err);
        expect(res.length).to.equal(3);
        done();
      });
    });
  });
});

describe('Connection (save error)', function() {
  var db = new Connection,
    tobi = new user('tobi'),
    loki = new user('loki'),
    jane = new user('jane');

  db.saveError = new Error('Save error');

  beforeEach(function(done) {
    db.clear(function(err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe('#find()', function() {
    it('respond with matching records', function(done) {
      db.find({ type: 'user' }, function(err, res) {
        if (err) return done(err);
        expect(res.length).to.equal(3);
        done();
      });
    });
  });
});

fw.run(report(fw));

}());
