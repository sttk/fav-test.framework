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

fw.title = 'Timeouts';

// Suite level

describe('a suite of tests', function() {
  this.timeout(500);

  it('should take less than 500ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function(done) {
    setTimeout(done, 250);
  });
});

describe('a suite of tests (error)', function() {
  this.timeout(200);

  it('should take less than 200ms', function(done) {
    setTimeout(done, 300);
  });

  it('should task less than 200ms as well', function(done) {
    setTimeout(done, 250);
  });
});

// Test level

it('should take less than 500ms', function(done) {
  this.timeout(500);
  setTimeout(done, 300);
});

it('should take less than 200ms (error)', function(done) {
  this.timeout(200);
  setTimeout(done, 300);
});

describe('a suite of tests (hook)', function() {
  beforeEach(function(done) {
    this.timeout(3000);
    setTimeout(done, 2500);
  });

  it('test', function() {
  });
});

describe('a suite of tests (hook error)', function() {
  beforeEach(function(done) {
    this.timeout(300);
    setTimeout(done, 500);
  });

  it('test', function() {
  });
});

fw.run(report(fw));

}());
