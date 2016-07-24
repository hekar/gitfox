'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const writer = require('../writer');

function* createOrGetGitFolder(root, profile) {
  const full = path.resolve(root, profile);
  return new Promise((fulfill, reject) => {
    fs.stat(full, (statsErr) => {

      const checkAccess = () => {
        fs.access(full, fs.R_OK | fs.W_OK, (accessErr) => {
          if (accessErr) {
            reject(accessErr);
          } else {
            fulfill({
              profile,
              repo: full
            });
          }
        });
      };

      if (statsErr) {
        try {
          mkdirp(full, () => {
            checkAccess();
          });
        } catch (e) {
          // HACK: need to finish this before I sleep
          console.error('Failure to create folder', full, e.stack);
        }
      } else {
        checkAccess();
      }
    });
  });
}

const jsonPath = (folder) => path.resolve(folder, 'bookmarks.json');
const mdPath = (folder) => path.resolve(folder, 'README.md');

function* writeTree(root, profile, marks) {
  const written = yield createOrGetGitFolder(root, profile);

  const folder = written.repo;
  console.log('Writing to git path:', folder);
  fs.writeFileSync(jsonPath(folder), writer.json.write(marks));
  fs.writeFileSync(mdPath(folder), writer.markdown.write(marks));

  return written;
}

module.exports = {
  writeTree
};
