'use strict';

let read = require('./read');
let write = require('./write');

module.exports = {
  read: read.read,
  readTree: read.readTree,
  writeTree: write.writeTree
};
