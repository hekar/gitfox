'use strict';

const co = require('co');
const path = require('path');
const chalk = require('chalk');
const places = require('../../places');
const marks = require('../../marks');
const git = require('../../git');
const reader = require('../../reader');
const merge = require('./merge');

function* copyRemote(argv) {
  const params = {
    overwrite: true,
    remote: argv.repository,
    folder: path.resolve(argv.root),
    name: `${argv.profile}-clone`,
    branch: argv.branch
  };

  const cloned = yield git.clone(params);

  const bookmarksPath = path.resolve(cloned.path, 'README.json');
  const remoteMarks = yield reader.json.read(bookmarksPath);

  const placesSqlite = yield places.find(
    argv.firefoxHome,
    argv.profileIni,
    argv.profile
  );

  const localMarks = yield marks.readTree(placesSqlite);

  const copied = merge.copyRemote(remoteMarks, localMarks).copied;
  const written = yield marks.write(argv.root, argv.profile, copied);

  console.log(written);
}

module.exports = {
  command: 'pull [repository]',
  describe: 'pull from remote git repository',
  builder: {
    type: {
      describe: 'choose your merge strategy',
      default: 'copy-remote',
      choices: ['copy-remote']
    },
    branch: {
      type: 'string',
      describe: 'branch',
      default: 'master'
    }
  },
  handler: co.wrap(function*(argv) {
    try {
      if (argv.type === 'copy-remote') {
        yield copyRemote(argv);
      } else {
        yield copyRemote(argv);
      }

      console.log(chalk.blue(
        'Successfully updated bookmarks for profile', argv.profile));
    } catch (e) {
      console.error('Failed to pull bookmarks', e.stack);
    }
  })
};
