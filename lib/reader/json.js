'use strict';

const fs = require('fs');

function* read(file) {
  return yield new Promise((fulfill, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(err);
        fulfill(JSON.parse(data));
      }
    });
  });
}

module.exports = {
  read
}
