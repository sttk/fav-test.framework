'use strict';

var assert = require('assert');
var test = require('../tool/run-test');

var Framework = require('../..');

function createTester() {
  var fw = new Framework();

  fw.title = 'Support only';
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

test.desc('join - only');

test.add('Run .only test', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.only = fw.onlyTest;

  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it.only('2. Test', function() {
    fw.log('2. Test run');
  });
  it('3. Test', function() {
    fw.log('3. Test run');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support only start',
        '2. Test start',
        '2. Test run',
        '2. Test end',
        'Support only end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run .only suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.only = fw.onlyTest;
  var describe = fw.suite;
  describe.only = fw.onlySuite;

  describe('1. Suite', function() {
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
  });
  describe.only('2. Suite', function() {
    it('2.1. Test', function() {
      fw.log('2.1. Test run');
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function() {
      fw.log('3.1. Test run');
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support only start',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run',
        '2.1. Test end',
        '2. Suite end',
        'Support only end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run nested .only suite/test', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.only = fw.onlyTest;
  var describe = fw.suite;
  describe.only = fw.onlySuite;

  describe('1. Suite', function() {
    describe('1.1. Suite', function() {
    });
  });
  describe.only('2. Suite', function() {
    describe('2.1. Suite', function() {
      it('2.1.1. Test', function() {
        fw.log('2.1.1. Test run');
      });
    });
    describe('2.2. Suite', function() {
      it('2.2.1. Test', function() {
        fw.log('2.2.1. Test run');
      });
      it.only('2.2.2. Test', function() {
        fw.log('2.2.2. Test run');
      });
      it('2.2.3. Test', function() {
        fw.log('2.2.3. Test run');
      });
      describe('2.2.4. Suite', function() {
        it('2.2.4.1. Test', function() {
          fw.log('2.2.4.1. Test run');
        });
        it.only('2.2.4.2. Test', function() {
          fw.log('2.2.4.2. Test run');
        });
        it('2.2.4.3. Test', function() {
          fw.log('2.2.4.3. Test run');
        });
      });
    });
    describe('2.3. Suite', function() {
      it('2.3.1. Test', function() {
        fw.log('2.3.1. Test run');
      });
    });
  });
  describe('3. Suite', function() {
    describe('3.1. Suite', function() {
    });
  });
  describe.only('4. Suite', function() {
    describe('4.1. Suite', function() {
    });
    describe.only('4.2. Suite', function() {
      it('4.2.1. Test', function() {
        fw.log('4.2.1. Test run');
      });
    });
    describe('4.3. Suite', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support only start',
        '2. Suite start',
        '2.2. Suite start',
        '2.2.2. Test start',
        '2.2.2. Test run',
        '2.2.2. Test end',
        '2.2.4. Suite start',
        '2.2.4.2. Test start',
        '2.2.4.2. Test run',
        '2.2.4.2. Test end',
        '2.2.4. Suite end',
        '2.2. Suite end',
        '2. Suite end',
        '4. Suite start',
        '4.2. Suite start',
        '4.2.1. Test start',
        '4.2.1. Test run',
        '4.2.1. Test end',
        '4.2. Suite end',
        '4. Suite end',
        'Support only end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run .only test (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.only = fw.onlyTest;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 200);
  });
  it.only('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    setTimeout(function() {
      fw.log('2. Test run - (2)');
      cb();
    }, 200);
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
        'Support only start',
        '2. Test start',
        '2. Test run - (1)',
        '2. Test run - (2)',
        '2. Test end',
        'Support only end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run .only suite (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.only = fw.onlyTest;
  var describe = fw.suite;
  describe.only = fw.onlySuite;

  describe('1. Suite', function() {
    it('1.1. Test', function(cb) {
      fw.log('1.1. Test run - (1)');
      setTimeout(function() {
        fw.log('1.1. Test run - (2)');
        cb();
      }, 200);
    });
  });
  describe.only('2. Suite', function() {
    it('2.1. Test', function(cb) {
      fw.log('2.1. Test run - (1)');
      setTimeout(function() {
        fw.log('2.1. Test run - (2)');
        cb();
      }, 200);
    });
  });
  describe('3. Suite', function() {
    it('3.1. Test', function(cb) {
      fw.log('3.1. Test run - (1)');
      setTimeout(function() {
        fw.log('3.1. Test run - (2)');
        cb();
      }, 200);
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support only start',
        '2. Suite start',
        '2.1. Test start',
        '2.1. Test run - (1)',
        '2.1. Test run - (2)',
        '2.1. Test end',
        '2. Suite end',
        'Support only end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run nested .only suite/test (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.only = fw.onlyTest;
  var describe = fw.suite;
  describe.only = fw.onlySuite;

  describe('1. Suite', function() {
    describe('1.1. Suite', function() {
    });
  });
  describe.only('2. Suite', function() {
    describe('2.1. Suite', function() {
      it('2.1.1. Test', function(cb) {
        fw.log('2.1.1. Test run - (1)');
        setTimeout(function() {
          fw.log('2.1.1. Test run - (2)');
          cb();
        }, 100);
      });
    });
    describe('2.2. Suite', function() {
      it('2.2.1. Test', function(cb) {
        fw.log('2.2.1. Test run - (1)');
        setTimeout(function() {
          fw.log('2.2.1. Test run - (2)');
          cb();
        }, 100);
      });
      it.only('2.2.2. Test', function(cb) {
        fw.log('2.2.2. Test run - (1)');
        setTimeout(function() {
          fw.log('2.2.2. Test run - (2)');
          cb();
        }, 100);
      });
      it('2.2.3. Test', function(cb) {
        fw.log('2.2.3. Test run - (1)');
        setTimeout(function() {
          fw.log('2.2.3. Test run - (2)');
          cb();
        }, 100);
      });
      describe('2.2.4. Suite', function() {
        it('2.2.4.1. Test', function(cb) {
          fw.log('2.2.4.1. Test run - (1)');
          setTimeout(function() {
            fw.log('2.2.4.1. Test run - (2)');
            cb();
          }, 100);
        });
        it.only('2.2.4.2. Test', function(cb) {
          fw.log('2.2.4.2. Test run - (1)');
          setTimeout(function() {
            fw.log('2.2.4.2. Test run - (2)');
            cb();
          }, 100);
        });
        it('2.2.4.3. Test', function(cb) {
          fw.log('2.2.4.3. Test run - (1)');
          setTimeout(function() {
            fw.log('2.2.4.3. Test run - (2)');
            cb();
          }, 100);
        });
      });
    });
    describe('2.3. Suite', function() {
      it('2.3.1. Test', function(cb) {
        fw.log('2.3.1. Test run - (1)');
        setTimeout(function() {
          fw.log('2.3.1. Test run - (2)');
          cb();
        }, 100);
      });
    });
  });
  describe('3. Suite', function() {
    describe('3.1. Suite', function() {
    });
  });
  describe.only('4. Suite', function() {
    describe('4.1. Suite', function() {
    });
    describe.only('4.2. Suite', function() {
      it('4.2.1. Test', function(cb) {
        fw.log('4.2.1. Test run - (1)');
        setTimeout(function() {
          fw.log('4.2.1. Test run - (2)');
          cb();
        }, 200);
      });
    });
    describe('4.3. Suite', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support only start',
        '2. Suite start',
        '2.2. Suite start',
        '2.2.2. Test start',
        '2.2.2. Test run - (1)',
        '2.2.2. Test run - (2)',
        '2.2.2. Test end',
        '2.2.4. Suite start',
        '2.2.4.2. Test start',
        '2.2.4.2. Test run - (1)',
        '2.2.4.2. Test run - (2)',
        '2.2.4.2. Test end',
        '2.2.4. Suite end',
        '2.2. Suite end',
        '2. Suite end',
        '4. Suite start',
        '4.2. Suite start',
        '4.2.1. Test start',
        '4.2.1. Test run - (1)',
        '4.2.1. Test run - (2)',
        '4.2.1. Test end',
        '4.2. Suite end',
        '4. Suite end',
        'Support only end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.run();
