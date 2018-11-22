'use strict';

var isFunction = require('@fav/type.is-function');

function isPromiseLike(object) {
  return Boolean(object) &&
         typeof object === 'object' &&
         isFunction(object.then) &&
         isFunction(object.catch);
}

module.exports = isPromiseLike;
