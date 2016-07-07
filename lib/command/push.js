'use strict';

const _ = require('lodash');
const co = require('co');
const chalk = require('chalk');
const places = require('../places');
const readMarks = require('../read-marks');
const writeMarks = require('../write-marks');
const git = require('../git');

module.exports = {
  command: 'push [repository]',
  describe: 'push to repository',
  builder: {
    dryRun: {
      describe: 'Commit, but do not push any changes.',
      type: 'boolean',
      default: false
    }
  },
  handler: co.wrap(function*(argv) {
    try {
      const placesSqlite = yield places.find(
        argv.firefoxHome,
        argv.profileIni,
        argv.profile
      );
      const marks = yield readMarks.read(placesSqlite);
      const written = yield writeMarks.write(argv.profile, marks);
      console.log(marks);

      const pushParams = _.assign({},
        written, {
          remote: argv.repository,
          dryRun: argv.dryRun
        }
      );
      yield git.push(pushParams);

      console.log(chalk.blue(
        'Successfully updated bookmarks for profile', argv.profile));
    } catch (e) {
      console.log(e.stack);
    }
  })
};
