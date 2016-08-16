#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const co = require('co');
const bluebird = require('bluebird');
const asciify = bluebird.promisify(require('asciify'));
const yargs = require('yargs');
let commit = require('./command/commit');
let push = require('./command/push');
let pull = require('./command/pull');
let profiles = require('./command/profiles');
let exportCmd = require('./command/export-cmd');

function* main(args) {

  if (_.includes(args, '-h')) {
    console.log();
    console.log(yield asciify(
      'gitfox', { font: 'shadow' }));
  }

  return yargs
    .usage([
      'Usage: $0',
      '[command]',
      '[options]'
    ].join(' '))

    .count('verbose')
    .alias('v', 'verbose')
    .describe('v')
    .global('v')

    .command(commit)
    .command(push)
    .command(pull)
    .command(profiles)
    .command(exportCmd)

    .describe('root', 'Configuration folder for gitfox')
    .default('root', `${process.env.HOME}/.gitfox`)
    .global('root')

    .describe('firefox-home', 'Home directory for Firefox')
    .default('firefox-home', `${process.env.HOME}/.mozilla/firefox`)
    .global('firefox-home')

    .describe('profile-ini', 'Name of profiles.ini file')
    .default('profile-ini', 'profiles.ini')
    .global('profile-ini')

    .describe('profile', 'Name of profile (ie. Profile0, Profile1, etc)')
    .default('profile', 'Profile0')
    .global('profile')

    .help('h')
    .alias('h', 'help')
    .epilog('More details: https://github.com/hekar/gitfox')

    .wrap(100)

    .parse(args);
}

if (require.main === module) {
  co.wrap(main)(process.argv)
    .catch((err) => {
      console.error('Failure');
      console.error(err.stack);
      process.exit(127);
    });
} else {
  module.exports = {
    main
  };
}
