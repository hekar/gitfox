'use strict';

const fs = require('fs');
const path = require('path');
const ini = require('ini');

const placesSqlite = 'places.sqlite';

function* find(firefoxHome, profileIni, profile) {

  const full = path.resolve(firefoxHome, profileIni);

  return new Promise((fulfill, reject) => {
    fs.readFile(full, 'utf8', (err, contents) => {
      if (err) {
        reject(err);
      } else {
        const parsed = ini.parse(contents);
        if (!parsed[profile].IsRelative) {
          reject(new Error('Do not support non-relative pathes'));
        } else {
          const profilePath = parsed[profile].Path;
          fulfill(path.resolve(firefoxHome, profilePath, placesSqlite));
        }
      }
    });
  });
}

module.exports = {
  find
}
