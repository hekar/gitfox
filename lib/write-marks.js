'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const root = '.firegit';

function* createOrGetGitFolder(profile) {
  const home = process.env.HOME;

  const full = path.resolve(home, root, profile);
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
          mkdirp(full, (err) => {
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

function* write(profile, marks) {
  const written = yield createOrGetGitFolder(profile);

  const folder = written.repo;
  const readme = path.resolve(folder, 'README.md');

  fs.writeFileSync(readme, JSON.stringify(marks));

  return written;
}

module.exports = {
  write
};
