'use strict';

const fs = require('fs');
const path = require('path');
const git = require('simple-git');
const uuid = require('node-uuid');
const rimraf = require('rimraf');

function useOrInitGitFolder(folder) {
  if (!fs.existsSync(path.resolve(folder, '.git'))) {
    return git(folder)
      .init();
  } else {
    return git(folder);
  }
}

function* clone(params) {
  const remote = params.remote;
  const folder = params.folder;
  const name = params.name;
  const branch = params.branch;

  const workingDir = path.resolve(folder, name);
  console.log('Pulling into working directory:', workingDir);
  if (params.overwrite) {
    if (fs.existsSync(workingDir)) {
      yield new Promise((fulfill, rject) => {
        rimraf(workingDir, (err) => {
          if (err) reject(err);
          else fulfill();
        });
      });
    }

    yield new Promise((fulfill, reject) => {
      fs.mkdir(workingDir, (err) => {
        if (err) reject(err);
        else fulfill();
      })
    });
  }

  const remoteName = 'origin';
  yield useOrInitGitFolder(workingDir)
    .addRemote(remoteName, remote)
    .pull(remoteName, branch);

  return {
    path: workingDir
  };
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
  clone,
  pull,
  push
};
