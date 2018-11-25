'use strict';

var define = require('@fav/prop.define');
var isArray = require('@fav/type.is-array');

function implement(fw) {
  define.immutable(fw, '_eventHandlers', {});

  fw.on = register;
  fw.emit = emit;
}

function register(eventName, eventHandler) {
  if (!isArray(this._eventHandlers[eventName])) {
    define.immutable(this._eventHandlers, eventName, []);
  }
  this._eventHandlers[eventName].push(eventHandler);
}

function emit(eventName /* , ...args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  var arr = this._eventHandlers[eventName];
  if (isArray(arr)) {
    for (var i = 0, n = arr.length; i < n; i++) {
      var fn = arr[i];
      fn.apply(this, args);
    }
  }
}

module.exports = implement;
