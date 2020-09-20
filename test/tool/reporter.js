'use strict';

var assert = require('assert');
var repeat = require('@fav/text.repeat');
var parseArgv = require('@fav/cli.parse-argv');

var cliOpts = parseArgv().options;

function Reporter(title) {
  this.title = title;
  this._outputs = [];
  this._passed = [];
  this._errored = [];
  this._skipped = [];
}

Reporter.prototype.saySkipped = function() {
  console.log('[\u001b[36mSKIP\u001b[39m]', this.title);
};

Reporter.prototype.text = function(s) {
  this._outputs.push(s || '');
};

var toBeBreakLine = true;

Reporter.prototype.start = function(node) {
  if (node === node._framework) {
    return;
  }

  if (node.type === 'suite') {
    if (node.depth === 1) {
      this.text();
      toBeBreakLine = true;
    }
    this.text(indent(node) + node.title);
    return;
  }

  if (node.type === 'test') {
    if (node.depth === 1) {
      if (toBeBreakLine) {
        this.text();
      }
      toBeBreakLine = false;
    }
    return;
  }
};

Reporter.prototype.succeed = function(test) {
  this._passed.push(test);
  this.text(indent(test) + okMark() + test.title);
};

Reporter.prototype.skip = function(test) {
  this._skipped.push(test);
  this.text(indent(test) + skipMark() + test.title);
};

Reporter.prototype.error = function(node) {
  this._errored.push(node);
  var text;
  switch (node.type) {
    case 'before': {
      text = indent(node) +
             ngMark(this._errored.length) + '\"before all\" hook';
      if (node.title) {
        text += ': ' + node.title;
      }
      this.text(text);
      break;
    }
    case 'after': {
      text = indent(node) +
             ngMark(this._errored.length) + '\"after all\" hook';
      if (node.title) {
        text += ': ' + node.title;
      }
      this.text(text);
      break;
    }
    case 'beforeEach': {
      text = indent(node.node) +
             ngMark(this._errored.length) + '\"before each\" hook';
      if (node.title) {
        text += ': ' + node.title;
      }
      text += ' for "' + node.node.title + '"';
      this.text(text);
      break;
    }
    case 'afterEach': {
      text = indent(node.node) +
             ngMark(this._errored.length) + '\"after each\" hook';
      if (node.title) {
        text += ': ' + node.title;
      }
      text += ' for "' + node.node.title + '"';
      this.text(text);
      break;
    }
    default: {
      this.text(indent(node) + ngMark(this._errored.length) + node.title);
      break;
    }
  }
};

Reporter.prototype.timeout = function(/* test */) {
};

Reporter.prototype.result = function(fw, expected) {
  var self = this;
  var startTime = Date.now();

  return function() {
    var tm = duration(Date.now(), startTime);

    process.on('exit', function() {
      self.text();
      self.text();
      self.text(indent() + self._passed.length + ' passing (' + tm + ')');

      if (self._skipped.length > 0) {
        self.text(indent() + self._skipped.length + ' pending');
      }

      if (self._errored.length) {
        self.text(indent() + self._errored.length + ' failing');
        self._errored.forEach(function(node, i) {
          printError(node, i, self);
        });
      }
      self.text();

      if (!cliOpts.silent) {
        console.log(self._outputs.join('\n'));
      }

      if (expected != null) {
        expected = expected.map(function(s) {
          return s.replace('${duration}', tm);
        });

        try {
          assert.deepEqual(self._outputs, expected);
          console.log('[\u001b[32mPASS\u001b[39m]', self.title);
        } catch (e) {
          console.log('[\u001b[31mFAIL\u001b[39m]', self.title);
          console.log(e);
          process.exit(1);
        }
      }
    });
  };
};

function indent(node) {
  return '    ' + repeat('  ', node ? (node.depth - 1) : 0);
}

function okMark() {
  return '✓ ';
}

function skipMark() {
  return '- ';
}

function ngMark(errorCount) {
  return errorCount + ') ';
}

function duration(tm, baseTm) {
  if (baseTm) {
    tm -= baseTm;
  }

  if (tm < 1000) {
    return Math.floor(tm) + 'ms';
  }
  tm /= 1000;
  if (tm < 60) {
    return Math.floor(tm) + 'sec';
  }
  tm /= 60;
  if (tm < 60) {
    return Math.floor(tm) + 'min';
  }
  tm /= 60;
  return Math.floor(tm) + 'h';
}

function printError(node, index, report) {
  var arr = [],
      elm = node;
  while (elm && elm !== elm._framework) {
    arr.unshift(elm);
    switch (elm.type) {
      case 'before':
      case 'after': {
        elm = elm.node;
        break;
      }
      case 'beforeEach':
      case 'afterEach': {
        elm = elm.node._parent;
        break;
      }
      default: {
        elm = elm._parent;
        break;
      }
    }
  }

  report.text();

  var prefix = indent() + (index + 1) + ') ',
      tab = '',
      suffix = '';

  for (var i = 0, n = arr.length; i < n; i++) {
    var nd = arr[i];
    if (i > 0) {
      tab += '  ';
    }
    if (i === n - 1) {
      suffix = ':';
    }

    var title;
    switch (nd.type) {
      case 'before': {
        title = '"before all" hook';
        if (nd.title) {
          title += ': ' + nd.title;
        }
        break;
      }
      case 'after': {
        title = '"after all" hook';
        if (nd.title) {
          title += ': ' + nd.title;
        }
        break;
      }
      case 'beforeEach': {
        title = '"before each" hook';
        if (nd.title) {
          title += ': ' + nd.title;
        }
        title += ' for "' + nd.node.title + '"';
        break;
      }
      case 'afterEach': {
        title = '"after each" hook';
        if (nd.title) {
          title += ': ' + nd.title;
        }
        title += ' for "' + nd.node.title + '"';
        break;
      }
      default: {
        title = nd.title;
        break;
      }
    }
    report.text(prefix + tab + title + suffix);

    if (i === 0) {
      prefix = repeat(' ', prefix.length);
    }
  }

  if (node.timeoutError) {
    report.text(prefix + 'Error: Timeout of ' + node.timeout + 'ms exceeded.');
  } else {
    report.text(prefix + node.error.name + ': ' + node.error.message);
  }
}

module.exports = Reporter;
