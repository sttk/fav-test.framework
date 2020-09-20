'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Pending tests');

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
fw.on('skip', function(test) {
  report.skip(test);
});

describe('Array', function() {
  describe('#indexOf()', function() {
    // pending test below
    it('should return -1 when the value is not present');
  });

  //describe('empty suite');
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        - should return -1 when the value is not present',
  '',
  '',
  '    0 passing (${duration})',
  '    1 pending',
  '',
]));
