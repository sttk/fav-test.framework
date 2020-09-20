'use strict';

var style = require('@fav/cli.text-style');

var PASS = style.green('pass');
var FAIL = style.red('fail');

var rootCase = {};
var testCase = rootCase;
var testCount = 0;
var doneCount = 0;

function add(title, fn) {
  testCase.title = title;
  testCase.fn = fn;
  testCase = testCase.next = {};
  testCount++;
}

function run(cb) {
  testCase = rootCase;
  runCase(cb);

  function runCase(cb) {
    if (typeof testCase.fn !== 'function') {
      if (typeof cb === 'function') {
        cb();
      }
      testCase = rootCase = {};
      return;
    }

    try {
      testCase.fn(nextCase);
    } catch (e) {
      console.log('[' + FAIL + '] ' + testCase.title);
      throw e;
    }
  }

  function nextCase(e) {
    if (e) {
      console.log('[' + FAIL + '] ' + testCase.title);
      throw e;
    }
    console.log('[' + PASS + '] ' + testCase.title);
    doneCount++;
    if (testCount === doneCount) {
      console.log('\n' + style.green(doneCount + ' completed.'));
    }
    testCase = testCase.next;
    runCase(cb);
  }
}

function desc(text) {
  console.log('\n' + text + '\n');
}

module.exports = {
  add: add,
  run: run,
  desc: desc,
};
