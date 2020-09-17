'use strict';

var assert = require('assert');
var test = require('../tool/runner');

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

test.desc('hook');

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
    try {
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
    } catch (e) {
      console.log(e);
      done(e);
    }
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

test.add('description hooks', function(done) {
  var fw = createTester();
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before('0.1. before', function() {
    fw.log('0.1. before run');
  });
  before('0.2. before', function() {
    fw.log('0.2. before run');
  });
  after('0.1. after', function() {
    fw.log('0.1. after run');
  });
  after('0.2. after', function() {
    fw.log('0.2. after run');
  });
  beforeEach('0.1. beforeEach', function() {
    fw.log('0.1. beforeEach run');
  });
  beforeEach('0.2. beforeEach', function() {
    fw.log('0.2. beforeEach run');
  });
  afterEach('0.1. afterEach', function() {
    fw.log('0.1. afterEach run');
  });
  afterEach('0.2. afterEach', function() {
    fw.log('0.2. afterEach run');
  });
  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it('2. Test', function() {
    fw.log('2. Test run');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support hooks start',
        '0.1. before run',
        '0.2. before run',
        '1. Test start',
        '0.1. beforeEach run',
        '0.2. beforeEach run',
        '1. Test run',
        '0.1. afterEach run',
        '0.2. afterEach run',
        '1. Test end',
        '2. Test start',
        '0.1. beforeEach run',
        '0.2. beforeEach run',
        '2. Test run',
        '0.1. afterEach run',
        '0.2. afterEach run',
        '2. Test end',
        '0.1. after run',
        '0.2. after run',
        'Support hooks end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('named hooks', function(done) {
  var fw = createTester();
  var it = fw.test;
  var before = fw.before;
  var after = fw.after;
  var beforeEach = fw.beforeEach;
  var afterEach = fw.afterEach;

  before(function before1() {
    fw.log('0.1. before run');
  });
  before(function before2() {
    fw.log('0.2. before run');
  });
  after(function after1() {
    fw.log('0.1. after run');
  });
  after(function after2() {
    fw.log('0.2. after run');
  });
  beforeEach(function beforeEach1() {
    fw.log('0.1. beforeEach run');
  });
  beforeEach(function beforeEach2() {
    fw.log('0.2. beforeEach run');
  });
  afterEach(function afterEach1() {
    fw.log('0.1. afterEach run');
  });
  afterEach(function afterEach2() {
    fw.log('0.2. afterEach run');
  });
  it('1. Test', function() {
    fw.log('1. Test run');
  });
  it('2. Test', function() {
    fw.log('2. Test run');
  });

  fw.run(function() {
    try {
      assert.deepEqual(fw._logs, [
        'Support hooks start',
        '0.1. before run',
        '0.2. before run',
        '1. Test start',
        '0.1. beforeEach run',
        '0.2. beforeEach run',
        '1. Test run',
        '0.1. afterEach run',
        '0.2. afterEach run',
        '1. Test end',
        '2. Test start',
        '0.1. beforeEach run',
        '0.2. beforeEach run',
        '2. Test run',
        '0.1. afterEach run',
        '0.2. afterEach run',
        '2. Test end',
        '0.1. after run',
        '0.2. after run',
        'Support hooks end',
      ]);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});

test.add('No/illegal callback of hook', function(done) {
  var fw = createTester();
  var before = fw.before;

  before('No callback');
  before([]);
  before('Illegal callback', []);

  fw.run(function() {
    assert.deepEqual(fw._logs, [
      'Support hooks start',
      'Support hooks end',
    ]);
    done();
  });
});

test.run();
