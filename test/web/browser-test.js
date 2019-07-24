(function(){
'use stirct';


var report = new Reporter('Asynchronous code');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
    it('should save without error (2)', function(done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});

function User(name) {
}
User.prototype.save = function(cb) {
  setTimeout(function() {
    cb();
  }, 1000);
};

fw.run(report.result(fw, [
  '',
  '    User',
  '      #save()',
  '        ✓ should save without error',
  '        ✓ should save without error (2)',
  '',
  '',
  '    2 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Asynchronous hooks');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var beforeEach = fw.beforeEach;

fw.on('start', function(node) {
  report.start(node);
});
fw.on('succeed', function(node) {
  report.succeed(node);
});
fw.on('error', function(node) {
  report.error(node);
});

function Connection() {
  this.saveError = null;
  this.clearError = null;
  this.findError = null;
  this.users = [];
}
Connection.prototype.save = function(users, cb) {
  this.users = users;
  cb(this.saveError);
};
Connection.prototype.clear = function(cb) {
  cb(this.clearError);
};
Connection.prototype.find = function(obj, cb) {
  cb(this.findError, this.users);
};

function User(name) {
  this.name = name;
}



describe('Connection', function() {
  var db = new Connection,
    tobi = new User('tobi'),
    loki = new User('loki'),
    jane = new User('jane');

  beforeEach(function(done) {
    db.clear(function(err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe('#find()', function() {
    it('respond with matching records', function(done) {
      db.find({ type: 'User' }, function(err, res) {
        if (err) return done(err);
        res.should.have.length(3);
        done();
      });
    });
  });
});

describe('Connection (save error)', function() {
  var db = new Connection,
    tobi = new User('tobi'),
    loki = new User('loki'),
    jane = new User('jane');

  db.saveError = new Error('Save error');

  beforeEach(function(done) {
    db.clear(function(err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe('#find()', function() {
    it('respond with matching records', function(done) {
      db.find({ type: 'User' }, function(err, res) {
        if (err) return done(err);
        res.should.have.length(3);
        done();
      });
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    Connection',
  '      #find()',
  '        ✓ respond with matching records',
  '',
  '    Connection (save error)',
  '      #find()',
  '        1) "before each" hook for "respond with matching records"',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) Connection (save error)',
  '         #find()',
  '           "before each" hook for "respond with matching records":',
  '       Error: Save error',
  '',
]));

})();
(function(){
'use stirct';


var report = new Reporter('Delayed Root Suite');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var run = fw.run;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

setTimeout(function() {
  describe('my suite', function() {
    it('my test', function() {
    });
  });

  run(report.result(fw, [
    '',
    '    my suite',
    '      ✓ my test',
    '',
    '',
    '    1 passing (${duration})',
    '',

  ]));
}, 5000);

})();
(function(){
'use strict';


var report = new Reporter('Describing Hooks');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var after = fw.after;
var beforeEach = fw.beforeEach;
var afterEach = fw.afterEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('hooks (before/after)', function() {

  before(function() {
    // runs before all tests in this block
    throw new Error('runs before all tests in this block');
  });

  after(function() {
    // runs after all tests in this block
    throw new Error('runs after all tests in this block');
  });

  beforeEach(function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

describe('describing hooks (before/after)', function() {

  before('BeforeHook', function() {
    // runs before all tests in this block
    throw new Error('runs before all tests in this block');
  });

  after('AfterHook', function() {
    // runs after all tests in this block
    throw new Error('runs after all tests in this block');
  });

  beforeEach('BeforeEachHook', function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach('AfterEachHook', function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

describe('hooks (beforeEach/afterEach)', function() {

  beforeEach(function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

describe('describing hooks (beforeEach/afterEach)', function() {

  beforeEach('BeforeEachHook', function() {
    // runs before each test in this block
    throw new Error('runs before each test in this block');
  });

  afterEach('AfterEachHook', function() {
    // runs after each test in this block
    throw new Error('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

fw.run(report.result(fw, [
  '',
  '    hooks (before/after)',
  '      1) "before all" hook',
  '      2) "after all" hook',
  '',
  '    describing hooks (before/after)',
  '      3) "before all" hook: BeforeHook',
  '      4) "after all" hook: AfterHook',
  '',
  '    hooks (beforeEach/afterEach)',
  '      5) "before each" hook for "test case 1"',
  '      6) "after each" hook for "test case 1"',
  '',
  '    describing hooks (beforeEach/afterEach)',
  '      7) "before each" hook: BeforeEachHook for "test case 1"',
  '      8) "after each" hook: AfterEachHook for "test case 1"',
  '',
  '',
  '    0 passing (${duration})',
  '    8 failing',
  '',
  '    1) hooks (before/after)',
  '         "before all" hook:',
  '       Error: runs before all tests in this block',
  '',
  '    2) hooks (before/after)',
  '         "after all" hook:',
  '       Error: runs after all tests in this block',
  '',
  '    3) describing hooks (before/after)',
  '         "before all" hook: BeforeHook:',
  '       Error: runs before all tests in this block',
  '',
  '    4) describing hooks (before/after)',
  '         "after all" hook: AfterHook:',
  '       Error: runs after all tests in this block',
  '',
  '    5) hooks (beforeEach/afterEach)',
  '         "before each" hook for "test case 1":',
  '       Error: runs before each test in this block',
  '',
  '    6) hooks (beforeEach/afterEach)',
  '         "after each" hook for "test case 1":',
  '       Error: runs after each test in this block',
  '',
  '    7) describing hooks (beforeEach/afterEach)',
  '         "before each" hook: BeforeEachHook for "test case 1":',
  '       Error: runs before each test in this block',
  '',
  '    8) describing hooks (beforeEach/afterEach)',
  '         "after each" hook: AfterEachHook for "test case 1":',
  '       Error: runs after each test in this block',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Detects multiple calls to done()');
var setImmediate = (typeof setImmediate === 'function') ? setImmediate :
  function(fn) { setTimeout(fn, 0); };


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('error', function(test) {
  report.error(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});

it('double done', function(done) {
  // Calling `done()` twice is an error
  setImmediate(done);
  setImmediate(done);
});

fw.run(report.result(fw, [
  '',
  '    ✓ double done',
  '    1) double done',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) double done:',
  '       Error: done() called multiple times',
  '',
]));


})();
(function(){
'use stirct';


var report = new Reporter('Dynamically Generating Tests');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});



function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('add()', function() {
  var tests = [
    {args: [1, 2],       expected: 3},
    {args: [1, 2, 3],    expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(function(test) {
    it('correctly adds ' + test.args.length + ' args', function() {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    add()',
  '      ✓ correctly adds 2 args',
  '      ✓ correctly adds 3 args',
  '      ✓ correctly adds 4 args',
  '',
  '',
  '    3 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Exclusive Tests');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
describe.only = fw.onlySuite;
it.only = fw.onlyTest;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // ...
    });

    it('should return the index when present', function() {
      // ...
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // this test will be run
    });

    it.only('should return the index when present', function() {
      // this test will also be run
    });

    it('should return -1 if called with a non-Array context', function() {
      // this test will not be run
    });
  });
});

describe('Array', function() {
  describe.only('#indexOf()', function() {
    it('should return -1 unless present', function() {
      // this test will be run
    });

    it('should return the index when present', function() {
      // this test will also be run
    });
  });

  describe.only('#concat()', function () {
    it('should return a new Array', function () {
      // this test will also be run
    });
  });

  describe('#slice()', function () {
    it('should return a new Array', function () {
      // this test will not be run
    });
  });
});

describe('Array', function() {
  describe.only('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // this test will be run
    });

    it('should return the index when present', function() {
      // this test will not be run
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '        ✓ should return the index when present',
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '        ✓ should return the index when present',
  '      #concat()',
  '        ✓ should return a new Array',
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 unless present',
  '',
  '',
  '    7 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';



var report = new Reporter('Getting Started');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 when the value is not present',
  '',
  '',
  '    1 passing (${duration})',
  '',
]));


})();
(function(){
'use strict';


var report = new Reporter('Hooks');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var after = fw.after;
var beforeEach = fw.beforeEach;
var afterEach = fw.afterEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
    report.text('runs before all tests in this block');
  });

  after(function() {
    // runs after all tests in this block
    report.text('runs after all tests in this block');
  });

  beforeEach(function() {
    // runs before each test in this block
    report.text('runs before each test in this block');
  });

  afterEach(function() {
    // runs after each test in this block
    report.text('runs after each test in this block');
  });

  // test cases
  it('test case 1', function() {
  });
  it('test case 2', function() {
  });
});

fw.run(report.result(fw, [
  '',
  '    hooks',
  'runs before all tests in this block',
  'runs before each test in this block',
  '      ✓ test case 1',
  'runs after each test in this block',
  'runs before each test in this block',
  '      ✓ test case 2',
  'runs after each test in this block',
  'runs after all tests in this block',
  '',
  '',
  '    2 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Inclusive tests');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var after = fw.after;

describe.skip = fw.skipSuite;
it.skip = fw.skipTest;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});
fw.on('skip', function(test) {
  report.skip(test);
});

function check_test_environment() {
  return false;
}

describe('Array (1)', function() {
  describe.skip('#indexOf()', function() {
    it('should return -1 unless present', function() {
      // this test will not be run
    });

    it('should return the index when present', function() {
      // this test will be run
    });
  });
});

describe('Array (2)', function() {
  describe('#indexOf()', function() {
    it.skip('should return -1 unless present', function() {
      // this test will not be run
    });

    it('should return the index when present', function() {
      // this test will be run
    });
  });
});

it('should only test in the correct environment (1)', function() {
  if (check_test_environment()) {
    // make assertions
  } else {
    this.skip();
  }
});

it('should only test in the correct environment (2)', function() {
  if (check_test_environment()) {
    // make assertions
  } else {
    // do nothing
  }
});

describe('outer', function () {
  before(function () {
    this.skip();
  });

  after(function () {
    report.text('after in "outer" will be executed');
  });

  describe('inner', function () {
    before(function () {
      report.text('before in "innter" will be skipped');
    });

    after(function () {
      report.text('after in "innter" will be skipped');
    });

    it('Run test in "inner"', function() {
    });
  });

  it('Run test in "outer"', function() {
  });
});

fw.run(report.result(fw, [
  '',
  '    Array (1)',
  '      #indexOf()',
  '        - should return -1 unless present',
  '        - should return the index when present',
  '',
  '    Array (2)',
  '      #indexOf()',
  '        - should return -1 unless present',
  '        ✓ should return the index when present',
  '',
  '    - should only test in the correct environment (1)',
  '    ✓ should only test in the correct environment (2)',
  '',
  '    outer',
  '      inner',
  '        - Run test in "inner"',
  '      - Run test in "outer"',
  'after in "outer" will be executed',
  '',
  '',
  '    2 passing (${duration})',
  '    6 pending',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Pending tests');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var beforeEach = fw.beforeEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});
fw.on('skip', function(test) {
  report.skip(test);
});

describe('Array', function() {
  describe('#indexOf()', function() {
    // pending test below
    it('should return -1 when the value is not present');
  });

  //describe('empty suite');
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        - should return -1 when the value is not present',
  '',
  '',
  '    0 passing (${duration})',
  '    1 pending',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Retry Tests');
var Promise = (typeof Promise === 'function') ? Promise :




var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var before = fw.before;
var beforeEach = fw.beforeEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});


if (chkEnv.isSupportES6()) {

  chai.use(chaiAsPromised);
}
var expect = chai.expect;

var browser = {
  get: function() {},
};
var count = 0;
var $ = function() {
  return {
    isDisplayed: function() {
      count++;
      return Promise.resolve(count > 3);
    },
  };
};

describe('retries (2 times)', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  before(function() {
    count = 0;
  });

  beforeEach(function() {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    if (chkEnv.isSupportES6()) {
      return expect($('.foo').isDisplayed()).to.eventually.be.true;
    } else {
      return $('.foo').isDisplayed().then(function(value) {
        expect(value).to.be.true;
      });
    }
  });
});

describe('retries (3 times)', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  before(function() {
    count = 0;
  });

  beforeEach(function() {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    this.retries(3);
    if (chkEnv.isSupportES6()) {
      return expect($('.foo').isDisplayed()).to.eventually.be.true;
    } else {
      return $('.foo').isDisplayed().then(function(value) {
        expect(value).to.be.true;
      });
    }
  });
});

fw.run(report.result(fw, [
  '',
  '    retries (2 times)',
  '      1) should succeed on the 3rd try',
  '',
  '    retries (3 times)',
  '      ✓ should succeed on the 3rd try',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) retries (2 times)',
  '         should succeed on the 3rd try:',
  '       AssertionError: expected false to be true',
  ''
]));

})();
(function(){
'use strict';


var report = new Reporter('Root-Level Hooks');


var fw = new Framework();

global.describe = fw.suite;
global.it = fw.test;
global.beforeEach = fw.beforeEach;
global.log = report.text.bind(report);

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});




fw.run(report.result(fw, [
  '',
  'before every test in every file',
  'test run',
  '    ✓ test',
  '',
  '    suite1',
  'before every test in every file',
  'test1 run',
  '      ✓ test1',
  '      suite2',
  'before every test in every file',
  'test2 run',
  '        ✓ test2',
  '',
  'before every test in every file',
  'test3 run',
  '    ✓ test3',
  '',
  '    suite4',
  'before every test in every file',
  'test4 run',
  '      ✓ test4',
  '      suite5',
  'before every test in every file',
  'test5 run',
  '        ✓ test5',
  '',
  '',
  '    6 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Synchronous code');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});




describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    Array',
  '      #indexOf()',
  '        ✓ should return -1 when the value is not present',
  '',
  '',
  '    1 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Test duration');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  var duration = test.endTime - test.startTime;
  if (duration > test.slow) {
    test.title += ' **red**';
  } else if (duration > test.slow / 2) {
    test.title += ' **yellow**';
  }
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

describe('durations', function() {
  this.slow(10000);

  describe('when slow', function() {
    it('should highlight in red', function(done) {
      this.slow(200);
      setTimeout(done, 201);
    });
  });

  describe('when reasonable', function() {
    it('should highlight in yellow', function(done) {
      this.slow(400);
      setTimeout(done, 201);
    });
  });

  describe('when fast', function() {
    it('should highlight in green', function(done) {
      setTimeout(done, 200);
    });
  });
});

fw.run(report.result(fw, [
  '',
  '    durations',
  '      when slow',
  '        ✓ should highlight in red **red**',
  '      when reasonable',
  '        ✓ should highlight in yellow **yellow**',
  '      when fast',
  '        ✓ should highlight in green',
  '',
  '',
  '    3 passing (${duration})',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Timeouts');


var fw = new Framework();
var describe = fw.suite;
var it = fw.test;
var beforeEach = fw.beforeEach;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});

// Suite Level

describe('a suite of tests', function() {
  this.timeout(500);

  it('should take less than 500ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function(done) {
    setTimeout(done, 250);
  });
});

describe('a suite of tests (error)', function() {
  this.timeout(200);

  it('should take less than 200ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 200ms as well', function(done) {
    setTimeout(done, 250);
  });
});

// Test level

it('should take less than 500ms', function(done) {
  this.timeout(500);
  setTimeout(done, 300);
});
it('should take less than 200ms (error)', function(done) {
  this.timeout(200);
  setTimeout(done, 300);
});

describe('a suite of tests (hook)', function() {
  beforeEach(function(done) {
    this.timeout(3000);
    setTimeout(done, 2500);
  });

  it('test', function() {
  });
});

describe('a suite of tests (hook error)', function() {
  beforeEach(function(done) {
    this.timeout(300);
    setTimeout(done, 500);
  });

  it('test', function() {
  });
});


fw.run(report.result(fw, [
  '',
  '    a suite of tests',
  '      ✓ should take less than 500ms',
  '      ✓ should take less than 500ms as well',
  '',
  '    a suite of tests (error)',
  '      1) should take less than 200ms',
  '      2) should take less than 200ms as well',
  '',
  '    ✓ should take less than 500ms',
  '    3) should take less than 200ms (error)',
  '',
  '    a suite of tests (hook)',
  '      ✓ test',
  '',
  '    a suite of tests (hook error)',
  '      4) "before each" hook for "test"',
  '',
  '',
  '    4 passing (${duration})',
  '    4 failing',
  '',
  '    1) a suite of tests (error)',
  '         should take less than 200ms:',
  '       Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
  '    2) a suite of tests (error)',
  '         should take less than 200ms as well:',
  '       Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
  '    3) should take less than 200ms (error):',
  '       Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
  '    4) a suite of tests (hook error)',
  '         "before each" hook for "test":',
  '       Error: Timeout of 300ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.',
  '',
]));

})();
(function(){
'use strict';


var report = new Reporter('Using async / await');
var Promise = (typeof Promise === 'function') ? Promise :



var fw = new Framework();
var beforeEach = fw.beforeEach;
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});
fw.on('timeout', function(test) {
  report.timeout(test);
});






function DB() {
}
DB.prototype.clear = function() {
  return new Promise(function (cb) {
    cb();
  });
};
DB.prototype.save = function() {
  return new Promise(function (cb) {
    cb();
  });
};
DB.prototype.find = function() {
  return new Promise(function(resolve) {
    resolve([tobi, loki, jane]);
  });
};

var tobi = 'Tobi',
    loki = 'Loki',
    jane = 'Jane';

var db = new DB();

if (!chkEnv.isSupportAsyncAwait()) {
  report.saySkipped();
  return;
}

eval("" +

"beforeEach(async function() {" +
"  await db.clear();" +
"  await db.save([tobi, loki, jane]);" +
"});" +
"" +
"describe('#find()', function() {" +
"  it('respond with matching records', async function() {" +
"    const users = await db.find({ type: 'User' });" +
"    users.should.have.length(3);" +
"  });" +
"});" +
"" +
"fw.run(report.result(fw, [" +
"  ''," +
"  '    #find()'," +
"  '      ✓ respond with matching records'," +
"  ''," +
"  ''," +
"  '    1 passing (${duration})'," +
"  ''," +
"]));" +

"");

})();
(function(){
'use strict';


var report = new Reporter('Working with promises');
var Promise = (typeof Promise === 'function') ? Promise :



var fw = new Framework();
var beforeEach = fw.beforeEach;
var describe = fw.suite;
var it = fw.test;

fw.on('start', function(test) {
  report.start(test);
});
fw.on('succeed', function(test) {
  report.succeed(test);
});
fw.on('error', function(test) {
  report.error(test);
});




function DB() {
}

DB.prototype.clear = function() {
  return new Promise(function (cb) {
    cb();
  });
};

DB.prototype.save = function() {
  return new Promise(function (cb) {
    cb();
  });
};

DB.prototype.find = function() {
  return new Promise(function(resolve) {
    resolve(['Tobi', 'Loki', 'Jane']);
  });
};

var tobi = 'Tobi',
    loki = 'Loki',
    jane = 'Jane';

var db = new DB();

beforeEach(function() {
  return db.clear()
    .then(function() {
      return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
  it('respond with matching records', function() {
    return db.find({ type: 'User' }).should.eventually.have.length(3);
  });
  it('should complete this test', function(done) {
    return new Promise(function(resolve) {
      assert.ok(true);
      resolve();
    }).then(done);
  });
});

fw.run(report.result(fw, [
  '',
  '    #find()',
  '      ✓ respond with matching records',
  '      1) should complete this test',
  '',
  '',
  '    1 passing (${duration})',
  '    1 failing',
  '',
  '    1) #find()',
  '         should complete this test:',
  '       Error: Resolution method is overspecified. Specify a callback *or* return a Promise; not both.',
  '',
]));

})();
