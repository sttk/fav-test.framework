'use strict';

var Reporter = require('../tool/report');
var report = new Reporter('Using async / await');
var Promise = (typeof Promise === 'function') ? Promise :
              require('promise-polyfill');

var Framework = require('../..');
var fw = new Framework();
var beforeEach = fw.beforeEach;
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
fw.on('timeout', function(test) {
  report.timeout(test);
});

var chkEnv = require('../../tool/chk-env');

var should = require('should');
var assert = require('assert');

function DB() {
}
DB.prototype.clear = function() {
  return new Promise(function (cb) {
    cb();
  });
};
DB.prototype.save = function() {
  return new Promise(function (cb) {
    cb();
  });
};
DB.prototype.find = function() {
  return new Promise(function(resolve) {
    resolve([tobi, loki, jane]);
  });
};

var tobi = 'Tobi',
    loki = 'Loki',
    jane = 'Jane';

var db = new DB();

if (!chkEnv.isSupportAsyncAwait()) {
  report.saySkipped();
  return;
}

eval("" +

"beforeEach(async function() {" +
"  await db.clear();" +
"  await db.save([tobi, loki, jane]);" +
"});" +
"" +
"describe('#find()', function() {" +
"  it('respond with matching records', async function() {" +
"    const users = await db.find({ type: 'User' });" +
"    users.should.have.length(3);" +
"  });" +
"});" +
"" +
"fw.run(report.result(fw, [" +
"  ''," +
"  '    #find()'," +
"  '      ✓ respond with matching records'," +
"  ''," +
"  ''," +
"  '    1 passing (${duration})'," +
"  ''," +
"]));" +

"");
