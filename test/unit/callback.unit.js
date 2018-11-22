'use strict';

var test = require('../tool/test');
var callback = require('../../lib/util/callback');

test.desc('lib/util/callback.js');

test.add('The argument is a function', function(done) {
  var logs = [];
  callback(function() {
    logs.push('run callback (1)');
    callback(function() {
      logs.push('run callback (2)');
      callback(function() {
        logs.push('run callback (3)');
        done();
      });
    });
  });
});

test.add('The argument is not a function', function(done) {
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

test.run();
