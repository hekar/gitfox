'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const placesSqlite = 'places.sqlite';

function* find(firefoxHome, profileIni, profile) {

  const full = path.resolve(firefoxHome, profileIni);

  function buildProfilePath(profile) { //eslint-disable-line no-shadow
    const profilePath = profile.Path;
    return path.resolve(firefoxHome, profilePath, placesSqlite);
  }

  return new Promise((fulfill, reject) => {
    fs.readFile(full, 'utf8', (err, contents) => {
      if (err) {
        reject(err);
      } else {
        const parsed = ini.parse(contents);
        if (!profile) {
          const profiles = _.map(parsed, (val) => val);
          if (parsed.General.StartWithLastProfile) {
            fulfill(buildProfilePath(_.last(profiles)));
          } else {
            const second = (s) => _.first(_.tail(s));
            fulfill(buildProfilePath(second(profiles)));
          }
        }

        if (parsed[profile].IsRelative !== '1') {
          reject(new Error('Do not support non-relative pathes'));
        } else {
          fulfill(buildProfilePath(parsed[profile]));
        }
      }
    });
  });
}

module.exports = {
  find
};
