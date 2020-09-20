'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Retry Tests');
var Promise = (typeof Promise === 'function') ? Promise : require('promise-polyfill');
var checkEnv = require('../../tool/check-env');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var beforeEach = fw.beforeEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

var chai = require('chai');
if (checkEnv.isSupportES6()) {
  var chaiAsPromised = require('chai-as-promised');
  chai.use(chaiAsPromised);
}
var expect = chai.expect;

var browser = {
  get: function() {},
};
var count = 0;
var $ = function() {
  return {
    isDisplayed: function() {
      count++;
      return Promise.resolve(count > 3);
    },
  };
};

describe('retries (2 times)', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  before(function() {
    count = 0;
  });

  beforeEach(function() {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    if (checkEnv.isSupportES6()) {
      return expect($('.foo').isDisplayed()).to.eventually.be.true;
    } else {
      return $('.foo').isDisplayed().then(function(value) {
        expect(value).to.be.true;
      });
    }
  });
});

describe('retries (3 times)', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  before(function() {
    count = 0;
  });

  beforeEach(function() {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    this.retries(3);
    if (checkEnv.isSupportES6()) {
      return expect($('.foo').isDisplayed()).to.eventually.be.true;
    } else {
      return $('.foo').isDisplayed().then(function(value) {
        expect(value).to.be.true;
      });
    }
  });
});

fw.run(report.result(fw, [
  '',
  '    retries (2 times)',
  '      1) should succeed on the 3rd try',
  '',
  '    retries (3 times)',
  '      ✓ should succeed on the 3rd try',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) retries (2 times)',
  '         should succeed on the 3rd try:',
  '       AssertionError: expected false to be true',
  ''
]));
