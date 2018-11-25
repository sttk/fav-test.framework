(function() {

'use strict';

var Framework = fav.test.framework;
var fw = new Framework(),
    describe = fw.suite,
    it = fw.test,
    before = fw.before,
    after = fw.after,
    beforeEach = fw.beforeEach,
    afterEach = fw.afterEach;
describe.skip = fw.skipSuite;
describe.only = fw.onlySuite;
it.skip = fw.skipTest;
it.only = fw.onlyTest;

var expect = chai.expect;

fw.title = 'Inclusive Tests';

function check_test_environment() {
  return false;
}

describe('Array(1)', function() {
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
    // make assertions.
  } else {
    this.skip();
  }
});

it('should only test in the correct environment (2)', function() {
  if (check_test_environment()) {
    // make assertions.
  } else {
    // do nothing
  }
});

describe('outer', function() {
  before(function() {
    this.skip();
  });

  after(function() {
  });

  describe('inner', function() {
    before(function() {
    });

    after(function() {
    });

    it('Run test in "inner"', function() {
    });
  });

  it('Run test in "outer"', function() {
  });

});

fw.run(report(fw));

}());
