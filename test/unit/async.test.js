'use strict';

var assert = require('assert');
var test = require('../tool/test');

var implementEvent = require('../../lib/event');
var implementTree = require('../../lib/tree');
var implementHook = require('../../lib/hook');
var implementAsync = require('../../lib/async');

function createTester() {
  var fw = {};
  implementEvent(fw);
  implementTree(fw);
  implementHook(fw);
  implementAsync(fw);

  fw.title = 'Support async';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(node) {
    fw.log(node.title + ' start');
  });
  fw.on('end', function(node) {
    fw.log(node.title + ' end');
  });
  fw.on('error', function(node) {
    fw.log(node.title + ' error: ' + node.error);
  });
  return fw;
}

test.desc('lib/async.js');

test.add('Run async tests', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 200);
  });
  it('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    setTimeout(function() {
      fw.log('2. Test run - (2)');
      cb();
    }, 100);
  });
  it('3. Test', function(cb) {
    fw.log('3. Test run - (1)');
    setTimeout(function() {
      fw.log('3. Test run - (2)');
      cb();
    }, 800);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Test start',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test end',
        '2. Test start',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test end',
        '3. Test start',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run promisified tests', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
    fw.log('1. Test run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('1. Test run - (2)');
        resolve();
      }, 300);
    });
  });
  it('2. Test', function() {
    fw.log('2. Test run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('2. Test run - (2)');
        resolve();
      }, 200);
    });
  });
  it('3. Test', function() {
    fw.log('3. Test run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('3. Test run - (2)');
        resolve();
      }, 100);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Test start',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test end',
        '2. Test start',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test end',
        '3. Test start',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run sync tests', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it('2. Test', function() {
    fw.log('2. Test run');
  });
  it('3. Test', function() {
    fw.log('3. Test run');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Test start',
        '1. Test run',
        '1. Test end',
        '2. Test start',
        '2. Test run',
        '2. Test end',
        '3. Test start',
        '3. Test run',
        '3. Test end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run async tests & hooks', function(done) {
  var fw = createTester();
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. Before', function(cb) {
    fw.log('0. Before run - (1)');
    setTimeout(function() {
      fw.log('0. Before run - (2)');
      cb();
    }, 300);
  });
  after('0. After', function(cb) {
    fw.log('0. After run - (1)');
    setTimeout(function() {
      fw.log('0. After run - (2)');
      cb();
    }, 200);
  });
  beforeEach('0. BeforeEach', function(cb) {
    fw.log('0. BeforeEach run - (1)');
    setTimeout(function() {
      fw.log('0. BeforeEach run - (2)');
      cb();
    }, 400);
  });
  afterEach('0. AfterEach', function(cb) {
    fw.log('0. AfterEach run - (1)');
    setTimeout(function() {
      fw.log('0. AfterEach run - (2)');
      cb();
    }, 300);
  });
  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 200);
  });
  it('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    setTimeout(function() {
      fw.log('2. Test run - (2)');
      cb();
    }, 100);
  });
  it('3. Test', function(cb) {
    fw.log('3. Test run - (1)');
    setTimeout(function() {
      fw.log('3. Test run - (2)');
      cb();
    }, 200);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. Before run - (1)',
        '0. Before run - (2)',
        '1. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '1. Test end',
        '2. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '2. Test end',
        '3. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '3. Test end',
        '0. After run - (1)',
        '0. After run - (2)',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run promisified tests & hooks', function(done) {
  var fw = createTester();
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. Before', function() {
    fw.log('0. Before run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. Before run - (2)');
        resolve();
      }, 100);
    });
  });
  after('0. After', function() {
    fw.log('0. After run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. After run - (2)');
        resolve();
      }, 300);
    });
  });
  beforeEach('0. BeforeEach', function() {
    fw.log('0. BeforeEach run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. BeforeEach run - (2)');
        resolve();
      }, 200);
    });
  });
  afterEach('0. AfterEach', function() {
    fw.log('0. AfterEach run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. AfterEach run - (2)');
        resolve();
      }, 100);
    });
  });
  it('1. Test', function() {
    fw.log('1. Test run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('1. Test run - (2)');
        resolve();
      }, 400);
    });
  });
  it('2. Test', function() {
    fw.log('2. Test run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('2. Test run - (2)');
        resolve();
      }, 200);
    });
  });
  it('3. Test', function() {
    fw.log('3. Test run - (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('3. Test run - (2)');
        resolve();
      }, 100);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. Before run - (1)',
        '0. Before run - (2)',
        '1. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '1. Test end',
        '2. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '2. Test end',
        '3. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '3. Test end',
        '0. After run - (1)',
        '0. After run - (2)',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run sync tests & hooks', function(done) {
  var fw = createTester();
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. Before', function() {
    fw.log('0. Before run');
  });
  after('0. After', function() {
    fw.log('0. After run');
  });
  beforeEach('0. BeforeEach', function() {
    fw.log('0. BeforeEach run');
  });
  afterEach('0. AfterEach', function() {
    fw.log('0. AfterEach run');
  });
  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it('2. Test', function() {
    fw.log('2. Test run');
  });
  it('3. Test', function() {
    fw.log('3. Test run');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. Before run',
        '1. Test start',
        '0. BeforeEach run',
        '1. Test run',
        '0. AfterEach run',
        '1. Test end',
        '2. Test start',
        '0. BeforeEach run',
        '2. Test run',
        '0. AfterEach run',
        '2. Test end',
        '3. Test start',
        '0. BeforeEach run',
        '3. Test run',
        '0. AfterEach run',
        '3. Test end',
        '0. After run',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run suites', function(done) {
  var fw = createTester();
  var describe = fw.suite;

  describe('1. Suite', function() {
  });
  describe('2. Suite', function() {
    describe('2.1. Suite', function() {
      describe('2.1.1. Suite', function() {
      });
    });
    describe('2.2. Suite', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1. Suite end',
        '2. Suite start',
        '2.1. Suite start',
        '2.1.1. Suite start',
        '2.1.1. Suite end',
        '2.1. Suite end',
        '2.2. Suite start',
        '2.2. Suite end',
        '2. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      done(e);
    }
  });
});

