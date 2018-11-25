'use strict';

var Reporter = require('../tool/report');
var report = new Reporter('Synchronous code');

var Framework = require('../..');
var fw = new Framework();
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

var should = require('should');
var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 when the value is not present',
  '',
  '',
  '    1 passing (${duration})',
  '',
]));
