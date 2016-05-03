'use strict';

const _ = require('lodash');
const co = require('co');
const bluebird = require('bluebird');
const chalk = require('chalk');
const asciify = bluebird.promisify(require('asciify'));
const yargs = require('yargs');
const places = require('./places');
const readMarks = require('./read-marks');
const writeMarks = require('./write-marks');
const firegitter = require('./firegitter');

function* main(args) {

  if (_.includes(args, '-h')) {
    console.log(yield asciify(
      'firegit', { font: 'larry3d' }));
  }

  const argv = yargs
    .usage([
      'Usage: $0',
      '-r <repo>',
      '[options]'
    ].join(' '))

    .count('verbose')
    .alias('v', 'verbose')
    .describe('v')

    .demand('r')
    .alias('r', 'git-repository')
    .describe('r', 'Repository to upload to')
    .nargs('r', 1)

    .describe('firefox-home', 'Home directory for Firefox')
    .default('firefox-home', `${process.env.HOME}/.mozilla/firefox`)

    .describe('profile-ini', 'Name of profiles.ini file')
    .default('profile-ini', 'profiles.ini')

    .describe('profile', 'Name of profile (ie. Profile0, Profile1, etc)')
    .default('profile', 'Profile0')

    .epilog('More details: https://github.com/hekar/firegit')

    .argv;

    const placesSqlite = yield places.find(
      argv.firefoxHome,
      argv.profileIni,
      argv.profile
    );
    const marks = yield readMarks.read(placesSqlite);
    const written = yield writeMarks.write(argv.profile, marks);

    const pushParams = _.assign({},
      written,
      { remote: argv.gitRepository }
    );
    const pushed = yield firegitter.push(pushParams);

    console.log(chalk.blue(
      'Successfully updated bookmarks for profile', argv.profile));
}

co.wrap(main)(process.argv)
  .catch((err) => {
    console.error('Failure');
    console.error(err.stack);
    process.exit(127);
  });
