'use strict';

function isSupportES6() {
  return isSupportArrowFunction();
}

function isSupportArrowFunction() { // >= 4.0.0
  if (isNode()) {
    return getMajorVersion(process.version) >= 4;
  }
  return isModernBrowser();
}

function isSupportAsyncAwait() { // >= 7.6.0
  if (isNode()) {
    return getMajorVersion(process.version) >= 7;
  }
  return isModernBrowser();
}

function isModernBrowser() {
  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;
    if (ua.CHROME || ua.FIREFOX || ua.EDGE || ua.SAFARI || ua.VIVALDI) {
      return true;
    }
  }
}

function isNode() {
  if (typeof process === 'object') {
    if (typeof process.kill === 'function') {  // exists from v0.0.6
      return true;
    }
  }
  return false;
}

function getMajorVersion(version) {
  return Number(version.split('.')[0]);
}

module.exports = {
  isNode: isNode,
  isSupportES6: isSupportES6,
  isSupportAsyncAwait: isSupportAsyncAwait,
  isSupportArrowFunction: isSupportArrowFunction,
};
