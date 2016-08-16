'use strict';

const _ = require('lodash');
const sqlite3 = require('sqlite3');
const bluebird = require('bluebird');

class Db {
  static get file() {
    return this._file;
  }

  constructor(file) {
    this._file = file;
    this.db = new sqlite3.Database(file);
  }

  *findOne(query, params) {
    return yield bluebird.promisify(
      this.db.get.bind(this.db, query))(params);
  }

  *insert(query, params) {
    return yield bluebird.promisify(
      this.db.all.bind(this.db, query))(params);
  }

  *lastRowId() {
    const rows = yield bluebird.promisify(
      this.db.all.bind(this.db, 'select last_insert_rowid() as id'))();
    return _.first(rows).id;
  }


  /**
   * executeSql - Execute raw SQL
   *
   * @param  {string} sql raw SQL
   * @returns {undefined}     undefined
   */
  *executeSql(sql) { // eslint-disable-line
    throw new Error('Not implemented');
  }
}

module.exports = Db;
