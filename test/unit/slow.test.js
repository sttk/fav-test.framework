'use strict';

var assert = require('assert');
var test = require('../tool/run-test');

var implementEvent = require('../../lib/event');
var implementTree = require('../../lib/tree');
var implementHook = require('../../lib/hook');
var implementAsync = require('../../lib/async');
var implementSlow = require('../../lib/slow');

function createTester() {
  var fw = {};
  implementEvent(fw);
  implementTree(fw);
  implementHook(fw);
  implementAsync(fw);
  implementSlow(fw);

  fw.title = 'Support slow';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(testcase) {
    fw.log(testcase.title + ' start (slow:' + testcase.slow + ')');
  });
  fw.on('end', function(testcase) {
    fw.log(testcase.title + ' end (slow:' + testcase.slow + ')');
  });
  return fw;
}

test.desc('lib/slow.js');

test.add('default slow (test)', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
  });
  it('2. Test', function(cb) {
    setTimeout(function() {
      cb();
    }, 500);
  });
  it('3. Test', function(cb) {
    setTimeout(function() {
      cb();
    }, 500);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support slow start (slow:undefined)',
        '1. Test start (slow:100)',
        '1. Test end (slow:100)',
        '2. Test start (slow:100)',
        '2. Test end (slow:100)',
        '3. Test start (slow:100)',
        '3. Test end (slow:100)',
        'Support slow end (slow:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('default slow (suite and test)', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    it('1.1. Test', function() {
    });
  });
  describe('2. Suite', function() {
    it('2.1. Test', function() {
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support slow start (slow:undefined)',
        '1. Suite start (slow:undefined)',
        '1.1. Test start (slow:100)',
        '1.1. Test end (slow:100)',
        '1. Suite end (slow:undefined)',
        '2. Suite start (slow:undefined)',
        '2.1. Test start (slow:100)',
        '2.1. Test end (slow:100)',
        '2. Suite end (slow:undefined)',
        '3. Suite start (slow:undefined)',
        '3.1. Test start (slow:100)',
        '3.1. Test end (slow:100)',
        '3. Suite end (slow:undefined)',
        'Support slow end (slow:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set slow in test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
  });
  it('2. Test', function(cb) {
    this.slow(500);
    setTimeout(function() {
      cb();
    }, 500);
  });
  it('3. Test', function(cb) {
    setTimeout(function() {
      cb();
    }, 500);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support slow start (slow:undefined)',
        '1. Test start (slow:100)',
        '1. Test end (slow:100)',
        '2. Test start (slow:100)',
        '2. Test end (slow:500)',
        '3. Test start (slow:100)',
        '3. Test end (slow:100)',
        'Support slow end (slow:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set slow in suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    describe('1.1. Suite', function() {
      it('1.1.1. Test', function() {
      });
    });
    describe('1.2. Suite', function() {
      it('1.2.1. Test', function() {
      });
      describe('1.2.2. Suite', function() {
        it('1.2.2.1. Test', function(cb) {
          cb();
        });
      });
      this.slow(500);
      describe('1.2.3. Suite', function() {
        it('1.2.3.1. Test', function(cb) {
          cb();
        });
      });
      it('1.2.4. Test', function() {
      });
      describe('1.2.5. Suite', function() {
        it('1.2.5.1. Test', function() {
        });
      });
    });
    describe('1.3. Suite', function() {
      it('1.3.1. Test', function() {
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support slow start (slow:undefined)',
        '1. Suite start (slow:undefined)',
        '1.1. Suite start (slow:undefined)',
        '1.1.1. Test start (slow:100)',
        '1.1.1. Test end (slow:100)',
        '1.1. Suite end (slow:undefined)',
        '1.2. Suite start (slow:undefined)',
        '1.2.1. Test start (slow:100)',
        '1.2.1. Test end (slow:100)',
        '1.2.2. Suite start (slow:undefined)',
        '1.2.2.1. Test start (slow:100)',
        '1.2.2.1. Test end (slow:100)',
        '1.2.2. Suite end (slow:undefined)',
        '1.2.3. Suite start (slow:undefined)',
        '1.2.3.1. Test start (slow:500)',
        '1.2.3.1. Test end (slow:500)',
        '1.2.3. Suite end (slow:undefined)',
        '1.2.4. Test start (slow:500)',
        '1.2.4. Test end (slow:500)',
        '1.2.5. Suite start (slow:undefined)',
        '1.2.5.1. Test start (slow:500)',
        '1.2.5.1. Test end (slow:500)',
        '1.2.5. Suite end (slow:undefined)',
        '1.2. Suite end (slow:undefined)',
        '1.3. Suite start (slow:undefined)',
        '1.3.1. Test start (slow:100)',
        '1.3.1. Test end (slow:100)',
        '1.3. Suite end (slow:undefined)',
        '1. Suite end (slow:undefined)',
        'Support slow end (slow:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set illegal slow in test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
    this.slow('500');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support slow start (slow:undefined)',
        '1. Test start (slow:100)',
        '1. Test end (slow:100)',
        'Support slow end (slow:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set illegal slow in suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    this.slow('500');
    it('1.1. Test', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support slow start (slow:undefined)',
        '1. Suite start (slow:undefined)',
        '1.1. Test start (slow:100)',
        '1.1. Test end (slow:100)',
        '1. Suite end (slow:undefined)',
        'Support slow end (slow:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.run();
