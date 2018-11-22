'use strict';

var PASS = green('pass');
var FAIL = red('fail');

var root = {};
var testcase = root;
var testCount = 0;
var doneCount = 0;

function add(title, fn) {
  testcase.title = title;
  testcase.fn = fn;
  testcase = testcase.next = {};
  testCount++;
}

function run(cb) {
  testcase = root;
  nextRun(cb);
}

function nextRun(cb) {
  if (!testcase.fn) {
    if (typeof cb === 'function') {
      cb();
    }
    testcase = root = {};
    return;
  }

  try {
    testcase.fn(function(e) {
      if (e) {
        console.log('[' + FAIL + '] ' + testcase.title);
        throw e;
      }
      console.log('[' + PASS + '] ' + testcase.title);
      testcase = testcase.next;
      doneCount++;
      checkComplete();
      nextRun(cb);
    });
  } catch (e1) {
    console.log('[' + FAIL + '] ' + testcase.title);
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
