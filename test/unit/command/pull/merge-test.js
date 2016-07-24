'use strict';

/*global describe,it*/
const src = '../../../../lib';
const rewire = require('rewire');
const merge = rewire(`${src}/command/pull/merge`);
const chai = require('chai');

describe('merge', () => {
  describe('copy-remote', () => {
    describe('#copyRemote(...)', () => {
      it('should add additional folders', () => {

        const local = {
          id: 0,
          children: [{
            id: 1,
            children: [{
              id: 2,
              children: [{
                id: 3,
                children: []
              }]
            }, {
              id: 4,
              children: []
            }]
          }]
        };

        const remote = {
          id: 0,
          children: [{
            id: 1,
            children: [{
              id: 2,
              children: [{
                id: 3,
                children: []
              }]
            }, {
              id: 4,
              children: []
            }, {
              id: 5,
              children: [{
                id: 6,
                children: [{
                  id: 7
                }]
              }]
            }]
          }]
        };

        const actual = merge.copyRemote(remote, local);
        const expected = remote;

        chai.expect(expected)
          .to.deep.equal(actual.local);
      });
    });
  });
});
