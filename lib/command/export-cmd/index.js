'use strict';

const co = require('co');
const exportToFolder = require('./to-folder');

module.exports = {
  command: 'export [exportFolder]',
  describe: 'copy places.sqlite to exportFolder',
  builder: {
  },
  handler: co.wrap(function*(argv) {
    const dst = argv.exportFolder;

    const cn = {
      firefoxHome: argv.firefoxHome,
      profileIni: argv.profileIni,
      profile: argv.profile
    };

    yield exportToFolder(cn, dst);
  })
};
