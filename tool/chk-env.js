'use strict';

var semver = require('semver');

function isSupportES6() {
  return isSupportArrowFunction();
}

function isSupportArrowFunction() {
  if (isNode()) {
    return semver.gte(process.version, '4.0.0');
  }
  return isModernBrowser();
}

function isSupportAsyncAwait() {
  if (isNode()) {
    return semver.gte(process.version, '7.6.0');
  }
  return isModernBrowser();
}

function isModernBrowser() {
  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check on latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return false;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return false;
    }
  }

  return false;
}

function isNode() {
  if (typeof process === 'object') {
    if (typeof process.kill === 'function') { // exist from v0.0.6
      return true;
    }
  }
  return false;
}

module.exports = {
  isNode: isNode,
  isSupportES6: isSupportES6,
  isSupportAsyncAwait: isSupportAsyncAwait,
  isSupportArrowFunction: isSupportArrowFunction,
};

