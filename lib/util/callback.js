'use strict';

var isFunction = require('@fav/type.is-function');

function callback(cb, err) {
  if (isFunction(cb)) {
    cb(err);
  }
}

module.exports = callback;