test.add('Run async tests & suite & hooks', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. before', function(cb) {
    fw.log('0. before run (1)');
    setTimeout(function() {
      fw.log('0. before run (2)');
      cb();
    }, 100);
  });
  after('0. after', function(cb) {
    fw.log('0. after run (1)');
    setTimeout(function() {
      fw.log('0. after run (2)');
      cb();
    }, 100);
  });
  beforeEach('0. beforeEach', function(cb) {
    fw.log('0. beforeEach run (1)');
    setTimeout(function() {
      fw.log('0. beforeEach run (2)');
      cb();
    }, 100);
  });
  afterEach('0. afterEach', function(cb) {
    fw.log('0. afterEach run (1)');
    setTimeout(function() {
      fw.log('0. afterEach run (2)');
      cb();
    }, 100);
  });
  describe('1. suite', function() {
    before('1. before', function(cb) {
      fw.log('1. before run (1)');
      setTimeout(function() {
        fw.log('1. before run (2)');
        cb();
      }, 100);
    });
    after('1. after', function(cb) {
      fw.log('1. after run (1)');
      setTimeout(function() {
        fw.log('1. after run (2)');
        cb();
      }, 100);
    });
    beforeEach('1. beforeEach', function(cb) {
      fw.log('1. beforeEach run (1)');
      setTimeout(function() {
        fw.log('1. beforeEach run (2)');
        cb();
      }, 100);
    });
    afterEach('1. afterEach', function(cb) {
      fw.log('1. afterEach run (1)');
      setTimeout(function() {
        fw.log('1. afterEach run (2)');
        cb();
      }, 100);
    });
    describe('1.1. suite', function() {
      before('1.1. before', function(cb) {
        fw.log('1.1. before run (1)');
        setTimeout(function() {
          fw.log('1.1. before run (2)');
          cb();
        }, 100);
      });
      after('1.1. after', function(cb) {
        fw.log('1.1. after run (1)');
        setTimeout(function() {
          fw.log('1.1. after run (2)');
          cb();
        }, 100);
      });
      beforeEach('1.1. beforeEach', function(cb) {
        fw.log('1.1. beforeEach run (1)');
        setTimeout(function() {
          fw.log('1.1. beforeEach run (2)');
          cb();
        }, 100);
      });
      afterEach('1.1. afterEach', function(cb) {
        fw.log('1.1. afterEach run (1)');
        setTimeout(function() {
          fw.log('1.1. afterEach run (2)');
          cb();
        }, 100);
      });
      it('1.1.1. test', function(cb) {
        fw.log('1.1.1. test run (1)');
        setTimeout(function() {
          fw.log('1.1.1. test run (2)');
          cb();
        }, 100);
      });
    });
    it('1.2. test', function(cb) {
      fw.log('1.2. test run (1)');
      setTimeout(function() {
        fw.log('1.2. test run (2)');
        cb();
      }, 100);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. before run (1)',
        '0. before run (2)',

        '1. suite start',
        '1. before run (1)',
        '1. before run (2)',

        '1.1. suite start',
        '1.1. before run (1)',
        '1.1. before run (2)',

        '1.1.1. test start',
        '0. beforeEach run (1)',
        '0. beforeEach run (2)',
        '1. beforeEach run (1)',
        '1. beforeEach run (2)',
        '1.1. beforeEach run (1)',
        '1.1. beforeEach run (2)',

        '1.1.1. test run (1)',
        '1.1.1. test run (2)',

        '0. afterEach run (1)',
        '0. afterEach run (2)',
        '1. afterEach run (1)',
        '1. afterEach run (2)',
        '1.1. afterEach run (1)',
        '1.1. afterEach run (2)',
        '1.1.1. test end',

        '1.1. after run (1)',
        '1.1. after run (2)',
        '1.1. suite end',

        '1.2. test start',
        '0. beforeEach run (1)',
        '0. beforeEach run (2)',
        '1. beforeEach run (1)',
        '1. beforeEach run (2)',

        '1.2. test run (1)',
        '1.2. test run (2)',

        '0. afterEach run (1)',
        '0. afterEach run (2)',
        '1. afterEach run (1)',
        '1. afterEach run (2)',
        '1.2. test end',

        '1. after run (1)',
        '1. after run (2)',
        '1. suite end',

        '0. after run (1)',
        '0. after run (2)',
        'Support async end',
      ]);
      done();
    } catch (e) {
      done(e);
    }
  });
});

