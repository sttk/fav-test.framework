'use strict';

var assert = require('assert');
var test = require('../tool/test');

var Framework = require('../..');

function createTester() {
  var fw = new Framework();

  fw.title = 'Support hooks';
  fw._logs = [];
  fw.log = function(s) {
    fw._logs.push(s);
  };

  fw.on('start', function(node) {
    fw._logs.push(node.title + ' start');
  });
  fw.on('end', function(node) {
    fw._logs.push(node.title + ' end');
  });

  return fw;
}

test.desc('join - hook');

test.add('Use hooks: before & after (1)', function(done) {
  var fw = createTester();
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;

  before(function() {
    fw.log('0. Before run');
  });
  it('1. Test', function() {
    fw.log('1. Test run');
  });
  after(function() {
    fw.log('0. After run');
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      '0. Before run',
      '1. Test start',
      '1. Test run',
      '1. Test end',
      '0. After run',
      'Support hooks end',
    ]);
    done();
  });
});

test.add('Use hooks: before & after (2)', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;

  before('0. Before', function() {
    fw.log('0. Before run');
  });
  after('0. After', function() {
    fw.log('0. After run');
  });
  describe('1. Suite', function() {
    before('1. Before', function() {
      fw.log('1. Before run');
    });
    after('1. After', function() {
      fw.log('1. After run');
    });
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
    it('1.2. Test', function() {
      fw.log('1.2. Test run');
    });
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      '0. Before run',
      '1. Suite start',
      '1. Before run',
      '1.1. Test start',
      '1.1. Test run',
      '1.1. Test end',
      '1.2. Test start',
      '1.2. Test run',
      '1.2. Test end',
      '1. After run',
      '1. Suite end',
      '0. After run',
      'Support hooks end',
    ]);
    done();
  });
});

test.add('Use hooks: before & after (3)', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;

  before('0. Before', function() {
    fw.log('0. Before run');
  });
  after('0. After', function() {
    fw.log('0. After run');
  });
  describe('1. Suite', function() {
    before('1. Before', function() {
      fw.log('1. Before run');
    });
    after('1. After', function() {
      fw.log('1. After run');
    });
    describe('1.1. Suite', function() {
      it('1.1.1. Test', function() {
        fw.log('1.1.1. Test run');
      });
      it('1.1.2. Test', function() {
        fw.log('1.1.2. Test run');
      });
    });
    describe('1.2. Suite', function() {
      it('1.2.1. Test', function() {
        fw.log('1.2.1. Test run');
      });
      it('1.2.2. Test', function() {
        fw.log('1.2.2. Test run');
      });
    });
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      '0. Before run',
      '1. Suite start',
      '1. Before run',
      '1.1. Suite start',
      '1.1.1. Test start',
      '1.1.1. Test run',
      '1.1.1. Test end',
      '1.1.2. Test start',
      '1.1.2. Test run',
      '1.1.2. Test end',
      '1.1. Suite end',
      '1.2. Suite start',
      '1.2.1. Test start',
      '1.2.1. Test run',
      '1.2.1. Test end',
      '1.2.2. Test start',
      '1.2.2. Test run',
      '1.2.2. Test end',
      '1.2. Suite end',
      '1. After run',
      '1. Suite end',
      '0. After run',
      'Support hooks end',
    ]);
    done();
  });
});

test.add('Use hooks: beforeEach & afterEach (1)', function(done) {
  var fw = createTester();
  var it = fw.test;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  beforeEach(function() {
    fw.log('0. Before-each run');
  });
  it('1. Test', function() {
    fw.log('1. Test run');
  });
  afterEach(function() {
    fw.log('0. After-each run');
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      '1. Test start',
      '0. Before-each run',
      '1. Test run',
      '0. After-each run',
      '1. Test end',
      'Support hooks end',
    ]);
    done();
  });
});

test.add('Use hooks: beforeEach & afterEach (2)', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  beforeEach('0. Before-each', function() {
    fw.log('0. Before-each run');
  });
  afterEach('0. After-each', function() {
    fw.log('0. After-each run');
  });
  describe('1. Suite', function() {
    beforeEach('1. Before-each', function() {
      fw.log('1. Before-each run');
    });
    afterEach('1. After-each', function() {
      fw.log('1. After-each run');
    });
    it('1.1. Test', function() {
      fw.log('1.1. Test run');
    });
    it('1.2. Test', function() {
      fw.log('1.2. Test run');
    });
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      '1. Suite start',
      '1.1. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.1. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.1. Test end',
      '1.2. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.2. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.2. Test end',
      '1. Suite end',
      'Support hooks end',
    ]);
    done();
  });
});

test.add('Use hooks: beforeEach & afterEach (3)', function(done) {
  var fw = createTester();
  var describe = fw.suite;
  var it = fw.test;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  beforeEach('0. Before-each', function() {
    fw.log('0. Before-each run');
  });
  afterEach('0. After-each', function() {
    fw.log('0. After-each run');
  });
  describe('1. Suite', function() {
    beforeEach('1. Before-each', function() {
      fw.log('1. Before-each run');
    });
    afterEach('1. After-each', function() {
      fw.log('1. After-each run');
    });
    describe('1.1. Suite', function() {
      it('1.1.1. Test', function() {
        fw.log('1.1.1. Test run');
      });
      it('1.1.2. Test', function() {
        fw.log('1.1.2. Test run');
      });
    });
    describe('1.2. Suite', function() {
      it('1.2.1. Test', function() {
        fw.log('1.2.1. Test run');
      });
      it('1.2.2. Test', function() {
        fw.log('1.2.2. Test run');
      });
      beforeEach('1.2. Before-each', function() {
        fw.log('1.2. Before-each run');
      });
      afterEach('1.2. After-each', function() {
        fw.log('1.2. After-each run');
      });
    });
    describe('1.3. Suite', function() {
      it('1.3.1. Test', function() {
        fw.log('1.3.1. Test run');
      });
      it('1.3.2. Test', function() {
        fw.log('1.3.2. Test run');
      });
    });
  });

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      '1. Suite start',
      '1.1. Suite start',
      '1.1.1. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.1.1. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.1.1. Test end',
      '1.1.2. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.1.2. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.1.2. Test end',
      '1.1. Suite end',
      '1.2. Suite start',
      '1.2.1. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.2. Before-each run',
      '1.2.1. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.2. After-each run',
      '1.2.1. Test end',
      '1.2.2. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.2. Before-each run',
      '1.2.2. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.2. After-each run',
      '1.2.2. Test end',
      '1.2. Suite end',
      '1.3. Suite start',
      '1.3.1. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.3.1. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.3.1. Test end',
      '1.3.2. Test start',
      '0. Before-each run',
      '1. Before-each run',
      '1.3.2. Test run',
      '0. After-each run',
      '1. After-each run',
      '1.3.2. Test end',
      '1.3. Suite end',
      '1. Suite end',
      'Support hooks end',
    ]);
    done();
  });
});

test.run();
