'use strict';

var assert = require('assert');
var test = require('../../tool/run-test');

var dontTwice = require('../../../lib/util/dont-twice');

test.desc('lib/util/dont-twice.js');

test.add('Execute a function when calling first time', function(done) {
  var logs = [];
  var fn = function() {
    logs.push('called!');
  };
  var errorFn = function() {
    logs.push('called more once!');
  };
  fn = dontTwice(fn, errorFn);

  fn();
  assert.deepEqual(logs, ['called!']);
  done();
});

test.add('Execute an error function when calling multiple times',
function(done) {
  var logs = [];
  var fn = function() {
    logs.push('called!');
  };
  var errorFn = function() {
    logs.push('called more once!');
  };
  fn = dontTwice(fn, errorFn);

  fn();
  assert.deepEqual(logs, ['called!']);

  fn();
  assert.deepEqual(logs, [
    'called!',
    'called more once!',
  ]);

  fn();
  assert.deepEqual(logs, [
    'called!',
    'called more once!',
    'called more once!',
  ]);
  done();
});

test.run();
