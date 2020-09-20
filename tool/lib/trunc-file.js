'use strict';

var fs = require('fs');

function truncFile(filePath) {
  fs.openSync(filePath, 'w+');
}

module.exports = truncFile;
