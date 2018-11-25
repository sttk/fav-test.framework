'use strict';

var isFunction = require('@fav/type.is-function');

function isPromiseLike(obj) {
  return Boolean(obj) &&
         typeof obj === 'object' &&
         (isFunction(obj.then) || isFunction(obj.catch));
}

module.exports = isPromiseLike;
