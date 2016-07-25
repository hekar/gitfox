'use strict';

const sqlite3 = require('sqlite3');
const bluebird = require('bluebird');
const findFile = require('./find-file');

function* insert(cn, bookmarks) {
  const placesFile = yield findFile(cn);
  const db = new sqlite3.Database(placesFile);

  for (let bookmark of bookmarks) {
    const query = `
      insert into moz_bookmarks(
        id,
        type,
        fk,
        parent,
        position,
        title,
        keyword_id,
        folder_type,
        dateAdded,
        lastModified,
        guid
      ) values (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;

    const doInsert = bluebird.promisify(
      db.all.bind(db, query));

    doInsert(
      bookmark.id,
      bookmark.type,
      bookmark.fk,
      bookmark.parent,
      bookmark.position,
      bookmark.title,
      bookmark.keyword_id,
      bookmark.folder_type,
      bookmark.dateAdded,
      bookmark.lastModified,
      bookmark.guid
    );
  }

  return bookmarks;
}

module.exports = insert;
