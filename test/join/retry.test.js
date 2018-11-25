'use strict';

var assert = require('assert');
var test = require('../tool/run-test');

var Framework = require('../..');

function createTester() {
  var fw = new Framework();

  fw.title = 'Support retries';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(node) {
    fw.log(node.title + ' start');
  });
  fw.on('end', function(node) {
    fw.log(node.title + ' end');
  });
  fw.on('succeed', function(node) {
    fw.log(node.title + ' succeed');
  });
  fw.on('error', function(node) {
    fw.log(node.title + ' error: ' + node.error.message);
  });
  fw.on('retry', function(node) {
    fw.log(node.title +
      ' retry: (' + node._retried + '/' + node.retries + ')');
  });

  return fw;
}

test.desc('join - retry');

test.add('retry test specified times', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
    this.retries(2);
    fw.log('1. Test run');
    throw new Error('1. Test error');
  });
  it('2. Test', function(cb) {
    this.retries(4);
    setTimeout(function() {
      fw.log('2. Test run');
      cb(new Error('2. Test error'));
    }, 100);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support retries start',
        '1. Test start',
        '1. Test run',
        '1. Test retry: (0/2)',
        '1. Test run',
        '1. Test retry: (1/2)',
        '1. Test run',
        '1. Test error: 1. Test error',
        '1. Test end',
        '2. Test start',
        '2. Test run',
        '2. Test retry: (0/4)',
        '2. Test run',
        '2. Test retry: (1/4)',
        '2. Test run',
        '2. Test retry: (2/4)',
        '2. Test run',
        '2. Test retry: (3/4)',
        '2. Test run',
        '2. Test error: 2. Test error',
        '2. Test end',
        'Support retries end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('retry test with beforeEach/afterEach', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. Suite', function() {
    beforeEach('1. before each', function() {
      fw.log('1. before each run');
    });
    afterEach('1. after each', function() {
      fw.log('1. after each run');
    });
    describe('1.1. Suite', function() {
      it('1.1.1. should retry 2 times', function() {
        this.retries(2);
        fw.log('1.1.1. test run');
        throw new Error('1.1.1. test error');
      });
    });
    it('1.2. should retry 0 times', function() {
      fw.log('1.2. test run');
      throw new Error('1.2. test error');
    });
    this.retries(3);
    it('1.3. should retry 3 times', function() {
      fw.log('1.3. test run');
      throw new Error('1.3. test error');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support retries start',
        '1. Suite start',
        '1.1. Suite start',
        '1.1.1. should retry 2 times start',
        '1. before each run',
        '1.1.1. test run',
        '1.1.1. should retry 2 times retry: (0/2)',
        '1. after each run',
        '1. before each run',
        '1.1.1. test run',
        '1.1.1. should retry 2 times retry: (1/2)',
        '1. after each run',
        '1. before each run',
        '1.1.1. test run',
        '1.1.1. should retry 2 times error: 1.1.1. test error',
        '1. after each run',
        '1.1.1. should retry 2 times end',
        '1.1. Suite end',
        '1.2. should retry 0 times start',
        '1. before each run',
        '1.2. test run',
        '1.2. should retry 0 times error: 1.2. test error',
        '1. after each run',
        '1.2. should retry 0 times end',
        '1.3. should retry 3 times start',
        '1. before each run',
        '1.3. test run',
        '1.3. should retry 3 times retry: (0/3)',
        '1. after each run',
        '1. before each run',
        '1.3. test run',
        '1.3. should retry 3 times retry: (1/3)',
        '1. after each run',
        '1. before each run',
        '1.3. test run',
        '1.3. should retry 3 times retry: (2/3)',
        '1. after each run',
        '1. before each run',
        '1.3. test run',
        '1.3. should retry 3 times error: 1.3. test error',
        '1. after each run',
        '1.3. should retry 3 times end',
        '1. Suite end',
        'Support retries end',
      ]);
      done();
    } catch (e) {
      console.log(e);
    }
  });
});

