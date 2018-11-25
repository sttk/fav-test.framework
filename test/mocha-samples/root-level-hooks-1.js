'use strict';

beforeEach(function() {
  log('before every test in every file');
});

it('test', function() {
  log('test run');
});

describe('suite1', function() {
  it('test1', function() {
    log('test1 run');
  });

  describe('suite2', function() {
    it('test2', function() {
      log('test2 run');
    });
  });
});
