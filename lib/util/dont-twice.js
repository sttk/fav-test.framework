'use strict';

function dontTwice(fn, errorFn) {
  return function() {
    if (fn._called) {
      errorFn();
      return;
    }
    Object.defineProperty(fn, '_called', { value: true });
    return fn.apply(this, arguments);
  };
}

module.exports = dontTwice;
