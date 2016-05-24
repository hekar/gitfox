'use strict';

const _ = require('lodash');
const co = require('co');
const bluebird = require('bluebird');
const asciify = bluebird.promisify(require('asciify'));
const yargs = require('yargs');
const push = require('./command/push');
const pull = require('./command/pull');
const status = require('./command/status');
const listProfiles = require('./command/list-profiles');

function* main(args) {

  if (_.includes(args, '-h')) {
    console.log(yield asciify(
      'firegit', { font: 'larry3d' }));
  }

  yargs
    .usage([
      'Usage: $0',
      '-r <repo>',
      '[options]'
    ].join(' '))

    .count('verbose')
    .alias('v', 'verbose')
    .describe('v')
    .global('v')

    .command(push)
    .command(pull)
    .command(listProfiles)
    .command(status)

    .describe('firefox-home', 'Home directory for Firefox')
    .default('firefox-home', `${process.env.HOME}/.mozilla/firefox`)
    .global('firefox-home')

    .describe('profile-ini', 'Name of profiles.ini file')
    .default('profile-ini', 'profiles.ini')
    .global('profile-ini')

    .describe('profile', 'Name of profile (ie. Profile0, Profile1, etc)')
    .default('profile', 'Profile0')
    .global('profile')

    .epilog('More details: https://github.com/hekar/firegit')

    .parse(args);
}

co.wrap(main)(process.argv)
  .catch((err) => {
    console.error('Failure');
    console.error(err.stack);
    process.exit(127);
  });