test.add('Run promisified tests & suite & hooks', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. before', function() {
    fw.log('0. before run (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. before run (2)');
        resolve();
      }, 100);
    });
  });
  after('0. after', function() {
    fw.log('0. after run (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. after run (2)');
        resolve();
      }, 100);
    });
  });
  beforeEach('0. beforeEach', function() {
    fw.log('0. beforeEach run (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. beforeEach run (2)');
        resolve();
      }, 100);
    });
  });
  afterEach('0. afterEach', function() {
    fw.log('0. afterEach run (1)');
    return new Promise(function(resolve) {
      setTimeout(function() {
        fw.log('0. afterEach run (2)');
        resolve();
      }, 100);
    });
  });
  describe('1. suite', function() {
    before('1. before', function() {
      fw.log('1. before run (1)');
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1. before run (2)');
          resolve();
        }, 100);
      });
    });
    after('1. after', function() {
      fw.log('1. after run (1)');
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1. after run (2)');
          resolve();
        }, 100);
      });
    });
    beforeEach('1. beforeEach', function() {
      fw.log('1. beforeEach run (1)');
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1. beforeEach run (2)');
          resolve();
        }, 100);
      });
    });
    afterEach('1. afterEach', function() {
      fw.log('1. afterEach run (1)');
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1. afterEach run (2)');
          resolve();
        }, 100);
      });
    });
    describe('1.1. suite', function() {
      before('1.1. before', function() {
        fw.log('1.1. before run (1)');
        return new Promise(function(resolve) {
          setTimeout(function() {
            fw.log('1.1. before run (2)');
            resolve();
          }, 100);
        });
      });
      after('1.1. after', function() {
        fw.log('1.1. after run (1)');
        return new Promise(function(resolve) {
          setTimeout(function() {
            fw.log('1.1. after run (2)');
            resolve();
          }, 100);
        });
      });
      beforeEach('1.1. beforeEach', function() {
        fw.log('1.1. beforeEach run (1)');
        return new Promise(function(resolve) {
          setTimeout(function() {
            fw.log('1.1. beforeEach run (2)');
            resolve();
          }, 100);
        });
      });
      afterEach('1.1. afterEach', function() {
        fw.log('1.1. afterEach run (1)');
        return new Promise(function(resolve) {
          setTimeout(function() {
            fw.log('1.1. afterEach run (2)');
            resolve();
          }, 100);
        });
      });
      it('1.1.1. test', function() {
        fw.log('1.1.1. test run (1)');
        return new Promise(function(resolve) {
          setTimeout(function() {
            fw.log('1.1.1. test run (2)');
            resolve();
          }, 100);
        });
      });
    });
    it('1.2. test', function() {
      fw.log('1.2. test run (1)');
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.2. test run (2)');
          resolve();
        }, 100);
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. before run (1)',
        '0. before run (2)',

        '1. suite start',
        '1. before run (1)',
        '1. before run (2)',

        '1.1. suite start',
        '1.1. before run (1)',
        '1.1. before run (2)',

        '1.1.1. test start',
        '0. beforeEach run (1)',
        '0. beforeEach run (2)',
        '1. beforeEach run (1)',
        '1. beforeEach run (2)',
        '1.1. beforeEach run (1)',
        '1.1. beforeEach run (2)',

        '1.1.1. test run (1)',
        '1.1.1. test run (2)',

        '0. afterEach run (1)',
        '0. afterEach run (2)',
        '1. afterEach run (1)',
        '1. afterEach run (2)',
        '1.1. afterEach run (1)',
        '1.1. afterEach run (2)',
        '1.1.1. test end',

        '1.1. after run (1)',
        '1.1. after run (2)',
        '1.1. suite end',

        '1.2. test start',
        '0. beforeEach run (1)',
        '0. beforeEach run (2)',
        '1. beforeEach run (1)',
        '1. beforeEach run (2)',

        '1.2. test run (1)',
        '1.2. test run (2)',

        '0. afterEach run (1)',
        '0. afterEach run (2)',
        '1. afterEach run (1)',
        '1. afterEach run (2)',
        '1.2. test end',

        '1. after run (1)',
        '1. after run (2)',
        '1. suite end',

        '0. after run (1)',
        '0. after run (2)',
        'Support async end',
      ]);
      done();
    } catch (e) {
      done(e);
    }
  });
});

