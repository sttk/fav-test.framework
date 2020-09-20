'use strict';

const os = require('os');
const path = require('path');
const exec = require('child_process').exec;

const browsers = {
  darwin: {
    chrome: 'open -a "Google Chrome"',
    firefox: 'open -a firefox',
    vivaldi: 'open -a vivaldi',
    safari: 'open -a safari',
    edge: 'open -a "Microsoft Edge"',
  },

  win32: {
    chrome: 'start chrome',
    firefox: 'start firefox',
    vivaldi: 'start vivaldi',
    edge: 'start msedge',
    ie: 'start iexplore',
  },

  linux: {
    chrome: 'google-chrome',
    firefox: 'firefox',
    vivaldi: 'vivaldi',
  },
};

const openers = browsers[os.platform()];
Object.keys(openers).forEach(ua => {
  const testPath = path.resolve(__dirname, '../test/web/browser-test.html');
  exec([openers[ua], testPath].join(' '), err => {
    if (err) {
      console.error(err);
    }
  });
});
