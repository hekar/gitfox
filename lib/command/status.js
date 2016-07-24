'use strict';

const co = require('co');
const chalk = require('chalk');
const exec = require('child_process').exec;

module.exports = {
  command: 'status',
  describe: '',
  builder: {
  },
  handler: co.wrap(function*(argv) {

    const options = {
      cwd: ''
    };

    exec('git status', function(err, stdout, stderr) {
      util.puts(stdout);
      util.puts(stderr);
    });
  })
};
