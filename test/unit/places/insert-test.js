'use strict';

/*global describe,it*/
const src = '../../../lib';
const co = require('co');
const _ = require('lodash');
const rewire = require('rewire');
const sinon = require('sinon');
const insert = rewire(`${src}/places/insert`);

insert.__set__('sqlite3', {
  Database: function() {
    return {
      all: function(query, params, done) {
        const callback = _.isFunction(done) ? done : params;
        callback(null, [{
          id: 0
        }]);
      }
    };
  }
});

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
    it.only('should correctly traverse tree', co.wrap(function*() {
      const localTree = require('../resources/bookmarks-tree.json');
      //
      const excludeIds = [470, 710, 711, 712, 713, 714];
      const copied = [];
      filterTree(localTree, (node) => {
        const include = !_.includes(excludeIds, node.id);
        if (!include) {
          copied.push(node);
        }
        return include;
      });

      const remoteTree = require('../resources/bookmarks-tree.json');
      yield insert(cn, remoteTree, copied);


    }));
  });
});
