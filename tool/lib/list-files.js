'use strict';

var fs = require('fs');
var path = require('path');
var encoding = 'utf-8';

function listFiles(dirPath, extensions) {
  extensions = Array.isArray(extensions) ? extensions : [extensions];
  return fs.readdirSync(dirPath, encoding)
    .filter(ignoreDots)
    .filter(isExtension)
    .map(resolve);

  function ignoreDots(fileName) {
    return !fileName.startsWith('.');
  }

  function isExtension(fileName) {
    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      if (!ext || fileName.slice(-ext.length) === ext) {
        return true;
      }
    }
  }

  function resolve(fileName) {
    return path.resolve(dirPath, fileName);
  }
}

module.exports = listFiles;
