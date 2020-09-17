'use strict';

var assert = require('assert');
var test = require('../tool/runner');

var Framework = require('../..');

function createTester() {
  var fw = new Framework();

  fw.title = 'Support timeout';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(node) {
    fw.log(node.title + ' start (timeout:' + node.timeout  + ')');
  });
  fw.on('end', function(node) {
    fw.log(node.title + ' end (timeout:' + node.timeout  + ')');
    logTimeout(node);
  });
  fw.on('succeed', function(node) {
    fw.log(node.title + ' succeed (timeout:' + node.timeout  + ')');
  });
  fw.on('error', function(node) {
    fw.log(node.title + ' error: ' + node.error);
  });
  fw.on('timeout', function(node) {
    fw.log(node.title + ' timeover (timeout:' + node.timeout + ')');
    logTimeout(node);
  });
  return fw;
}

function logTimeout(/* node */) {
  /*
  var prefix = node.isTimeout ? '[TIMEOUT] ' : '[FINISH ] ';
  var duration = node.endTime - node.startTime;
  console.log(prefix + node.title +
    ' duration: ' + duration +
    ' timeout: ' + node.timeout
  );
  */
}

test.desc('timeout');

test.add('default timeout (test)', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 1000);
  });
  it('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    setTimeout(function() {
      fw.log('2. Test run - (2)');
      cb();
    }, 3000);
  });
  it('3. Test', function(cb) {
    fw.log('3. Test run - (1)');
    setTimeout(function() {
      fw.log('3. Test run - (2)');
      cb();
    }, 1000);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support timeout start (timeout:undefined)',
        '1. Test start (timeout:2000)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test succeed (timeout:2000)',
        '1. Test end (timeout:2000)',
        '2. Test start (timeout:2000)',
        '2. Test run - (1)',
        '2. Test timeover (timeout:2000)',
        '2. Test error: Error: Timeout of 2000ms exceeded. ' +
          'For async tests and hooks, ensure "done()" is called; ' +
          'if returning a Promise, ensure it resolves.',
        '2. Test end (timeout:2000)',
        '3. Test start (timeout:2000)',
        '3. Test run - (1)',
        '2. Test run - (2)',
        '3. Test run - (2)',
        '3. Test succeed (timeout:2000)',
        '3. Test end (timeout:2000)',
        'Support timeout end (timeout:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set timeout in test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 1000);
  });
  it('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    this.timeout(500);
    setTimeout(function() {
      fw.log('2. Test run - (2)');
      cb();
    }, 1000);
  });
  it('3. Test', function(cb) {
    fw.log('3. Test run - (1)');
    setTimeout(function() {
      fw.log('3. Test run - (2)');
      cb();
    }, 1000);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support timeout start (timeout:undefined)',
        '1. Test start (timeout:2000)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test succeed (timeout:2000)',
        '1. Test end (timeout:2000)',
        '2. Test start (timeout:2000)',
        '2. Test run - (1)',
        '2. Test timeover (timeout:500)',
        '2. Test error: Error: Timeout of 500ms exceeded. ' +
          'For async tests and hooks, ensure "done()" is called; ' +
          'if returning a Promise, ensure it resolves.',
        '2. Test end (timeout:500)',
        '3. Test start (timeout:2000)',
        '3. Test run - (1)',
        '2. Test run - (2)',
        '3. Test run - (2)',
        '3. Test succeed (timeout:2000)',
        '3. Test end (timeout:2000)',
        'Support timeout end (timeout:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set no timeout in test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 1000);
  });
  it('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    this.timeout(0);
    setTimeout(function() {
      fw.log('2. Test run - (2)');
      cb();
    }, 3000);
  });
  it('3. Test', function(cb) {
    fw.log('3. Test run - (1)');
    setTimeout(function() {
      fw.log('3. Test run - (2)');
      cb();
    }, 1000);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support timeout start (timeout:undefined)',
        '1. Test start (timeout:2000)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test succeed (timeout:2000)',
        '1. Test end (timeout:2000)',
        '2. Test start (timeout:2000)',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test succeed (timeout:0)',
        '2. Test end (timeout:0)',
        '3. Test start (timeout:2000)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test succeed (timeout:2000)',
        '3. Test end (timeout:2000)',
        'Support timeout end (timeout:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set timeout in suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    describe('1.1. Suite', function() {
      it('1.1.1. Test', function(cb) {
        fw.log('1.1.1. Test run - (1)');
        setTimeout(function() {
          fw.log('1.1.1. Test run - (2)');
          cb();
        },1000);
      });
    });
    describe('1.2. Suite', function() {
      it('1.2.1. Test', function(cb) {
        fw.log('1.2.1. Test run - (1)');
        setTimeout(function() {
          fw.log('1.2.1. Test run - (2)');
          cb();
        }, 1000);
      });
      this.timeout(500);
      it('1.2.2. Test', function(cb) {
        fw.log('1.2.2. Test run - (1)');
        setTimeout(function() {
          fw.log('1.2.2. Test run - (2)');
          cb();
        }, 1000);
      });
    });
    describe('1.3. Suite', function() {
      it('1.3.1. Test', function(cb) {
        fw.log('1.3.1. Test run - (1)');
        setTimeout(function() {
          fw.log('1.3.1. Test run - (2)');
          cb();
        }, 1000);
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support timeout start (timeout:undefined)',
        '1. Suite start (timeout:undefined)',
        '1.1. Suite start (timeout:undefined)',
        '1.1.1. Test start (timeout:2000)',
        '1.1.1. Test run - (1)',
        '1.1.1. Test run - (2)',
        '1.1.1. Test succeed (timeout:2000)',
        '1.1.1. Test end (timeout:2000)',
        '1.1. Suite end (timeout:undefined)',
        '1.2. Suite start (timeout:undefined)',
        '1.2.1. Test start (timeout:2000)',
        '1.2.1. Test run - (1)',
        '1.2.1. Test run - (2)',
        '1.2.1. Test succeed (timeout:2000)',
        '1.2.1. Test end (timeout:2000)',
        '1.2.2. Test start (timeout:500)',
        '1.2.2. Test run - (1)',
        '1.2.2. Test timeover (timeout:500)',
        '1.2.2. Test error: Error: Timeout of 500ms exceeded. ' +
          'For async tests and hooks, ensure "done()" is called; ' +
          'if returning a Promise, ensure it resolves.',
        '1.2.2. Test end (timeout:500)',
        '1.2. Suite end (timeout:undefined)',
        '1.3. Suite start (timeout:undefined)',
        '1.3.1. Test start (timeout:2000)',
        '1.3.1. Test run - (1)',
        '1.2.2. Test run - (2)',
        '1.3.1. Test run - (2)',
        '1.3.1. Test succeed (timeout:2000)',
        '1.3.1. Test end (timeout:2000)',
        '1.3. Suite end (timeout:undefined)',
        '1. Suite end (timeout:undefined)',
        'Support timeout end (timeout:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set illegal timeout in suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('Suite', function() {
    this.timeout('500');
    it('Test', function(cb) {
      fw.log('Test run - (1)');
      setTimeout(function() {
        fw.log('Test run - (2)');
        cb();
      }, 1000);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support timeout start (timeout:undefined)',
        'Suite start (timeout:undefined)',
        'Test start (timeout:2000)',
        'Test run - (1)',
        'Test run - (2)',
        'Test succeed (timeout:2000)',
        'Test end (timeout:2000)',
        'Suite end (timeout:undefined)',
        'Support timeout end (timeout:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('set illegal timeout in test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('Test', function(cb) {
    this.timeout('500');
    fw.log('Test run - (1)');
    setTimeout(function() {
      fw.log('Test run - (2)');
      cb();
    }, 1000);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support timeout start (timeout:undefined)',
        'Test start (timeout:2000)',
        'Test run - (1)',
        'Test run - (2)',
        'Test succeed (timeout:2000)',
        'Test end (timeout:2000)',
        'Support timeout end (timeout:undefined)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.run();
