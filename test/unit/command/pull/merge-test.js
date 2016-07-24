'use strict';

/*global describe,it*/
const _ = require('lodash');
const src = '../../../../lib';
const rewire = require('rewire');
const merge = rewire(`${src}/command/pull/merge`);
const chai = require('chai');

function assertMerge(remote, local) {
  chai.expect(remote)
    .to.deep.equal(merge.copyRemote(remote, local).local);
}

describe('merge', () => {
  describe('copy-remote', () => {
    describe('#copyRemote(...)', () => {
      it('should not add existing nodes', () => {
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

        assertMerge(_.clone(local), local);
      });

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

        assertMerge(remote, local);
      });

      it('should add when children field missing', () => {
        const local = {
          id: 0
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
            }]
          }]
        };

        assertMerge(remote, local);
      });

      it('should add when children field missing', () => {
        const local = {
          id: 0
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
            }]
          }]
        };

        assertMerge(remote, local);
      });

      it('should skip missing children on remote', () => {
        const local = {
          id: 0
        };

        const remote = {
          id: 0
        };

        assertMerge(remote, local);
      });
    });
  });
});
