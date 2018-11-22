'use strict';

var assert = require('assert');
var test = require('../tool/test');
var define = require('../../lib/util/define');

test.desc('lib/util/define.js');

test.add('define.immutable', function(done) {
  var obj = {};
  define.immutable(obj, 'a', 1);
  assert.strictEqual(obj.a, 1);

  assert.throws(function() {
    obj.a = 2;
  }, TypeError);
  assert.strictEqual(obj.a, 1);
  done();
});

test.add('define.mutable', function(done) {
  var obj = {};
  define.mutable(obj, 'a', 1);
  assert.strictEqual(obj.a, 1);

  obj.a = 2;
  assert.strictEqual(obj.a, 2);
  done();
});

test.add('define.method', function(done) {
  var logs = [];
  var obj = { a: 123 };
  define.method(obj, 'f', function() {
    logs.push('f => ' + this.a);
  });

  obj.f();

  assert.deepEqual(logs, [
    'f => 123',
  ]);
  done();
});

test.add('define.override - specify a name and a function', function(done) {
  var logs = [];
  var obj = { a: 123 };
  define.override(obj, 'f', function f1() {
    logs.push('call f - (1)');
  });
  obj.f();
  assert.deepEqual(logs, [
    'call f - (1)',
  ]);

  define.override(obj, 'f', function f2() {
    f2.$uper();
    logs.push('call f - (2)');
  });
  obj.f();
  assert.deepEqual(logs, [
    'call f - (1)',
    'call f - (1)',
    'call f - (2)',
  ]);
  done();
});

test.add('define.override - specify a named function', function(done) {
  var logs = [];
  var obj = { a: 123 };
  define.override(obj, function f() {
    logs.push('call f - (1)');
  });
  obj.f();
  assert.deepEqual(logs, [
    'call f - (1)',
  ]);

  define.override(obj, function f() {
    f.$uper();
    logs.push('call f - (2)');
  });
  obj.f();
  assert.deepEqual(logs, [
    'call f - (1)',
    'call f - (1)',
    'call f - (2)',
  ]);
  done();
});

test.run();
