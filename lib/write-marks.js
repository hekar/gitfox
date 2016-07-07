'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const root = '.gitfox';

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

function toMarkdown(marks) {
  const start = ['# Gitfox Bookmarks'];
  return _.reduce(marks, (acc, mark) => {
    acc.push(
`
 * [${mark.title}](${mark.url})
`
    );
    return acc;
  }, start).join('\n');
}

function* write(profile, marks) {
  const written = yield createOrGetGitFolder(profile);

  const folder = written.repo;
  const json = path.resolve(folder, 'README.json');
  const markdown = path.resolve(folder, 'README.md');

  fs.writeFileSync(json, JSON.stringify(marks, null, 2));
  fs.writeFileSync(markdown, toMarkdown(marks));

  return written;
}

module.exports = {
  write
};
