'use strict';

const co = require('co');
const path = require('path');
const chalk = require('chalk');
const places = require('../../places');
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

  const bookmarksPath = path.resolve(cloned.path, 'bookmarks.json');
  const remoteMarks = yield reader.json.read(bookmarksPath);

  const cn = {
    firefoxHome: argv.firefoxHome,
    profileIni: argv.profileIni,
    profile: argv.profile
  };

  const title = 'gitfox';

  const localMarks = yield places.treeByRoot(cn, title);

  const copied = merge.copyRemote(
    remoteMarks, localMarks).copied;

  if (argv.verbose >= 3) {
    console.log(copied);
    console.log(chalk.blue('Copying bookmarks above'));
  }

  const written = yield places.insert(
    cn,
    remoteMarks,
    copied
  );

  if (argv.verbose >= 3) {
    console.log(written);
    console.log(chalk.blue('Wrote bookmarks above'));
  }
}

module.exports = {
  command: 'pull [repository]',
  describe: '[EXPERIMENTAL] use at own risk. Pull from repository into Firefox',
  builder: {
    strategy: {
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
      if (argv.strategy === 'copy-remote') {
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
