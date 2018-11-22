'use strict';

var callback = require('./callback');
var dontTwice = require('./dont-twice');
var isPromiseLike = require('./is-promise-like');
var isEmpty = require('@fav/type.is-empty');

function done(cb, test, err) {
  delete test.yet;
  if (err instanceof Error) {
    test.error = err;

    var fw = test._framework;
    fw.emit('error', test);
  }
  callback(cb);
}

function causeErrorWhenDoneTwice(test) {
  delete test.yet;
  test.error = new Error('done() called multiple times');

  var fw = test._framework;
  fw.emit('error', test);
  fw.emit('end', test);
}

exports.byCallback = function(test, ctx, cb) {
  try {
    var isBothPromiseAndCallback = false;

    var end = dontTwice(function(err) {
      if (!isBothPromiseAndCallback) {
        done(cb, test, err);
      }
    }, function() {
      causeErrorWhenDoneTwice(test);
    });

    var ret = test.fn.call(ctx, end);

    if (isPromiseLike(ret)) {
      isBothPromiseAndCallback = true;
      done(cb, test, new Error('Resolution method is overspecified. ' +
        'Specify a callback *or* return a Promise; not both.'));
    }
  } catch (e) {
    done(cb, test, e);
  }
};

exports.byPromise = function(test, ctx, cb) {
  try {
    var promise = test.fn.call(ctx);
    if (!isPromiseLike(promise)) {
      done(cb, test);
      return;
    }
    promise.then(function() {
      done(cb, test);
    }).catch(function(err) {
      done(cb, test, err);
    });
  } catch (e) {
    done(cb, test, e);
  }
};

exports.sequentially = function(nodes, cb) {
  runSequentially(nodes, 0, cb);
};

function runSequentially(nodes, index, cb) {
  if (index >= nodes.length) {
    callback(cb);
    return;
  }

  var node = nodes[index];
  setImmediate(function() {
    node.run(node, function() {
      runSequentially(nodes, index + 1, cb);
    });
  });
}

exports.parallelly = function(nodes, cb) {
  if (!nodes.length) {
    callback(cb);
    return;
  }

  var yet = {};
  for (var i = 0, n = nodes.length; i < n; i++) {
    yet[i] = true;
  }
  nodes.forEach(function(node, i) {
    setImmediate(function() {
      node.run(node, function() {
        delete yet[i];
        if (isEmpty(yet)) {
          callback(cb);
        }
      });
    });
  });
};
