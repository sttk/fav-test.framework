'use stirct';

var Reporter = require('../tool/reporter');
var report = new Reporter('Delayed Root Suite');

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var run = fw.run;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

setTimeout(function() {
  describe('my suite', function() {
    it('my test', function() {
    });
  });

  run(report.result(fw, [
    '',
    '    my suite',
    '      ✓ my test',
    '',
    '',
    '    1 passing (${duration})',
    '',

  ]));
}, 5000);
