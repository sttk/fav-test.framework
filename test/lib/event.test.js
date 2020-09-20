'use strict';

var assert = require('assert');
var test = require('../tool/runner');

var Framework = require('../..');

function createTester() {
  var fw = new Framework();

  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };
  return fw;
}

test.desc('event');

test.add('Register & emit events', function(done) {
  var fw = createTester();
  fw._flag = 123;
  fw.on('ev1', function(arg) {
    fw.log('[ev1][' + arg + '][' + fw._flag + ']');
  });
  fw.on('ev.2', function(arg1, arg2) {
    fw.log('[ev.2][' + arg1 + '][' + arg2 + '][' + fw._flag + ']');
  });
  fw.on('ev 3', function(arg1, arg2, arg3) {
    fw.log('[ev 3][' + arg1 + '][' + arg2 + '][' + arg3 + '][' +
      fw._flag + ']');
  });

  fw.emit('ev1', 'A1');
  fw.emit('ev.2', 'B1', 'b1');
  fw.emit('ev 3', 'C1', 'd1', 'e1');
  fw.emit('ev.2', 'B2', 'b2');
  fw.emit('ev 3', 'C2', 'd2', 'e2');
  fw.emit('ev1', 'A2');
  fw.emit('ev 3', 'C3', 'd3', 'e3');

  assert.deepEqual(fw._logs, [
    '[ev1][A1][123]',
    '[ev.2][B1][b1][123]',
    '[ev 3][C1][d1][e1][123]',
    '[ev.2][B2][b2][123]',
    '[ev 3][C2][d2][e2][123]',
    '[ev1][A2][123]',
    '[ev 3][C3][d3][e3][123]',
  ]);
  done();
});

test.add('Register multiple event handlers and emit events', function(done) {
  var fw = createTester();

  fw.on('abc', function() {
    fw.log('abc - (1)');
  });
  fw.on('abc', function() {
    fw.log('abc - (2)');
  });

  fw.emit('abc');
  assert.deepEqual(fw._logs, [
    'abc - (1)',
    'abc - (2)',
  ]);

  fw.emit('abc');
  assert.deepEqual(fw._logs, [
    'abc - (1)',
    'abc - (2)',
    'abc - (1)',
    'abc - (2)',
  ]);
  done();
});

test.add('Register unregistered events and throw no error', function(done) {
  var fw = createTester();
  fw.emit('unregistered-event');
  done();
});

test.run();
