'use strict';

/*global beforeEach,describe,it*/
const src = '../../../lib';
const path = require('path');
const fs = require('fs');
const co = require('co');
const rewire = require('rewire');
const markdown = rewire(`${src}/writer/markdown.js`);
const sinon = require('sinon');
const chai = require('chai');
const tmp = require('tmp')

describe('markdown', () => {
  describe('#write(...)', () => {
    it('should write tree', co.wrap(function*(){
      const actual = markdown.write(
        require('../read-marks/marks-tree.json'));

      const file = path.resolve(__dirname, './markdown-result.md');
      const expected = fs.readFileSync(file, { encoding: 'utf8'});

      // expected file has an extra newline at the end
      chai.expect(expected)
        .to.deep.equal(actual + '\n');
    }));
  });
});
