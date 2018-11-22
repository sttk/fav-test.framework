'use strict';

var define = require('./util/define');
var isArray = require('@fav/type.is-array');

function implement(fw) {
  define.immutable(fw, '_eventHandlers', {});

  define.method(fw, 'on', register);
  define.method(fw, 'emit', emit);
}

function register(eventName, eventHandler) {
  if (!isArray(this._eventHandlers[eventName])) {
    define.immutable(this._eventHandlers, eventName, []);
  }
  this._eventHandlers[eventName].push(eventHandler);
}

function emit(eventName /* , ...args */) {
  var arr = this._eventHandlers[eventName];
  if (isArray(arr)) {
    for (var i = 0, n = arr.length; i < n; i++) {
      var fn = arr[i];
      fn.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
}

module.exports = implement;
