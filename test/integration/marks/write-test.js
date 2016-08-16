'use strict';

/*global describe,it,beforeEach,afterEach*/
const src = '../../../lib';
const fs = require('fs-extra');
const co = require('co');
const rewire = require('rewire');
const marksWrite = rewire(`${src}/marks/write.js`);
const chai = require('chai');
const tmp = require('tmp');
const path = require('path');

describe('marks/write', () => {
  describe('#writeTree(...)', () => {
    let gitFolderPath;
    beforeEach(co.wrap(function*() {
      gitFolderPath = yield new Promise((fulfill, reject) => {
        tmp.dir((err, tmpPath) => {
          if (err) {
            reject(err);
          } else {
            fulfill(tmpPath);
          }
        });
      });

      marksWrite.__set__('createOrGetGitFolder', function*() {
        return { repo: gitFolderPath };
      });
    }));

    afterEach(() => {
      if (gitFolderPath) {
        fs.removeSync(gitFolderPath);
      }
    });

    it('should create bookmarks JSON from tree', co.wrap(function*() {
      const gitFolder = (yield marksWrite.writeTree(
        null,
        null,
        require('../resources/bookmarks.json')
      )).repo;

      const actualFile = path.resolve(gitFolder, 'bookmarks.json');
      const actual = fs.readFileSync(
        actualFile, { encoding: 'utf8'});

      const expectedFile = path.resolve(
        __dirname, '../resources/bookmarks.json');
      const expected = fs.readFileSync(
        expectedFile, { encoding: 'utf8'});

      chai.expect(expected)
        .to.deep.equal(actual);
    }));
  });
});
