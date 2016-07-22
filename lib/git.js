'use strict';

const fs = require('fs');
const path = require('path');
const git = require('simple-git');
const uuid = require('node-uuid');

function useOrInitGitFolder(folder) {
  if (!fs.existsSync(path.resolve(folder, '.git'))) {
    return git(folder)
      .init();
  } else {
    return git(folder);
  }
}

/**
 * pull - Pull changes from git
 *
 * @param params {object}
 * {
 *   repo (string): "<folder>",
 *   remote (string): "<remote-url>"
 * }
 * @returns {object}
 * idk
 */
function* pull(params) {
  const folder = params.repo;
  const remote = params.remote;

  const remoteName = '';
  return yield useOrInitGitFolder(folder)
    .add('./*')
    .addRemote(remoteName, remote)
    .pull(remoteName, 'master');
}

function* push(written) {
  const folder = written.repo;
  const remote = written.remote;
  const dryRun = written.dryRun;

  const remoteName = uuid.v4(); // HACK: Figure this out...
  const state = useOrInitGitFolder(folder)
    .add('./*')
    .addRemote(remoteName, remote)
    .commit('automated gitfox update');

  if (!dryRun) {
    if (written.force) {
      return yield state.push(['-f', remoteName, 'master']);
    } else {
      return yield state.push(remoteName, 'master');
    }
  } else {
    return state;
  }
}

module.exports = {
  push,
  pull
};
