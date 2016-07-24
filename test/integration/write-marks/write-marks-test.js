'use strict';

/*global beforeEach,describe,it*/
const src = '../../../lib';
const co = require('co');
const rewire = require('rewire');
const writeMarks = rewire(`${src}/write-marks.js`);
const sinon = require('sinon');
const chai = require('chai');
const tmp = require('tmp')

writeMarks.__set__('createOrGetGitFolder', () => {
  return new Promise((fulfill, reject) => {
    tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
      if (err) reject(err);
      else fulfill({ repo: path }, cleanupCallback);
    });
  })
});

describe('write-marks', () => {
  describe('#writeTree(...)', () => {
    it.only('should write tree', co.wrap(function*(){
      const actual = yield writeMarks.toMarkdown(require('../read-marks/marks-tree.json'));

      const expected = require('write-marks.md');

      chai.expect(expected)
        .to.deep.equal(actual);
    }));
  });
});
