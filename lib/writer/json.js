'use strict';

const fs = require('fs');

function* read(file) {
  return yield new Promise((fulfill, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        fulfill(JSON.parse(data));
      }
    });
  });
}

module.exports = {
  read,
  write: (marks) =>
    JSON.stringify(marks, null, 2) + '\n'
};
