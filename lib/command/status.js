'use strict';

const co = require('co');
const chalk = require('chalk');

module.exports = {
  command: 'status',
  describe: '',
  builder: {
  },
  handler: co.wrap(function*(argv) {
    console.log(chalk.blue(argv));
  })
};
