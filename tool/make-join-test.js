'use strict';

var listFiles = require('./lib/list-files');
var copyFile = require('./lib/copy-file');

var path = require('path');
var unitDir = path.resolve(__dirname, '../test/unit');
var joinDir = path.resolve(__dirname, '../test/join');

listFiles(unitDir, '.test.js').forEach(transformFile);

function transformFile(unitFile) {
  var joinFile = path.resolve(joinDir, path.basename(unitFile));
  var testName = 'join - ' + path.basename(unitFile, '.test.js');
  copyFile(unitFile, joinFile, function(data) {
    return data.replace(
      /(\nvar implement[^\n]*)+/,
      '\nvar Framework = require(\'../..\');'
    ).replace(
      /(\n +implement[^\n]*)+/,
      ''
    ).replace(
      /\n +var fw = {};/,
      '\n  var fw = new Framework();'
    ).replace(
      /\n *test.desc[^\n]*/,
      '\ntest.desc(\'' + testName + '\');'
    );
  });
}
