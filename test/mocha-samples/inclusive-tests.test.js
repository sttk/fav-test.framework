'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Inclusive tests');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var after = fw.after;

describe.skip = fw.skipSuite;
it.skip = fw.skipTest;

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

function check_test_environment() {
  return false;
}

describe('Array (1)', function() {
  describe.skip('#indexOf()', function() {
    it('should return -1 unless present', function() {
      // this test will not be run
    });

    it('should return the index when present', function() {
      // this test will be run
    });
  });
});

describe('Array (2)', function() {
  describe('#indexOf()', function() {
    it.skip('should return -1 unless present', function() {
      // this test will not be run
    });

    it('should return the index when present', function() {
      // this test will be run
    });
  });
});

it('should only test in the correct environment (1)', function() {
  if (check_test_environment()) {
    // make assertions
  } else {
    this.skip();
  }
});

it('should only test in the correct environment (2)', function() {
  if (check_test_environment()) {
    // make assertions
  } else {
    // do nothing
  }
});

describe('outer', function () {
  before(function () {
    this.skip();
  });

  after(function () {
    report.text('after in "outer" will be executed');
  });

  describe('inner', function () {
    before(function () {
      report.text('before in "innter" will be skipped');
    });

    after(function () {
      report.text('after in "innter" will be skipped');
    });

    it('Run test in "inner"', function() {
    });
  });

  it('Run test in "outer"', function() {
  });
});

fw.run(report.result(fw, [
  '',
  '    Array (1)',
  '      #indexOf()',
  '        - should return -1 unless present',
  '        - should return the index when present',
  '',
  '    Array (2)',
  '      #indexOf()',
  '        - should return -1 unless present',
  '        ✓ should return the index when present',
  '',
  '    - should only test in the correct environment (1)',
  '    ✓ should only test in the correct environment (2)',
  '',
  '    outer',
  '      inner',
  '        - Run test in "inner"',
  '      - Run test in "outer"',
  'after in "outer" will be executed',
  '',
  '',
  '    2 passing (${duration})',
  '    6 pending',
  '',
]));
