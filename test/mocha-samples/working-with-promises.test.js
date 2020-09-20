'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Working with promises');
var Promise = (typeof Promise === 'function') ? Promise : require('promise-polyfill');

var Framework = require('../..');
var fw = new Framework();
var beforeEach = fw.beforeEach;
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

var assert = require('assert');
var should = require('should');

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
    return db.find({ type: 'User' }).should.eventually.have.length(3);
  });
  it('should complete this test', function(done) {
    return new Promise(function(resolve) {
      assert.ok(true);
      resolve();
    }).then(done);
  });
});

fw.run(report.result(fw, [
  '',
  '    #find()',
  '      ✓ respond with matching records',
  '      1) should complete this test',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) #find()',
  '         should complete this test:',
  '       Error: Resolution method is overspecified. Specify a callback *or* return a Promise; not both.',
  '',
]));
