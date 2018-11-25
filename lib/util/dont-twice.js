'use strict';

var define = require('@fav/prop.define');

function dontTwice(fn, errorFn) {
  return function() {
    if (fn._called) {
      errorFn();
      return;
    }
    define.immutable(fn, '_called', true);
    return fn.apply(this, arguments);
  };
}

module.exports = dontTwice;
