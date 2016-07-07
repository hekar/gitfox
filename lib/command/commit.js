'use strict';

const _ = require('lodash');
const push = require('./push');

module.exports = {
  command: 'commit',
  describe: 'commit, but do not push',
  builder: push.builder,
  handler: function(argv) {
    const args = _.assign({}, argv, { dryRun: true });
    return push.handler(args);
  }
};
