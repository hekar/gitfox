'use strict';

const _ = require('lodash');
const co = require('co');
const ini = require('ini');
const fs = require('fs');
const path = require('path');

function findProfiles(home, profileIni) {
  const full = path.resolve(
    home, profileIni
  );

  return new Promise((fulfill, reject) => {
    fs.readFile(full, 'utf8', (err, contents) => {
      try {
        const profiles = _.filter(ini.parse(contents), (profile) =>
          profile.Name && profile.Path
        );
        fulfill(profiles);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = {
  command: 'profiles',
  describe: 'Read profile.ini and list available profiles',
  builder: {
    json: {
      describe: 'Output in JSON',
      type: 'boolean',
      default: false
    },
    pretty: {
      describe: 'Indent JSON',
      type: 'boolean',
      default: false
    }
  },
  handler: co.wrap(function*(argv) {
    const profiles = yield findProfiles(
      argv.firefoxHome,
      argv.profileIni
    );

    if (argv.json) {
      if (argv.pretty) {
        console.log(JSON.stringify(profiles, null, 2));
      } else {
        console.log(JSON.stringify(profiles));
      }
    } else {
      _.each(profiles, (profile) =>
        console.log(`${profile.Name}, ${profile.Path}`)
      );
    }
  })
};
