'use strict';

/*global describe,it*/
const src = '../../../lib';
const co = require('co');
const rewire = require('rewire');
const marks = rewire(`${src}/marks/read`);
const chai = require('chai');

marks.__set__('read', function*() {
  return require('../resources/bookmarks-flat.json');
});

describe('read-marks', () => {
  describe('#readTree(...)', () => {
    it('should return tree', co.wrap(function*() {
      const actual = yield marks.readTree('');
      const expected = require('../resources/bookmarks-tree.json');
      chai.expect(actual)
        .to.deep.equal(expected);
    }));
  });
});
