'use strict';

var Reporter = require('../tool/reporter');
var report = new Reporter('Root-Level Hooks');

var Framework = require('../..');
var fw = new Framework();

global.describe = fw.suite;
global.it = fw.test;
global.beforeEach = fw.beforeEach;
global.log = report.text.bind(report);

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

require('./root-level-hooks-1');
require('./root-level-hooks-2');

fw.run(report.result(fw, [
  '',
  'before every test in every file',
  'test run',
  '    ✓ test',
  '',
  '    suite1',
  'before every test in every file',
  'test1 run',
  '      ✓ test1',
  '      suite2',
  'before every test in every file',
  'test2 run',
  '        ✓ test2',
  '',
  'before every test in every file',
  'test3 run',
  '    ✓ test3',
  '',
  '    suite4',
  'before every test in every file',
  'test4 run',
  '      ✓ test4',
  '      suite5',
  'before every test in every file',
  'test5 run',
  '        ✓ test5',
  '',
  '',
  '    6 passing (${duration})',
  '',
]));
