'use strict';

var assert = require('assert');
var test = require('../tool/run-test');

var implementEvent = require('../../lib/event');
var implementTree = require('../../lib/tree');
var implementHook = require('../../lib/hook');
var implementAsync = require('../../lib/async');
var implementSkip = require('../../lib/skip');

function createTester() {
  var fw = {};
  implementEvent(fw);
  implementTree(fw);
  implementHook(fw);
  implementAsync(fw);
  implementSkip(fw);

  fw.title = 'Support skip';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(node) {
    fw.log(node.title + ' start (skip:' + node.skip.flag  + ')');
  });
  fw.on('end', function(node) {
    fw.log(node.title + ' end (skip:' + node.skip.flag  + ')');
  });
  fw.on('error', function(node) {
    fw.log(node.title + ' error: ' + node.error);
  });
  fw.on('skip', function(node) {
    fw.log(node.title + ' skipped');
  });
  return fw;
}

test.desc('lib/skip.js');

test.add('Run .skip test', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;

  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it.skip('2. Test', function() {
    fw.log('2. Test run');
  });
  it('3. Test', function() {
    fw.log('3. Test run');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        '1. Test start (skip:false)',
        '1. Test run',
        '1. Test end (skip:false)',
        '2. Test start (skip:true)',
        '2. Test skipped',
        '2. Test end (skip:true)',
        '3. Test start (skip:false)',
        '3. Test run',
        '3. Test end (skip:false)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run .skip suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;
  var describe = fw.suite;
  describe.skip = fw.skipSuite;

  describe('1. Suite', function() {
    describe.skip('1.1. Suite', function() {
    });
    describe('1.2. Suite', function() {
    });
    describe('1.3. Suite', function() {
    });
  });
  describe('2. Suite', function() {
    describe('2.1. Suite', function() {
    });
    describe.skip('2.2. Suite', function() {
    });
    describe('2.3. Suite', function() {
    });
  });
  describe('3. Suite', function() {
    describe('3.1. Suite', function() {
    });
    describe('3.2. Suite', function() {
    });
    describe.skip('3.3. Suite', function() {
    });
  });
  describe.skip('4. Suite', function() {
    describe('4.1. Suite', function() {
    });
    describe('4.2. Suite', function() {
    });
    describe('4.3. Suite', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        '1. Suite start (skip:false)',
        '1.1. Suite start (skip:true)',
        '1.1. Suite end (skip:true)',
        '1.2. Suite start (skip:false)',
        '1.2. Suite end (skip:false)',
        '1.3. Suite start (skip:false)',
        '1.3. Suite end (skip:false)',
        '1. Suite end (skip:false)',
        '2. Suite start (skip:false)',
        '2.1. Suite start (skip:false)',
        '2.1. Suite end (skip:false)',
        '2.2. Suite start (skip:true)',
        '2.2. Suite end (skip:true)',
        '2.3. Suite start (skip:false)',
        '2.3. Suite end (skip:false)',
        '2. Suite end (skip:false)',
        '3. Suite start (skip:false)',
        '3.1. Suite start (skip:false)',
        '3.1. Suite end (skip:false)',
        '3.2. Suite start (skip:false)',
        '3.2. Suite end (skip:false)',
        '3.3. Suite start (skip:true)',
        '3.3. Suite end (skip:true)',
        '3. Suite end (skip:false)',
        '4. Suite start (skip:true)',
        '4.1. Suite start (skip:true)',
        '4.1. Suite end (skip:true)',
        '4.2. Suite start (skip:true)',
        '4.2. Suite end (skip:true)',
        '4.3. Suite start (skip:true)',
        '4.3. Suite end (skip:true)',
        '4. Suite end (skip:true)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run nested .skip suite/test', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;
  var describe = fw.suite;
  describe.skip = fw.skipSuite;

  describe('1. Suite', function() {
    describe.skip('1.1. Suite', function() {
      describe('1.1.1. Suite', function() {
        it('1.1.1.1. Test', function() {
          fw.log('1.1.1.1. Test run');
        });
      });
      describe('1.1.2. Suite', function() {
        it.skip('1.1.2.1. Test', function() {
          fw.log('1.1.2.1. Test run');
        });
      });
    });
    describe('1.2. Suite', function() {
      describe('1.2.1. Suite', function() {
        it('1.2.1.1. Test', function() {
          fw.log('1.2.1.1. Test run');
        });
      });
      describe('1.2.2. Suite', function() {
        it.skip('1.2.2.1. Test', function() {
          fw.log('1.2.2.1. Test run');
        });
      });
    });
    describe.skip('1.3. Suite', function() {
      describe.skip('1.3.1. Suite', function() {
        it('1.3.1.1. Test', function() {
          fw.log('1.3.1.1. Test run');
        });
      });
      describe('1.3.2. Suite', function() {
        it.skip('1.3.2.1. Test', function() {
          fw.log('1.3.2.1. Test run');
        });
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        '1. Suite start (skip:false)',
        '1.1. Suite start (skip:true)',
        '1.1.1. Suite start (skip:true)',
        '1.1.1.1. Test start (skip:true)',
        '1.1.1.1. Test skipped',
        '1.1.1.1. Test end (skip:true)',
        '1.1.1. Suite end (skip:true)',
        '1.1.2. Suite start (skip:true)',
        '1.1.2.1. Test start (skip:true)',
        '1.1.2.1. Test skipped',
        '1.1.2.1. Test end (skip:true)',
        '1.1.2. Suite end (skip:true)',
        '1.1. Suite end (skip:true)',
        '1.2. Suite start (skip:false)',
        '1.2.1. Suite start (skip:false)',
        '1.2.1.1. Test start (skip:false)',
        '1.2.1.1. Test run',
        '1.2.1.1. Test end (skip:false)',
        '1.2.1. Suite end (skip:false)',
        '1.2.2. Suite start (skip:false)',
        '1.2.2.1. Test start (skip:true)',
        '1.2.2.1. Test skipped',
        '1.2.2.1. Test end (skip:true)',
        '1.2.2. Suite end (skip:false)',
        '1.2. Suite end (skip:false)',
        '1.3. Suite start (skip:true)',
        '1.3.1. Suite start (skip:true)',
        '1.3.1.1. Test start (skip:true)',
        '1.3.1.1. Test skipped',
        '1.3.1.1. Test end (skip:true)',
        '1.3.1. Suite end (skip:true)',
        '1.3.2. Suite start (skip:true)',
        '1.3.2.1. Test start (skip:true)',
        '1.3.2.1. Test skipped',
        '1.3.2.1. Test end (skip:true)',
        '1.3.2. Suite end (skip:true)',
        '1.3. Suite end (skip:true)',
        '1. Suite end (skip:false)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run .skip test (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 100);
  });
  it.skip('2. Test', function(cb) {
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
        'Support skip start (skip:false)',
        '1. Test start (skip:false)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test end (skip:false)',
        '2. Test start (skip:true)',
        '2. Test skipped',
        '2. Test end (skip:true)',
        '3. Test start (skip:false)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test end (skip:false)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run nested .skip suite/test (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;
  var describe = fw.suite;
  describe.skip = fw.skipSuite;

  describe('1. Suite', function() {
    describe.skip('1.1. Suite', function() {
      describe('1.1.1. Suite', function() {
        it('1.1.1.1. Test', function(cb) {
          fw.log('1.1.1.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.1.1.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
      describe('1.1.2. Suite', function() {
        it.skip('1.1.2.1. Test', function(cb) {
          fw.log('1.1.2.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.1.2.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
    });
    describe('1.2. Suite', function() {
      describe('1.2.1. Suite', function() {
        it('1.2.1.1. Test', function(cb) {
          fw.log('1.2.1.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.2.1.1. Test run - (2)');
            cb();
          }, 200);
        });
      });
      describe('1.2.2. Suite', function() {
        it.skip('1.2.2.1. Test', function(cb) {
          fw.log('1.2.2.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.2.2.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
    });
    describe.skip('1.3. Suite', function() {
      describe.skip('1.3.1. Suite', function() {
        it('1.3.1.1. Test', function(cb) {
          fw.log('1.3.1.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.3.1.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
      describe('1.3.2. Suite', function() {
        it.skip('1.3.2.1. Test', function(cb) {
          fw.log('1.3.2.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.3.2.1. Test run - (2)');
            cb();
          });
        });
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        '1. Suite start (skip:false)',
        '1.1. Suite start (skip:true)',
        '1.1.1. Suite start (skip:true)',
        '1.1.1.1. Test start (skip:true)',
        '1.1.1.1. Test skipped',
        '1.1.1.1. Test end (skip:true)',
        '1.1.1. Suite end (skip:true)',
        '1.1.2. Suite start (skip:true)',
        '1.1.2.1. Test start (skip:true)',
        '1.1.2.1. Test skipped',
        '1.1.2.1. Test end (skip:true)',
        '1.1.2. Suite end (skip:true)',
        '1.1. Suite end (skip:true)',
        '1.2. Suite start (skip:false)',
        '1.2.1. Suite start (skip:false)',
        '1.2.1.1. Test start (skip:false)',
        '1.2.1.1. Test run - (1)',
        '1.2.1.1. Test run - (2)',
        '1.2.1.1. Test end (skip:false)',
        '1.2.1. Suite end (skip:false)',
        '1.2.2. Suite start (skip:false)',
        '1.2.2.1. Test start (skip:true)',
        '1.2.2.1. Test skipped',
        '1.2.2.1. Test end (skip:true)',
        '1.2.2. Suite end (skip:false)',
        '1.2. Suite end (skip:false)',
        '1.3. Suite start (skip:true)',
        '1.3.1. Suite start (skip:true)',
        '1.3.1.1. Test start (skip:true)',
        '1.3.1.1. Test skipped',
        '1.3.1.1. Test end (skip:true)',
        '1.3.1. Suite end (skip:true)',
        '1.3.2. Suite start (skip:true)',
        '1.3.2.1. Test start (skip:true)',
        '1.3.2.1. Test skipped',
        '1.3.2.1. Test end (skip:true)',
        '1.3.2. Suite end (skip:true)',
        '1.3. Suite end (skip:true)',
        '1. Suite end (skip:false)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run this.skip test (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;

  it('1. Test', function(cb) {
    fw.log('1. Test run - (1)');
    setTimeout(function() {
      fw.log('1. Test run - (2)');
      cb();
    }, 100);
  });
  it('2. Test', function(cb) {
    fw.log('2. Test run - (1)');
    this.skip();
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
        'Support skip start (skip:false)',
        '1. Test start (skip:false)',
        '1. Test run - (1)',
        '1. Test run - (2)',
        '1. Test end (skip:false)',
        '2. Test start (skip:false)',
        '2. Test run - (1)',
        '2. Test skipped',
        '2. Test end (skip:true)',
        '3. Test start (skip:false)',
        '3. Test run - (1)',
        '3. Test run - (2)',
        '3. Test end (skip:false)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run this.skip suite', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;
  var describe = fw.suite;
  describe.skip = fw.skipSuite;

  describe('1. Suite', function() {
    describe('1.1. Suite', function() {
      this.skip();
      it('1.1.1. Test', function() {
        fw.log('1.1.1. Test run');
      });
    });
    describe('1.2. Suite', function() {
    });
    describe('1.3. Suite', function() {
    });
  });
  describe('2. Suite', function() {
    describe('2.1. Suite', function() {
    });
    describe('2.2. Suite', function() {
      this.skip();
      it('2.2.1. Test', function() {
        fw.log('2.2.1. Test run');
      });
    });
    describe('2.3. Suite', function() {
    });
  });
  describe('3. Suite', function() {
    describe('3.1. Suite', function() {
    });
    describe('3.2. Suite', function() {
    });
    describe('3.3. Suite', function() {
      this.skip();
      it('3.3.1. Test', function() {
        fw.log('3.3.1. Test run');
      });
    });
  });
  describe('4. Suite', function() {
    this.skip();
    describe('4.1. Suite', function() {
    });
    describe('4.2. Suite', function() {
    });
    describe('4.3. Suite', function() {
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        '1. Suite start (skip:false)',
        '1.1. Suite start (skip:true)',
        '1.1.1. Test start (skip:true)',
        '1.1.1. Test skipped',
        '1.1.1. Test end (skip:true)',
        '1.1. Suite end (skip:true)',
        '1.2. Suite start (skip:false)',
        '1.2. Suite end (skip:false)',
        '1.3. Suite start (skip:false)',
        '1.3. Suite end (skip:false)',
        '1. Suite end (skip:false)',
        '2. Suite start (skip:false)',
        '2.1. Suite start (skip:false)',
        '2.1. Suite end (skip:false)',
        '2.2. Suite start (skip:true)',
        '2.2.1. Test start (skip:true)',
        '2.2.1. Test skipped',
        '2.2.1. Test end (skip:true)',
        '2.2. Suite end (skip:true)',
        '2.3. Suite start (skip:false)',
        '2.3. Suite end (skip:false)',
        '2. Suite end (skip:false)',
        '3. Suite start (skip:false)',
        '3.1. Suite start (skip:false)',
        '3.1. Suite end (skip:false)',
        '3.2. Suite start (skip:false)',
        '3.2. Suite end (skip:false)',
        '3.3. Suite start (skip:true)',
        '3.3.1. Test start (skip:true)',
        '3.3.1. Test skipped',
        '3.3.1. Test end (skip:true)',
        '3.3. Suite end (skip:true)',
        '3. Suite end (skip:false)',
        '4. Suite start (skip:true)',
        '4.1. Suite start (skip:true)',
        '4.1. Suite end (skip:true)',
        '4.2. Suite start (skip:true)',
        '4.2. Suite end (skip:true)',
        '4.3. Suite start (skip:true)',
        '4.3. Suite end (skip:true)',
        '4. Suite end (skip:true)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('Run nested this.skip suite/test (async)', function(done) {
  var fw = createTester();
  var it = fw.test;
  it.skip = fw.skipTest;
  var describe = fw.suite;
  describe.skip = fw.skipSuite;

  describe('1. Suite', function() {
    describe('1.1. Suite', function() {
      this.skip();
      describe('1.1.1. Suite', function() {
        it('1.1.1.1. Test', function(cb) {
          fw.log('1.1.1.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.1.1.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
      describe('1.1.2. Suite', function() {
        it('1.1.2.1. Test', function(cb) {
          this.skip();
          fw.log('1.1.2.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.1.2.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
    });
    describe('1.2. Suite', function() {
      describe('1.2.1. Suite', function() {
        it('1.2.1.1. Test', function(cb) {
          fw.log('1.2.1.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.2.1.1. Test run - (2)');
            cb();
          }, 200);
        });
      });
      describe('1.2.2. Suite', function() {
        it('1.2.2.1. Test', function(cb) {
          this.skip();
          fw.log('1.2.2.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.2.2.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
    });
    describe('1.3. Suite', function() {
      this.skip();
      describe('1.3.1. Suite', function() {
        this.skip();
        it('1.3.1.1. Test', function(cb) {
          fw.log('1.3.1.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.3.1.1. Test run - (2)');
            cb();
          }, 100);
        });
      });
      describe('1.3.2. Suite', function() {
        it('1.3.2.1. Test', function(cb) {
          this.skip();
          fw.log('1.3.2.1. Test run - (1)');
          setTimeout(function() {
            fw.log('1.3.2.1. Test run - (2)');
            cb();
          });
        });
      });
    });
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        '1. Suite start (skip:false)',
        '1.1. Suite start (skip:true)',
        '1.1.1. Suite start (skip:true)',
        '1.1.1.1. Test start (skip:true)',
        '1.1.1.1. Test skipped',
        '1.1.1.1. Test end (skip:true)',
        '1.1.1. Suite end (skip:true)',
        '1.1.2. Suite start (skip:true)',
        '1.1.2.1. Test start (skip:true)',
        '1.1.2.1. Test skipped',
        '1.1.2.1. Test end (skip:true)',
        '1.1.2. Suite end (skip:true)',
        '1.1. Suite end (skip:true)',
        '1.2. Suite start (skip:false)',
        '1.2.1. Suite start (skip:false)',
        '1.2.1.1. Test start (skip:false)',
        '1.2.1.1. Test run - (1)',
        '1.2.1.1. Test run - (2)',
        '1.2.1.1. Test end (skip:false)',
        '1.2.1. Suite end (skip:false)',
        '1.2.2. Suite start (skip:false)',
        '1.2.2.1. Test start (skip:false)',
        '1.2.2.1. Test skipped',
        '1.2.2.1. Test end (skip:true)',
        '1.2.2. Suite end (skip:false)',
        '1.2. Suite end (skip:false)',
        '1.3. Suite start (skip:true)',
        '1.3.1. Suite start (skip:true)',
        '1.3.1.1. Test start (skip:true)',
        '1.3.1.1. Test skipped',
        '1.3.1.1. Test end (skip:true)',
        '1.3.1. Suite end (skip:true)',
        '1.3.2. Suite start (skip:true)',
        '1.3.2.1. Test start (skip:true)',
        '1.3.2.1. Test skipped',
        '1.3.2.1. Test end (skip:true)',
        '1.3.2. Suite end (skip:true)',
        '1.3. Suite end (skip:true)',
        '1. Suite end (skip:false)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('No/illegal callback of test', function(done) {
  var fw = createTester();
  var it = fw.test;

  it('No callback');
  it('Illegal callback', []);

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support skip start (skip:false)',
        'No callback start (skip:true)',
        'No callback skipped',
        'No callback end (skip:true)',
        'Illegal callback start (skip:true)',
        'Illegal callback skipped',
        'Illegal callback end (skip:true)',
        'Support skip end (skip:false)',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('No/illegal callback of suite', function(done) {
  var fw = createTester();
  var describe = fw.suite;

  try {
    describe('No callback');
  } catch (e) {
    assert.equal(e.message, 'Suite "No callback" was defined ' +
      'but no callback was supplied. ' +
      'Supply a callback or explicitly skip the suite.');
  }

  try {
    describe('Illegal callback', []);
  } catch (e) {
    assert.equal(e.message, 'Suite "Illegal callback" was defined ' +
      'but no callback was supplied. ' +
      'Supply a callback or explicitly skip the suite.');
  }

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support skip start (skip:false)',
      'Support skip end (skip:false)',
    ]);
    done();
  });
});

test.run();
