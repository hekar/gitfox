'use strict';

/*global beforeEach,describe,it*/
const src = '../../../lib';
const co = require('co');
const rewire = require('rewire');
const readMarks = rewire(`${src}/read-marks.js`);
const sinon = require('sinon');
const chai = require('chai');

readMarks.__set__('read', function*() {
  return require('./marks.json');
});

describe('read-marks', () => {
  describe('#readTree(...)', () => {
    it('should return tree', co.wrap(function*(){
      const actual = yield readMarks.readTree('');
      const expected = require('./marks-tree.json');
      chai.expect(actual)
        .to.deep.equal(expected);
    }));
  });
});
