'use strict';

const _ = require('lodash');
const bluebird = require('bluebird');
let sqlite3 = require('sqlite3');
let findFile = require('./find-file');

function* insertPlace(db, bookmark) {
  const query = `
    insert into moz_places(
      url,
      title,
      rev_host,
      visit_count,
      hidden,
      typed,
      favicon_id,
      frecency,
      last_visit_date,
      guid,
      foreign_count
    ) values (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const place = {
    url: bookmark.place_url,
    title: bookmark.place_title,
    rev_host: bookmark.place_rev_host,
    visit_count: bookmark.place_visit_count,
    hidden: bookmark.place_hidden,
    typed: bookmark.place_typed,
    favicon_id: bookmark.place_favicon_id,
    frecency: bookmark.place_frecency,
    last_visit_date: bookmark.place_last_visit_date,
    guid: bookmark.place_guid,
    foreign_count: bookmark.place_foreign_count
  };

  yield bluebird.promisify(
    db.all.bind(db, query))(place);

  const rows = yield bluebird.promisify(
    db.all.bind(db, 'select last_insert_rowid() as id'))();

  console.log(rows);
  return _.first(rows).id;
}

function* insertBookmark(db, place, bookmark) {
  const query = `
    insert into moz_bookmarks(
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
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const doInsert = bluebird.promisify(
    db.all.bind(db, query));

  doInsert(
    bookmark.type,
    (place) ? place.id : null,
    bookmark.parent,
    bookmark.position,
    bookmark.title,
    bookmark.keyword_id,
    bookmark.folder_type,
    bookmark.dateAdded,
    bookmark.lastModified,
    bookmark.guid
  );

  const rows = yield bluebird.promisify(
    db.all.bind(db, 'select last_insert_rowid() as id'))();

  console.log(rows);
  return _.first(rows).id;
}

// TODO: Bookmarks must be inserted depth-first
function* insert(cn, tree, copied) {

  const bookmarkIds = {};
  const placeIds = {};
  function* dfs(db, bookmark, marked, visited) {

    const place = (bookmark.type === 1) ?
      yield insertPlace(db, bookmark) : null;
    if (place && place.id) {
      placeIds[bookmark.place_id] = place.id;
    }

    const placedBookmarkId =
      yield insertBookmark(db, place, bookmark);

    visited[bookmark.id] += visited[bookmark.id] || 0;
    const child = _.head(bookmark.children.filter((b) => {
      return !visited[b.id] && copied[b.id];
    }));

    bookmarkIds[bookmark.id] = placedBookmarkId;
    dfs(db, child, marked, visited);
  }

  const placesFile = yield findFile(cn);
  const db = new sqlite3.Database(placesFile);

  const marked = _.groupBy(copied, (n) => n.id);
  yield dfs(db, tree, marked, {});
}

module.exports = insert;
