'use strict';

var isFunction = require('@fav/type.is-function');

function immutable(obj, name, value) {
  Object.defineProperty(obj, name, {
    configurable: true,
    value: value,
  });
}

function mutable(obj, name, value) {
  Object.defineProperty(obj, name, {
    writable: true,
    configurable: true,
    value: value,
  });
}

function method(obj, name, fn) {
  Object.defineProperty(obj, name, {
    enumerable: true,
    writable: true,
    value: fn.bind(obj),
  });
}

function override(obj, name, fn) {
  if (isFunction(name)) {
    fn = name;
    name = fn.name;
  }

  var superFn = obj[name];
  if (isFunction(superFn)) {
    immutable(fn, '$uper', superFn);
  }

  Object.defineProperty(obj, name, {
    enumerable: true,
    writable: true,
    value: fn,
  });
}

module.exports = {
  immutable: immutable,
  mutable: mutable,
  method: method,
  override: override,
};
