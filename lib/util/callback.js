'use strict';

var isFunction = require('@fav/type.is-function');

function callback(cb) {
  if (isFunction(cb)) {
    cb();
  }
}

module.exports = callback;
