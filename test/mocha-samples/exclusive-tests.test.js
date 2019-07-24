'use strict';

var Reporter = require('../tool/report');
var report = new Reporter('Exclusive Tests');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
describe.only = fw.onlySuite;
it.only = fw.onlyTest;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // ...
    });

    it('should return the index when present', function() {
      // ...
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // this test will be run
    });

    it.only('should return the index when present', function() {
      // this test will also be run
    });

    it('should return -1 if called with a non-Array context', function() {
      // this test will not be run
    });
  });
});

describe('Array', function() {
  describe.only('#indexOf()', function() {
    it('should return -1 unless present', function() {
      // this test will be run
    });

    it('should return the index when present', function() {
      // this test will also be run
    });
  });

  describe.only('#concat()', function () {
    it('should return a new Array', function () {
      // this test will also be run
    });
  });

  describe('#slice()', function () {
    it('should return a new Array', function () {
      // this test will not be run
    });
  });
});

describe('Array', function() {
  describe.only('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // this test will be run
    });

    it('should return the index when present', function() {
      // this test will not be run
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '        ✓ should return the index when present',
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '        ✓ should return the index when present',
  '      #concat()',
  '        ✓ should return a new Array',
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '',
  '',
  '    7 passing (${duration})',
  '',
]));
