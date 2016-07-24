'use strict';

const co = require('co');
const util = require('util');
const exec = require('child_process').exec;

module.exports = {
  command: 'status',
  describe: '',
  builder: {
  },
  handler: co.wrap(function*() {

    const options = {
      cwd: ''
    };

    exec('git status', options, function(err, stdout, stderr) {
      util.puts(stdout);
      util.puts(stderr);
    });
  })
};
