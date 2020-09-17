'use strict';

var assert = require('assert');
var Reporter = require('../tool/reporter');
var report = new Reporter('Getting Started');

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

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
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

