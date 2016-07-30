'use strict';

/*global describe,it*/
const src = '../../../lib';
const co = require('co');
const rewire = require('rewire');
const chai = require('chai');
const insert = rewire(`${src}/places/insert`);

insert.__set__('sqlite3', {
  Database: function() {
    return {
      all: function() {
      }
    };
  }
});

insert.__set__('findFile', function *() {
  return '';
});

describe('', () => {
  const cn = {};
  describe('', () => {
    it.only('should correctly traverse tree', co.wrap(function*() {
      const tree = require('../resources/bookmarks-tree.json');
      yield insert(cn, tree, []);
    }));
  });
});
