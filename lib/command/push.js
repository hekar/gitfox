'use strict';

const _ = require('lodash');
const co = require('co');
const chalk = require('chalk');
const places = require('../places');
const marks = require('../marks');
const git = require('../git');

module.exports = {
  command: 'push [repository]',
  describe: 'push to repository',
  builder: {
    force: {
      describe: 'Force push.',
      type: 'boolean',
      default: false
    },
    dryRun: {
      describe: 'Commit, but do not push any changes.',
      type: 'boolean',
      default: false
    }
  },
  handler: co.wrap(function*(argv) {
    try {

      const cn = {
        firefoxHome: argv.firefoxHome,
        profileIni: argv.profileIni,
        profile: argv.profile
      };

      const title = 'gitfox';

      const bookmarks = yield places.findByTitleRecursiveTree(cn, title);

      const written = yield marks.writeTree(
        argv.root, argv.profile, bookmarks);

      const pushParams = _.assign({},
        written, {
          force: argv.force,
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
