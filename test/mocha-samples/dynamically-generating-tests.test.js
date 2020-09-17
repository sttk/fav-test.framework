'use stirct';

var Reporter = require('../tool/reporter');
var report = new Reporter('Dynamically Generating Tests');

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

var assert = require('chai').assert;

function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('add()', function() {
  var tests = [
    {args: [1, 2],       expected: 3},
    {args: [1, 2, 3],    expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(function(test) {
    it('correctly adds ' + test.args.length + ' args', function() {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    add()',
  '      ✓ correctly adds 2 args',
  '      ✓ correctly adds 3 args',
  '      ✓ correctly adds 4 args',
  '',
  '',
  '    3 passing (${duration})',
  '',
]));