test.add('Run sync tests & suite & hooks', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. before', function() {
    fw.log('0. before run');
  });
  after('0. after', function() {
    fw.log('0. after run');
  });
  beforeEach('0. beforeEach', function() {
    fw.log('0. beforeEach run');
  });
  afterEach('0. afterEach', function() {
    fw.log('0. afterEach run');
  });
  describe('1. suite', function() {
    before('1. before', function() {
      fw.log('1. before run');
    });
    after('1. after', function() {
      fw.log('1. after run');
    });
    beforeEach('1. beforeEach', function() {
      fw.log('1. beforeEach run');
    });
    afterEach('1. afterEach', function() {
      fw.log('1. afterEach run');
    });
    describe('1.1. suite', function() {
      before('1.1. before', function() {
        fw.log('1.1. before run');
      });
      after('1.1. after', function() {
        fw.log('1.1. after run');
      });
      beforeEach('1.1. beforeEach', function() {
        fw.log('1.1. beforeEach run');
      });
      afterEach('1.1. afterEach', function() {
        fw.log('1.1. afterEach run');
      });
      it('1.1.1. test', function() {
        fw.log('1.1.1. test run');
      });
    });
    it('1.2. test', function() {
      fw.log('1.2. test run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. before run',

        '1. suite start',
        '1. before run',

        '1.1. suite start',
        '1.1. before run',

        '1.1.1. test start',
        '0. beforeEach run',
        '1. beforeEach run',
        '1.1. beforeEach run',

        '1.1.1. test run',

        '0. afterEach run',
        '1. afterEach run',
        '1.1. afterEach run',
        '1.1.1. test end',

        '1.1. after run',
        '1.1. suite end',

        '1.2. test start',
        '0. beforeEach run',
        '1. beforeEach run',

        '1.2. test run',

        '0. afterEach run',
        '1. afterEach run',
        '1.2. test end',

        '1. after run',
        '1. suite end',

        '0. after run',
        'Support async end',
      ]);
      done();
    } catch (e) {
      done(e);
    }
  });
});

test.add('Cause an error when uses both callback and promise', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('Test', function(cb) {
    return new Promise(function(resolve) {
      fw.log('Test run');
      resolve();
    }).then(cb);
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        'Test start',
        'Test run',
        'Test error: Error: Resolution method is overspecified. ' +
          'Specify a callback *or* return a Promise; not both.',
        'Test end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in hook', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0. before', function() {
    throw new Error('before error');
  });
  after('0. after', function() {
    throw new Error('after error');
  });
  beforeEach('0. beforeEach', function() {
    throw new Error('beforeEach error');
  });
  afterEach('0. afterEach', function() {
    throw new Error('afterEach error');
  });
  describe('1. suite', function() {
    before('1. before', function() {
      throw new Error('before error');
    });
    after('1. after', function() {
      throw new Error('after error');
    });
    beforeEach('1. beforeEach', function() {
      throw new Error('beforeEach error');
    });
    afterEach('1. afterEach', function() {
      throw new Error('afterEach error');
    });
    it('1.1. test', function() {
      fw.log('1.1. test run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '0. before error: Error: before error',
        '1. suite start',
        '1. before error: Error: before error',
        '1.1. test start',
        '0. beforeEach error: Error: beforeEach error',
        '1. beforeEach error: Error: beforeEach error',
        '1.1. test run',
        '0. afterEach error: Error: afterEach error',
        '1. afterEach error: Error: afterEach error',
        '1.1. test end',
        '1. after error: Error: after error',
        '1. suite end',
        '0. after error: Error: after error',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.run();
