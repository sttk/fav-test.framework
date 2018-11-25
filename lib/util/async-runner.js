'use strict';

var define = require('@fav/prop.define');
var isPromiseLike = require('./is-promise-like');
var dontTwice = require('./dont-twice');

var runner = {};

runner.runAsync = function(node, ctx, cb) {
  try {
    if (node.fn.length > 0) {
      runner.runAsyncByCallback(node, ctx, cb);
      return;
    }
    runner.runAsyncByPromise(node, ctx, cb);
  } catch (e) {
    cb(e);
  }
};

runner.runAsyncByPromise = function(node, ctx, cb) {
  var promise = node.fn.call(ctx);
  if (!isPromiseLike(promise)) {
    cb();
    return;
  }
  promise.then(function() { // Promise can pass value to thennable,
    cb();        // but callback args must be nullish if succeeded.
  }).catch(cb);
};

runner.runAsyncByCallback = function(node, ctx, cb) {
  return node.fn.call(ctx, cb);
};

define.override(runner, function runAsyncByCallback(node, ctx, cb) {
  var done = dontTwice(cb, function() {
    var err = runner.errorOfDoneTwice(node);
    if (err) {
      cb(err);
    }
  });
  return runAsyncByCallback.$uper(node, ctx, done);
});

runner.errorOfDoneTwice = function(/* node */) {
  var err = new Error('done() called multiple times');
  define.immutable(err, 'isDoneTwice', true);
  return err;
};

runner.isErrorOfDoneTwice = function(err) {
  return err.isDoneTwice;
};

define.override(runner, function runAsyncByCallback(node, ctx, cb) {
  var isBothPromiseAndCallback = false;

  var done = function(err) {
    if (!isBothPromiseAndCallback) {
      cb(err);
    }
  };
  var ret = runAsyncByCallback.$uper(node, ctx, done);

  if (isPromiseLike(ret)) {
    var err = runner.errorOfBothPromiseAndCallback(node);
    if (err) {
      isBothPromiseAndCallback = true;
      cb(err);
    }
  }
  return ret;
});

runner.errorOfBothPromiseAndCallback = function(/* node */) {
  return new Error(
    'Resolution method is overspecified. ' +
    'Specify a callback *or* return a Promise; not both.');
};

runner.runAsyncSequentially = function(nodes, cb) {
  runner.runAsyncRecursively(nodes, cb, true, 0);
};

runner.runAsyncIndividually = function(nodes, cb) {
  runner.runAsyncRecursively(nodes, cb, false, 0);
};

runner.runAsyncRecursively = function(nodes, cb, stopOnError, index) {
  if (index >= nodes.length) {
    cb();
    return;
  }

  var node = nodes[index];
  runner.setImmediate(function() {
    node.run(node, function(err) {
      if (err && stopOnError) {
        cb(err, node);
        return;
      }
      runner.runAsyncRecursively(nodes, cb, stopOnError, index + 1);
    });
  });
};

/* istanbul ignore next */
if (typeof setImmediate === 'function') {
  runner.setImmediate = setImmediate;
} else {
  runner.setImmediate = function(fn) {
    setTimeout(fn, 0);
  };
}

module.exports = runner;