test.add('retry test without before/after', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var before = fw.before;
  var after = fw.after;

  describe('1. Suite', function() {
    before(function() {
      fw.log('1. before run');
    });
    after(function() {
      fw.log('1. after run');
    });
    this.retries(1);
    describe('1.1. Suite', function() {
      this.retries(2);
      it('1.1.1. Test', function() {
        fw.log('1.1.1. Test run');
        throw new Error('1.1.1. Test');
      });
    });
    it('1.2. Test', function() {
      fw.log('1.2. Test run');
      throw new Error('1.2. Test');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support retries start',
        '1. Suite start',
        '1. before run',
        '1.1. Suite start',
        '1.1.1. Test start',
        '1.1.1. Test run',
        '1.1.1. Test retry: (0/2)',
        '1.1.1. Test run',
        '1.1.1. Test retry: (1/2)',
        '1.1.1. Test run',
        '1.1.1. Test error: 1.1.1. Test',
        '1.1.1. Test end',
        '1.1. Suite end',
        '1.2. Test start',
        '1.2. Test run',
        '1.2. Test retry: (0/1)',
        '1.2. Test run',
        '1.2. Test error: 1.2. Test',
        '1.2. Test end',
        '1. after run',
        '1. Suite end',
        'Support retries end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('don\'t retry test if no error', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;
  var before = fw.before;
  var after = fw.after;

  var test1Runned = 0;
  var test2Runned = 0;

  describe('1. Suite', function() {
    before(function(cb) {
      fw.log('1. before run');
      setTimeout(function() {
        cb();
      }, 100);
    });
    after(function(cb) {
      fw.log('1. after run');
      setTimeout(function() {
        cb();
      }, 100);
    });
    beforeEach(function(cb) {
      fw.log('1. before each run');
      setTimeout(function() {
        cb();
      }, 100);
    });
    afterEach(function(cb) {
      fw.log('1. after each run');
      setTimeout(function() {
        cb();
      }, 100);
    });
    this.retries(5);
    it('1.1. Test', function(cb) {
      test1Runned++;
      fw.log('1.1. Test run');
      setTimeout(function() {
        if (test1Runned > 3) {
          cb();
        } else {
          cb(new Error('error 1.1.'));
        }
      }, 100);
    });
    it('1.2. Test', function(cb) {
      this.retries(4);
      test2Runned++;
      fw.log('1.2. Test run');
      setTimeout(function() {
        if (test2Runned > 2) {
          cb();
        } else {
          cb(new Error('error 1.2.'));
        }
      }, 100);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support retries start',
        '1. Suite start',
        '1. before run',
        '1.1. Test start',
        '1. before each run',
        '1.1. Test run',
        '1.1. Test retry: (0/5)',
        '1. after each run',
        '1. before each run',
        '1.1. Test run',
        '1.1. Test retry: (1/5)',
        '1. after each run',
        '1. before each run',
        '1.1. Test run',
        '1.1. Test retry: (2/5)',
        '1. after each run',
        '1. before each run',
        '1.1. Test run',
        '1.1. Test succeed',
        '1. after each run',
        '1.1. Test end',
        '1.2. Test start',
        '1. before each run',
        '1.2. Test run',
        '1.2. Test retry: (0/4)',
        '1. after each run',
        '1. before each run',
        '1.2. Test run',
        '1.2. Test retry: (1/4)',
        '1. after each run',
        '1. before each run',
        '1.2. Test run',
        '1.2. Test succeed',
        '1. after each run',
        '1.2. Test end',
        '1. after run',
        '1. Suite end',
        'Support retries end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Don\'t set illegal retry count (suite)', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
    this.retries(2);
    fw.log('1. Test run');
    throw new Error('E1');
  });
  it('2. Test', function() {
    this.retries('2');
    fw.log('2. Test run');
    throw new Error('E2');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support retries start',
        '1. Test start',
        '1. Test run',
        '1. Test retry: (0/2)',
        '1. Test run',
        '1. Test retry: (1/2)',
        '1. Test run',
        '1. Test error: E1',
        '1. Test end',
        '2. Test start',
        '2. Test run',
        '2. Test error: E2',
        '2. Test end',
        'Support retries end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Don\'t set illegal retry count (test)', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    this.retries(2);
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
      throw new Error('E1');
    });
  });
  describe('2. Suite', function() {
    this.retries('2');
    it('2.1. Test', function() {
      fw.log('2.1. Test run');
      throw new Error('E2');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support retries start',
        '1. Suite start',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test retry: (0/2)',
        '1.1. Test run',
        '1.1. Test retry: (1/2)',
        '1.1. Test run',
        '1.1. Test error: E1',
        '1.1. Test end',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test error: E2',
        '2.1. Test end',
        '2. Suite end',
        'Support retries end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.run();
