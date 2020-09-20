'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Test duration');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  var duration = test.endTime - test.startTime;
  if (duration > test.slow) {
    test.title += ' **red**';
  } else if (duration > test.slow / 2) {
    test.title += ' **yellow**';
  }
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('durations', function() {
  this.slow(10000);

  describe('when slow', function() {
    it('should highlight in red', function(done) {
      this.slow(200);
      setTimeout(done, 201);
    });
  });

  describe('when reasonable', function() {
    it('should highlight in yellow', function(done) {
      this.slow(400);
      setTimeout(done, 201);
    });
  });

  describe('when fast', function() {
    it('should highlight in green', function(done) {
      setTimeout(done, 200);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    durations',
  '      when slow',
  '        ✓ should highlight in red **red**',
  '      when reasonable',
  '        ✓ should highlight in yellow **yellow**',
  '      when fast',
  '        ✓ should highlight in green',
  '',
  '',
  '    3 passing (${duration})',
  '',
]));
