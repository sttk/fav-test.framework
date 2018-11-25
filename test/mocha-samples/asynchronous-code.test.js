'use stirct';

var Reporter = require('../tool/report');
var report = new Reporter('Asynchronous code');

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

describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
    it('should save without error (2)', function(done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});

function User(name) {
}
User.prototype.save = function(cb) {
  setTimeout(function() {
    cb();
  }, 1000);
};

fw.run(report.result(fw, [
  '',
  '    User',
  '      #save()',
  '        ✓ should save without error',
  '        ✓ should save without error (2)',
  '',
  '',
  '    2 passing (${duration})',
  '',
]));
