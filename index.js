'use strict';

var implementEvent = require('./lib/event');
var implementTree = require('./lib/tree');
var implementHook = require('./lib/hook');
var implementAsync = require('./lib/async');
var implementRetry = require('./lib/retry');
var implementTimeout = require('./lib/timeout');
var implementSlow = require('./lib/slow');
var implementOnly = require('./lib/only');
var implementSkip = require('./lib/skip');

function Framework() {
  /* istanbul ignore if */
  if (!(this instanceof Framework)) {
    return new Framework();
  }

  implementEvent(this);
  implementTree(this);
  implementHook(this);
  implementAsync(this);
  implementRetry(this);
  implementTimeout(this);
  implementSlow(this);
  implementOnly(this);
  implementSkip(this);
}

module.exports = Framework;
