'use strict';

var assert = require('assert');
var test = require('../../tool/runner');

var callback = require('../../../lib/util/callback');

test.desc('lib/util/callback.js');

test.add('Should execute when the argument is a function', function(done) {
  var logs = [];
  callback(function() {
    logs.push('run callback (1)');
    callback(function() {
      logs.push('run callback (2)');
      callback(function() {
        logs.push('run callback (3)');
        assert.deepEqual(logs, [
          'run callback (1)',
          'run callback (2)',
          'run callback (3)',
        ]);
        done();
      });
    });
  });
});

test.add('Should ignore when the argument is not a function', function(done) {
  callback(undefined);
  callback(null);
  callback(0);
  callback(123);
  callback('');
  callback('ABC');
  callback([]);
  callback([1, 2, 3]);
  callback({});
  callback({ a: 1 });
  done();
});

test.add('Should pass an error which is specified', function(done) {
  callback(function(err) {
    assert.ok(err instanceof TypeError);
    assert.equal(err.message, 'error');
    done();
  }, new TypeError('error'));
});

test.run();
