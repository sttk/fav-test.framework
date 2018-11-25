'use strict';

var assert = require('assert');
var test = require('../tool/run-test');

if (typeof global.Promise !== 'function') {
  global.Promise = require('promise-polyfill');
}

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
  fw.on('succeed', function(node) {
    fw.log(node.title + ' succeed');
  });
  fw.on('end', function(node) {
    fw.log(node.title + ' end');
  });
  fw.on('error', function(node) {
    switch (node.type) {
      case 'before':
      case 'after':
      case 'beforeEach':
      case 'afterEach': {
        fw.log(node.title + ' error: ' + node.error +
          ' for ' + node.node.title);
        break;
      }
      default: {
        fw.log(node.title + ' error: ' + node.error);
        break;
      }
    }
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
        '1. Test succeed',
        '1. Test end',
        '2. Test start',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test succeed',
        '2. Test end',
        '3. Test start',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test succeed',
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
        '1. Test succeed',
        '1. Test end',
        '2. Test start',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test succeed',
        '2. Test end',
        '3. Test start',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test succeed',
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
        '1. Test succeed',
        '1. Test end',
        '2. Test start',
        '2. Test run',
        '2. Test succeed',
        '2. Test end',
        '3. Test start',
        '3. Test run',
        '3. Test succeed',
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
        '1. Test succeed',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '1. Test end',
        '2. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test succeed',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '2. Test end',
        '3. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test succeed',
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
        '1. Test succeed',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '1. Test end',
        '2. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test succeed',
        '0. AfterEach run - (1)',
        '0. AfterEach run - (2)',
        '2. Test end',
        '3. Test start',
        '0. BeforeEach run - (1)',
        '0. BeforeEach run - (2)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test succeed',
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
        '1. Test succeed',
        '0. AfterEach run',
        '1. Test end',
        '2. Test start',
        '0. BeforeEach run',
        '2. Test run',
        '2. Test succeed',
        '0. AfterEach run',
        '2. Test end',
        '3. Test start',
        '0. BeforeEach run',
        '3. Test run',
        '3. Test succeed',
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
      console.log(e);
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
        '1.1.1. test succeed',

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
        '1.2. test succeed',

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
        '1.1.1. test succeed',

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
        '1.2. test succeed',

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
        '1.1.1. test succeed',

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
        '1.2. test succeed',

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

test.add('Cause an error in sync test', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
    it('1.2. Test', function() {
      throw new Error('ERROR(1.2)');
    });
    it('1.3. Test', function() {
      fw.log('1.3. Test run');
    });
  });
  describe('2. Suite', function() {
    it('2.1. Test', function() {
      fw.log('2.1. Test run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test succeed',
        '1.1. Test end',
        '1.2. Test start',
        '1.2. Test error: Error: ERROR(1.2)',
        '1.2. Test end',
        '1.3. Test start',
        '1.3. Test run',
        '1.3. Test succeed',
        '1.3. Test end',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test succeed',
        '2.1. Test end',
        '2. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in async test with callback', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    it('1.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Test run');
        cb();
      }, 200);
    });
    it('1.2. Test', function(cb) {
      setTimeout(function() {
        cb(new Error('ERROR(1.2)'));
      }, 200);
    });
    it('1.3. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.3. Test run');
        cb();
      }, 200);
    });
  });
  describe('2. Suite', function() {
    it('2.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('2.1. Test run');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test succeed',
        '1.1. Test end',
        '1.2. Test start',
        '1.2. Test error: Error: ERROR(1.2)',
        '1.2. Test end',
        '1.3. Test start',
        '1.3. Test run',
        '1.3. Test succeed',
        '1.3. Test end',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test succeed',
        '2.1. Test end',
        '2. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in async test with promise', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    it('1.1. Test', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.1. Test run');
          resolve();
        }, 200);
      });
    });
    it('1.2. Test', function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          reject(new Error('ERROR(1.2)'));
        }, 200);
      });
    });
    it('1.3. Test', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.3. Test run');
          resolve();
        }, 200);
      });
    });
  });
  describe('2. Suite', function() {
    it('2.1. Test', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('2.1. Test run');
          resolve();
        }, 200);
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test succeed',
        '1.1. Test end',
        '1.2. Test start',
        '1.2. Test error: Error: ERROR(1.2)',
        '1.2. Test end',
        '1.3. Test start',
        '1.3. Test run',
        '1.3. Test succeed',
        '1.3. Test end',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test succeed',
        '2.1. Test end',
        '2. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error when does callback twice in test', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    it('1.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Test run');
        cb();
      }, 200);
    });
    it('1.2. Test', function(cb) {
      setTimeout(function() {
        cb();
        cb();
      }, 200);
    });
    it('1.3. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.3. Test run');
        cb();
      }, 200);
    });
  });
  describe('2. Suite', function() {
    it('2.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('2.1. Test run');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test succeed',
        '1.1. Test end',
        '1.2. Test start',
        '1.2. Test succeed',
        '1.2. Test end',
        '1.2. Test error: Error: done() called multiple times',
        '1.3. Test start',
        '1.3. Test run',
        '1.3. Test succeed',
        '1.3. Test end',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test succeed',
        '2.1. Test end',
        '2. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error when uses both callback and promise in test',
function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;

  describe('1. Suite', function() {
    it('1.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Test run');
        cb();
      }, 200);
    });
    it('1.2. Test', function(cb) {
      return Promise.resolve(cb);
    });
    it('1.3. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.3. Test run');
        cb();
      }, 200);
    });
  });
  describe('2. Suite', function() {
    it('2.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('2.1. Test run');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test succeed',
        '1.1. Test end',
        '1.2. Test start',
        '1.2. Test error: Error: Resolution method is overspecified. ' +
          'Specify a callback *or* return a Promise; not both.',
        '1.2. Test end',
        '1.3. Test start',
        '1.3. Test run',
        '1.3. Test succeed',
        '1.3. Test end',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test succeed',
        '2.1. Test end',
        '2. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in sync hook', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. Suite', function() {
    before('1.1. Before', function() {
      fw.log('1.1. Before run');
    });
    before('1.2. Before', function() {
      fw.log('1.2. Before run');
      throw new Error('ERROR(1.2)');
    });
    before('1.3. Before', function() {
      fw.log('1.3. Before run');
    });
    after('1.1. After', function() {
      fw.log('1.1. After run');
    });
    after('1.2. After', function() {
      fw.log('1.2. After run');
      throw new Error('ERROR(1.2)');
    });
    after('1.3. After', function() {
      fw.log('1.3. After run');
    });
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
  });
  describe('2. Suite', function() {
    beforeEach('2.1. BeforeEach', function() {
      fw.log('2.1. BeforeEach run');
    });
    beforeEach('2.2. BeforeEach', function() {
      fw.log('2.2. BeforeEach run');
      throw new Error('ERROR(2.2)');
    });
    beforeEach('2.3. BeforeEach', function() {
      fw.log('2.3. BeforeEach run');
    });
    afterEach('2.1. AfterEach', function() {
      fw.log('2.1. AfterEach run');
    });
    afterEach('2.2. AfterEach', function() {
      fw.log('2.2. AfterEach run');
      throw new Error('ERROR(2.2)');
    });
    afterEach('2.3. AfterEach', function() {
      fw.log('2.3. AfterEach run');
    });
    it('2.1. Test', function() {
      fw.log('2.1. Test run');
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function() {
      fw.log('3.1. Test run');
    });
  });
  describe('4. Suite', function() {
    it('4.1. Test', function() {
      fw.log('4.1. Test run');
    });
    describe('4.2. Suite', function() {
      it('4.2.1. Test', function() {
        fw.log('4.2.1. Test run');
      });
    });
    afterEach('4.1. AfterEach', function() {
      fw.log('4.1. AfterEach run');
    });
    afterEach('4.2. AfterEach', function() {
      fw.log('4.2. AfterEach run');
      throw new Error('ERROR(4.2)');
    });
    afterEach('4.3. AfterEach', function() {
      fw.log('4.3. AfterEach run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Before run',
        '1.2. Before run',
        '1.2. Before error: Error: ERROR(1.2) for 1. Suite',
        '1.1. After run',
        '1.2. After run',
        '1.2. After error: Error: ERROR(1.2) for 1. Suite',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. BeforeEach run',
        '2.2. BeforeEach run',
        '2.2. BeforeEach error: Error: ERROR(2.2) for 2.1. Test',
        '2.1. AfterEach run',
        '2.2. AfterEach run',
        '2.2. AfterEach error: Error: ERROR(2.2) for 2.1. Test',
        '2.1. Test end',
        '2. Suite end',
        '3. Suite start',
        '3.1. Test start',
        '3.1. Test run',
        '3.1. Test succeed',
        '3.1. Test end',
        '3. Suite end',
        '4. Suite start',
        '4.1. Test start',
        '4.1. Test run',
        '4.1. Test succeed',
        '4.1. AfterEach run',
        '4.2. AfterEach run',
        '4.2. AfterEach error: Error: ERROR(4.2) for 4.1. Test',
        '4.1. Test end',
        '4. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in async hook with callback', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. Suite', function() {
    before('1.1. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Before run');
        cb();
      }, 200);
    });
    before('1.2. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.2. Before run');
        cb(new Error('ERROR(1.2)'));
      }, 200);
    });
    before('1.3. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.3. Before run');
        cb();
      }, 200);
    });
    after('1.1. After', function(cb) {
      setTimeout(function() {
        fw.log('1.1. After run');
        cb();
      }, 200);
    });
    after('1.2. After', function(cb) {
      setTimeout(function() {
        fw.log('1.2. After run');
        cb(new Error('ERROR(1.2)'));
      }, 200);
    });
    after('1.3. After', function(cb) {
      setTimeout(function() {
        fw.log('1.3. After run');
        cb();
      }, 200);
    });
    it('1.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('2. Suite', function() {
    beforeEach('2.1. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.1. BeforeEach run');
        cb();
      }, 200);
    });
    beforeEach('2.2. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.2. BeforeEach run');
        cb(new Error('ERROR(2.2)'));
      }, 200);
    });
    beforeEach('2.3. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.3. BeforeEach run');
        cb();
      }, 200);
    });
    afterEach('2.1. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.1. AfterEach run');
        cb();
      }, 200);
    });
    afterEach('2.2. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.2. AfterEach run');
        cb(new Error('ERROR(2.2)'));
      }, 200);
    });
    afterEach('2.3. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.3. AfterEach run');
        cb();
      }, 200);
    });
    it('2.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('2.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('3.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('4. Suite', function() {
    it('4.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('4.1. Test run');
        cb();
      }, 200);
    });
    afterEach('4.1. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('4.1. AfterEach run');
        cb();
      }, 200);
    });
    afterEach('4.2. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('4.2. AfterEach run');
        cb(new Error('ERROR(4.2)'));
      }, 200);
    });
    afterEach('4.3. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('4.3. AfterEach run');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Before run',
        '1.2. Before run',
        '1.2. Before error: Error: ERROR(1.2) for 1. Suite',
        '1.1. After run',
        '1.2. After run',
        '1.2. After error: Error: ERROR(1.2) for 1. Suite',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. BeforeEach run',
        '2.2. BeforeEach run',
        '2.2. BeforeEach error: Error: ERROR(2.2) for 2.1. Test',
        '2.1. AfterEach run',
        '2.2. AfterEach run',
        '2.2. AfterEach error: Error: ERROR(2.2) for 2.1. Test',
        '2.1. Test end',
        '2. Suite end',
        '3. Suite start',
        '3.1. Test start',
        '3.1. Test run',
        '3.1. Test succeed',
        '3.1. Test end',
        '3. Suite end',
        '4. Suite start',
        '4.1. Test start',
        '4.1. Test run',
        '4.1. Test succeed',
        '4.1. AfterEach run',
        '4.2. AfterEach run',
        '4.2. AfterEach error: Error: ERROR(4.2) for 4.1. Test',
        '4.1. Test end',
        '4. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in async hook with promise', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. Suite', function() {
    before('1.1. Before', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.1. Before run');
          resolve();
        }, 200);
      });
    });
    before('1.2. Before', function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          fw.log('1.2. Before run');
          reject(new Error('ERROR(1.2)'));
        }, 200);
      });
    });
    before('1.3. Before', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.3. Before run');
          resolve();
        }, 200);
      });
    });
    after('1.1. After', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.1. After run');
          resolve();
        }, 200);
      });
    });
    after('1.2. After', function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          fw.log('1.2. After run');
          reject(new Error('ERROR(1.2)'));
        }, 200);
      });
    });
    after('1.3. After', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('1.3. After run');
          resolve();
        }, 200);
      });
    });
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
  });
  describe('2. Suite', function() {
    beforeEach('2.1. BeforeEach', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('2.1. BeforeEach run');
          resolve();
        }, 200);
      });
    });
    beforeEach('2.2. BeforeEach', function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          fw.log('2.2. BeforeEach run');
          reject(new Error('ERROR(2.2)'));
        }, 200);
      });
    });
    beforeEach('2.3. BeforeEach', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('2.3. BeforeEach run');
          resolve();
        }, 200);
      });
    });
    afterEach('2.1. AfterEach', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('2.1. AfterEach run');
          resolve();
        }, 200);
      });
    });
    afterEach('2.2. AfterEach', function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          fw.log('2.2. AfterEach run');
          reject(new Error('ERROR(2.2)'));
        }, 200);
      });
    });
    afterEach('2.3. After', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('2.3. AfterEach run');
          resolve();
        }, 200);
      });
    });
    it('2.1. Test', function() {
      fw.log('2.1. Test run');
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('3.1. Test run');
          resolve();
        }, 200);
      });
    });
  });
  describe('4. Suite', function() {
    it('4.1. Test', function() {
      fw.log('4.1. Test run');
    });
    afterEach('4.1. AfterEach', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('4.1. AfterEach run');
          resolve();
        }, 200);
      });
    });
    afterEach('4.2. AfterEach', function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          fw.log('4.2. AfterEach run');
          reject(new Error('ERROR(4.2)'));
        }, 200);
      });
    });
    afterEach('4.3. AfterEach', function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          fw.log('4.3. AfterEach run');
          resolve();
        }, 200);
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Before run',
        '1.2. Before run',
        '1.2. Before error: Error: ERROR(1.2) for 1. Suite',
        '1.1. After run',
        '1.2. After run',
        '1.2. After error: Error: ERROR(1.2) for 1. Suite',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. BeforeEach run',
        '2.2. BeforeEach run',
        '2.2. BeforeEach error: Error: ERROR(2.2) for 2.1. Test',
        '2.1. AfterEach run',
        '2.2. AfterEach run',
        '2.2. AfterEach error: Error: ERROR(2.2) for 2.1. Test',
        '2.1. Test end',
        '2. Suite end',
        '3. Suite start',
        '3.1. Test start',
        '3.1. Test run',
        '3.1. Test succeed',
        '3.1. Test end',
        '3. Suite end',
        '4. Suite start',
        '4.1. Test start',
        '4.1. Test run',
        '4.1. Test succeed',
        '4.1. AfterEach run',
        '4.2. AfterEach run',
        '4.2. AfterEach error: Error: ERROR(4.2) for 4.1. Test',
        '4.1. Test end',
        '4. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error when does callback twice in hook', function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. Suite', function() {
    before('1.1. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Before run');
        cb();
      }, 200);
    });
    before('1.2. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.2. Before run');
        cb();
        cb();
      }, 200);
    });
    before('1.3. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.3. Before run');
        cb();
      }, 200);
    });
    after('1.1. After', function(cb) {
      setTimeout(function() {
        fw.log('1.1. After run');
        cb();
      }, 200);
    });
    after('1.2. After', function(cb) {
      setTimeout(function() {
        fw.log('1.2. After run');
        cb();
        cb();
      }, 200);
    });
    after('1.3. After', function(cb) {
      setTimeout(function() {
        fw.log('1.3. After run');
        cb();
      }, 200);
    });
    it('1.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('2. Suite', function() {
    beforeEach('2.1. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.1. BeforeEach run');
        cb();
      }, 200);
    });
    beforeEach('2.2. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.2. BeforeEach run');
        cb();
        cb();
      }, 200);
    });
    beforeEach('2.3. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.3. BeforeEach run');
        cb();
      }, 200);
    });
    afterEach('2.1. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.1. AfterEach run');
        cb();
      }, 200);
    });
    afterEach('2.2. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.2. AfterEach run');
        cb();
        cb();
      }, 200);
    });
    afterEach('2.3. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.3. AfterEach run');
        cb();
      }, 200);
    });
    it('2.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('2.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('3.1. Test run');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Before run',
        '1.2. Before run',
        '1.2. Before error: Error: ' +
          'done() called multiple times for 1. Suite',
        '1.3. Before run',
        '1.1. Test start',
        '1.1. Test run',
        '1.1. Test succeed',
        '1.1. Test end',
        '1.1. After run',
        '1.2. After run',
        '1.2. After error: Error: ' +
          'done() called multiple times for 1. Suite',
        '1.3. After run',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. BeforeEach run',
        '2.2. BeforeEach run',
        '2.2. BeforeEach error: Error: ' +
          'done() called multiple times for 2.1. Test',
        '2.3. BeforeEach run',
        '2.1. Test run',
        '2.1. Test succeed',
        '2.1. AfterEach run',
        '2.2. AfterEach run',
        '2.2. AfterEach error: Error: ' +
          'done() called multiple times for 2.1. Test',
        '2.3. AfterEach run',
        '2.1. Test end',
        '2. Suite end',
        '3. Suite start',
        '3.1. Test start',
        '3.1. Test run',
        '3.1. Test succeed',
        '3.1. Test end',
        '3. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error when uses both callback and promise in hook',
function(done) {
  var fw = createTester();
  var it = fw.test;
  var describe = fw.suite;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. Suite', function() {
    before('1.1. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Before run');
        cb();
      }, 200);
    });
    before('1.2. Before', function(cb) {
      fw.log('1.2. Before run');
      return Promise.resolve(cb);
    });
    before('1.3. Before', function(cb) {
      setTimeout(function() {
        fw.log('1.3. Before run');
        cb();
      }, 200);
    });
    after('1.1. After', function(cb) {
      setTimeout(function() {
        fw.log('1.1. After run');
        cb();
      }, 200);
    });
    after('1.2. After', function(cb) {
      fw.log('1.2. After run');
      return Promise.resolve(cb);
    });
    after('1.3. After', function(cb) {
      setTimeout(function() {
        fw.log('1.3. After run');
        cb();
      }, 200);
    });
    it('1.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('1.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('2. Suite', function() {
    beforeEach('2.1. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.1. BeforeEach run');
        cb();
      }, 200);
    });
    beforeEach('2.2. BeforeEach', function(cb) {
      fw.log('2.2. BeforeEach run');
      return Promise.resolve(cb);
    });
    beforeEach('2.3. BeforeEach', function(cb) {
      setTimeout(function() {
        fw.log('2.3. BeforeEach run');
        cb();
      }, 200);
    });
    afterEach('2.1. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.1. AfterEach run');
        cb();
      }, 200);
    });
    afterEach('2.2. AfterEach', function(cb) {
      fw.log('2.2. AfterEach run');
      return Promise.resolve(cb);
    });
    afterEach('2.3. AfterEach', function(cb) {
      setTimeout(function() {
        fw.log('2.3. AfterEach run');
        cb();
      }, 200);
    });
    it('2.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('2.1. Test run');
        cb();
      }, 200);
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function(cb) {
      setTimeout(function() {
        fw.log('3.1. Test run');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. Suite start',
        '1.1. Before run',
        '1.2. Before run',
        '1.2. Before error: Error: Resolution method is overspecified. ' +
          'Specify a callback *or* return a Promise; not both. for 1. Suite',
        '1.1. After run',
        '1.2. After run',
        '1.2. After error: Error: Resolution method is overspecified. ' +
          'Specify a callback *or* return a Promise; not both. for 1. Suite',
        '1. Suite end',
        '2. Suite start',
        '2.1. Test start',
        '2.1. BeforeEach run',
        '2.2. BeforeEach run',
        '2.2. BeforeEach error: Error: Resolution method is overspecified. ' +
          'Specify a callback *or* return a Promise; not both. for 2.1. Test',
        '2.1. AfterEach run',
        '2.2. AfterEach run',
        '2.2. AfterEach error: Error: Resolution method is overspecified. ' +
          'Specify a callback *or* return a Promise; not both. for 2.1. Test',
        '2.1. Test end',
        '2. Suite end',
        '3. Suite start',
        '3.1. Test start',
        '3.1. Test run',
        '3.1. Test succeed',
        '3.1. Test end',
        '3. Suite end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in description hook', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. before/after', function() {
    before('1. aaa', function() {
      throw new Error('eee');
    });
    after('1. bbb', function() {
      throw new Error('fff');
    });
    it('1. Test', function() {
      fw.log('1. Test run');
    });
  });
  describe('2. beforeEach/afterEach', function() {
    beforeEach('2. AAA', function() {
      throw new Error('EEE');
    });
    afterEach('2. BBB', function() {
      throw new Error('FFF');
    });
    it('2. Test', function() {
      fw.log('2. Test run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. before/after start',
        '1. aaa error: Error: eee for 1. before/after',
        '1. bbb error: Error: fff for 1. before/after',
        '1. before/after end',
        '2. beforeEach/afterEach start',
        '2. Test start',
        '2. AAA error: Error: EEE for 2. Test',
        '2. BBB error: Error: FFF for 2. Test',
        '2. Test end',
        '2. beforeEach/afterEach end',
        'Support async end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Cause an error in named hook', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  describe('1. before/after', function() {
    before(function aaa() {
      throw new Error('eee');
    });
    after(function bbb() {
      throw new Error('fff');
    });
    it('1. Test', function() {
      fw.log('1. Test run');
    });
  });
  describe('2. beforeEach/afterEach', function() {
    beforeEach(function AAA() {
      throw new Error('EEE');
    });
    afterEach(function BBB() {
      throw new Error('FFF');
    });
    it('2. Test', function() {
      fw.log('2. Test run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support async start',
        '1. before/after start',
        'aaa error: Error: eee for 1. before/after',
        'bbb error: Error: fff for 1. before/after',
        '1. before/after end',
        '2. beforeEach/afterEach start',
        '2. Test start',
        'AAA error: Error: EEE for 2. Test',
        'BBB error: Error: FFF for 2. Test',
        '2. Test end',
        '2. beforeEach/afterEach end',
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
