'use strict';

var assert = require('assert');
var test = require('../tool/run-test');

var Framework = require('../..');

function createTester() {
  var fw = new Framework();

  fw.title = 'Tree';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(node) {
    fw._logs.push(node.title + ' start');
  });
  fw.on('end', function(node) {
    fw._logs.push(node.title + ' end');
  });

  return fw;
}

test.desc('join - tree');

test.add('Register & run tests', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it('2. Test', function() {
    fw.log('2. Test run');
  });
  it('3. Test', function() {
    fw.log('3. Test run');
  });

  fw.run(function () {
    assert.deepEqual(fw._logs, [
      'Tree start',
      '1. Test start',
      '1. Test run',
      '1. Test end',
      '2. Test start',
      '2. Test run',
      '2. Test end',
      '3. Test start',
      '3. Test run',
      '3. Test end',
      'Tree end',
    ]);
    done();
  });
});

test.add('Register & run suites & tests', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;

  describe('1. Suite', function() {
    fw.log('1. Suite run');
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
    it('1.2. Test', function() {
      fw.log('1.2. Test run');
    });
    it('1.3. Test', function() {
      fw.log('1.3. Test run');
    });
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      '1. Suite run',
      'Tree start',
      '1. Suite start',
      '1.1. Test start',
      '1.1. Test run',
      '1.1. Test end',
      '1.2. Test start',
      '1.2. Test run',
      '1.2. Test end',
      '1.3. Test start',
      '1.3. Test run',
      '1.3. Test end',
      '1. Suite end',
      'Tree end',
    ]);
    done();
  });
});

test.add('Register & run nested suites & tests', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;

  describe('1. Suite', function() {
    fw.log('1. Suite run');
    describe('1.1. Suite', function() {
      fw.log('1.1. Suite run');
      it('1.1.1. Test', function() {
        fw.log('1.1.1. Test run');
      });
      describe('1.1.2. Suite', function() {
        fw.log('1.1.2. Suite run');
        it('1.1.2.1. Test', function() {
          fw.log('1.1.2.1. Test run');
        });
        it('1.1.2.2. Test', function() {
          fw.log('1.1.2.2. Test run');
        });
      });
    });
    it('1.2. Test', function() {
      fw.log('1.2. Test run');
    });
    describe('1.3. Suite', function() {
      fw.log('1.3. Suite run');
      describe('1.3.1. Suite', function() {
        fw.log('1.3.1. Suite run');
        it('1.3.1.1. Test', function() {
          fw.log('1.3.1.1. Test run');
        });
        it('1.3.1.2. Test', function() {
          fw.log('1.3.1.2. Test run');
        });
      });
    });
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      '1. Suite run',
      '1.1. Suite run',
      '1.1.2. Suite run',
      '1.3. Suite run',
      '1.3.1. Suite run',
      'Tree start',
      '1. Suite start',
      '1.1. Suite start',
      '1.1.1. Test start',
      '1.1.1. Test run',
      '1.1.1. Test end',
      '1.1.2. Suite start',
      '1.1.2.1. Test start',
      '1.1.2.1. Test run',
      '1.1.2.1. Test end',
      '1.1.2.2. Test start',
      '1.1.2.2. Test run',
      '1.1.2.2. Test end',
      '1.1.2. Suite end',
      '1.1. Suite end',
      '1.2. Test start',
      '1.2. Test run',
      '1.2. Test end',
      '1.3. Suite start',
      '1.3.1. Suite start',
      '1.3.1.1. Test start',
      '1.3.1.1. Test run',
      '1.3.1.1. Test end',
      '1.3.1.2. Test start',
      '1.3.1.2. Test run',
      '1.3.1.2. Test end',
      '1.3.1. Suite end',
      '1.3. Suite end',
      '1. Suite end',
      'Tree end',
    ]);
    done();
  });
});

test.add('No/illegal callback of test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('No callback');
  it('Illegal callback', []);

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Tree start',
      'No callback start',
      'No callback end',
      'Illegal callback start',
      'Illegal callback end',
      'Tree end',
    ]);
    done();
  });
});

if (typeof implementTree !== 'undefined') {

  test.add('No/illegal callback of suite', function(done) {
    var fw = createTester();
    var describe = fw.suite;

    describe('No callback');
    describe('Illegal callback', []);

    fw.run(function() {
      assert.deepEqual(fw._logs, [
        'Tree start',
        'No callback start',
        'No callback end',
        'Illegal callback start',
        'Illegal callback end',
        'Tree end',
      ]);
      done();
    });
  });

}

test.add('Framework#run can have no argument', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;

  describe('Suite 1', function() {
    describe('Suite 1.1', function() {
      it('Test 1.1.1', function() {
      });
    });
  });
  fw.on('end', function(node) {
    if (node.depth === 0) {
      assert.deepEqual(fw._logs, [
        'Tree start',
        'Suite 1 start',
        'Suite 1.1 start',
        'Test 1.1.1 start',
        'Test 1.1.1 end',
        'Suite 1.1 end',
        'Suite 1 end',
        'Tree end',
      ]);
      done();
    }
  });
  fw.run();
});



test.run();
