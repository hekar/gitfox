'use strict';

const fs = require('fs');
const path = require('path');
const git = require('simple-git');
const uuid = require('node-uuid');

function useOrInitGitFolder(folder) {
  if (!fs.existsSync(path.resolve(folder, '.git'))) {
    return git(folder)
      .init()
  } else {
    return git(folder);
  }
}

function* push(written) {
  const folder = written.repo;
  const remote = written.remote;

  const remoteName = uuid.v4(); // HACK: Figure this out...
  debugger;
  return yield useOrInitGitFolder(folder)
    .add('./*')
    .addRemote(remoteName, remote)
    .commit(`Updated on ${new Date()}`)
    .push(remoteName, 'master');
}

module.exports = {
  push
};
