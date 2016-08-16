'use strict';

/*global beforeEach,describe,it*/
const src = '../../lib';
const co = require('co');
const rewire = require('rewire');
const index = rewire(`${src}/index.js`);
const chai = require('chai');

describe('#main(...)', () => {

  beforeEach(() => {
    let i = 0;
    const commandStub = {
      command: '_' + i++,
      describe: '',
      builder: {},
      handler: () => {}
    };

    index.__set__('commit', commandStub);
    index.__set__('push', commandStub);
    index.__set__('pull', commandStub);
    index.__set__('profiles', commandStub);
  });

  describe('flags', () => {
    describe('verbose', () => {
      it('treats as count - 0', co.wrap(function *() {
        chai.expect((yield index.main([])).v).to.be.equal(0);
      }));

      it('treats as count - 1', co.wrap(function *() {
        chai.expect((yield index.main(['-v'])).v).to.be.equal(1);
      }));

      it('treats as count - 2', co.wrap(function *() {
        chai.expect((yield index.main(['-vv'])).v).to.be.equal(2);
      }));

      it('treats as count - 3', co.wrap(function *() {
        chai.expect((yield index.main(['-vvv'])).v).to.be.equal(3);
      }));
    });
  });

  describe('commands', () => {
    describe('push', () => {
      it('respects --dry-run', () => {
        // index.main()
      });
    });
  });

});
