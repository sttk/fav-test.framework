'use strict';

var assert = require('assert');
var test = require('../tool/test');

var dontTwice = require('../../lib/util/dont-twice');

test.desc('lib/util/dont-twice.js');

test.add('Execute an error function when calling multiple times',
function(done) {
  var logs = [];
  var fn = function() {
    logs.push('called!');
  };
  var errorFn = function() {
    logs.push('call more once!');
  };
  fn = dontTwice(fn, errorFn);

  fn();
  assert.deepEqual(logs, [
    'called!',
  ]);

  fn();
  assert.deepEqual(logs, [
    'called!',
    'call more once!',
  ]);

  fn();
  assert.deepEqual(logs, [
    'called!',
    'call more once!',
    'call more once!',
  ]);
  done();
});

test.run();

