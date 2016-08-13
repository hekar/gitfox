'use strict';

/*global describe,it,beforeEach*/
const src = '../../../lib';
const co = require('co');
const _ = require('lodash');
const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const insert = rewire(`${src}/places/insert`);

insert.__set__('findFile', function *() {
  return '';
});

function filterTree(node, predicate) {
  const children = [];
  for (let child of node.children) {
    if (predicate(child)) {
      children.push(child);
      filterTree(child, predicate);
    }
  }

  node.children = children;
  return node;
}

describe('places', () => {
  const cn = {};
  describe('#insert(...)', () => {
    let insertSpy;
    beforeEach(() => {
      insertSpy = sinon.spy();
      insert.__set__('Db', function() {
        return {
          findOne: function*(query, params) {
            return _.assign({}, params, {
              fk: params.placeId
            });
          },
          insert: function*(query, params) {
            insertSpy(query, params);
          },
          lastRowId: function*() {
            return 2;
          }
        };
      });
    });

    it('should correctly traverse tree', co.wrap(function*() {
      const tree = require('../resources/bookmarks-tree.json');
      const localTree = _.cloneDeep(tree);

      const excludeIds = [470, 710, 711, 712, 713, 714];
      const copied = [];
      filterTree(localTree, (node) => {
        const include = !_.includes(excludeIds, node.id);
        if (!include) {
          copied.push(node);
        }
        return include;
      });

      const remoteTree = _.cloneDeep(tree);
      yield insert(cn, remoteTree, copied);

      chai.assert(insertSpy.called);
      // insert is called once for places and once for bookmarks
      chai.expect(excludeIds.length * 2)
        .to.be.equal(insertSpy.callCount);
    }));
  });
});
