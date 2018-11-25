'use strict';

var Reporter = require('../tool/report');
var report = new Reporter('Detects multiple calls to done()');
var setImmediate = (typeof setImmediate === 'function') ? setImmediate :
  function(fn) { setTimeout(fn, 0); };

var Framework = require('../..');
var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('error', function(test) {
  report.error(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});

it('double done', function(done) {
  // Calling `done()` twice is an error
  setImmediate(done);
  setImmediate(done);
});

fw.run(report.result(fw, [
  '',
  '    ✓ double done',
  '    1) double done',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) double done:',
  '       Error: done() called multiple times',
  '',
]));

