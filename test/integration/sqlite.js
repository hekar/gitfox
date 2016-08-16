'use strict';

const src = '../../lib';
const Db = require(`${src}/places/db`);
const tmp = require('tmp');

function* createTmpFile() {
  return yield new Promise((fulfill, reject) => {
    tmp.file((err, path, fd, cleanup) => {
      if (err) {
        reject(err);
      } else {
        cleanup(); // Never wanted a file. Just delete it
        fulfill(path);
      }
    });
  });
}

function* generateSqliteFile(sql) {
  const output = createTmpFile();
  const db = new Db(output);
  yield db.executeSql(sql);
  return db;
}

module.exports = {
  generateSqliteFile
};
