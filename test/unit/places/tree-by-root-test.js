'use strict';

/*global describe,it*/
const src = '../../../lib';
const co = require('co');
const rewire = require('rewire');
const findByTitle = rewire(`${src}/places/tree-by-root`);
const chai = require('chai');

findByTitle.__set__('findByRoot', function*() {
  return require('../resources/bookmarks-flat.json');
});

describe('places', () => {
  describe('#findByTitleRecursive(...)', () => {
    it('should return tree', co.wrap(function*() {
      const actual = yield findByTitle('');
      const expected = require('../resources/bookmarks-tree.json');
      chai.expect(actual)
        .to.deep.equal(expected);
    }));

    // TODO: add failing test cases
  });
});
