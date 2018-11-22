'use strict';

var assert = require('assert');
var test = require('../tool/test');

var implementEvents = require('../../lib/event');
var implementTree = require('../../lib/tree');

function createTester() {
  var fw = {};
  implementEvents(fw);
  implementTree(fw);

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

test.desc('lib/tree.js');

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

test.run();
