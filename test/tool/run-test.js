'use strict';

var PASS = green('pass');
var FAIL = red('fail');

var firstCase = {};
var testCase = firstCase;
var testCount = 0;
var doneCount = 0;

function add(title, fn) {
  testCase.title = title;
  testCase.fn = fn;
  testCase = testCase.next = {};
  testCount++;
}

function run(cb) {
  testCase = firstCase;
  nextRun(cb);
}

function nextRun(cb) {
  if (!testCase.fn) {
    if (typeof cb === 'function') {
      cb();
    }
    testCase = firstCase = {};
    return;
  }

  try {
    testCase.fn(function(e) {
      if (e) {
        console.log('[' + FAIL + '] ' + testCase.title);
        throw e;
      }
      console.log('[' + PASS + '] ' + testCase.title);
      testCase = testCase.next;
      doneCount++;
      checkComplete();
      nextRun(cb);
    });
  } catch (e1) {
    console.log('[' + FAIL + '] ' + testCase.title);
    throw e1;
  }
}

function checkComplete() {
  if (testCount === doneCount) {
    console.log(green(doneCount + ' completed.'));
  }
}

function green(text) {
  return '\u001b[32m' + text + '\u001b[39m';
}

function red(text) {
  return '\u001b[31m' + text + '\u001b[39m';
}

function desc(text) {
  console.log('\n' + text + '\n');
}

module.exports = {
  add: add,
  run: run,
  desc: desc,
};
