'use strict';

const _ = require('lodash');
let Db = require('./db');
let findFile = require('./find-file');
const uuid = require('node-uuid');

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

  const params = [
    bookmark.place_url,
    bookmark.place_title,
    bookmark.place_rev_host,
    bookmark.place_visit_count,
    bookmark.place_hidden,
    bookmark.place_typed,
    bookmark.place_favicon_id,
    bookmark.place_frecency,
    bookmark.place_last_visit_date,
    uuid.v4(),
    bookmark.place_foreign_count
  ];

  yield db.insert(query, _.values(params));
  return yield db.lastRowId();
}

function* insertBookmark(db, placeId, bookmark) {
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

  const params = [
    bookmark.type,
    placeId,
    bookmark.parent,
    bookmark.position,
    bookmark.title,
    bookmark.keyword_id,
    bookmark.folder_type,
    bookmark.dateAdded,
    bookmark.lastModified,
    uuid.v4()
  ];

  yield db.insert(query, _.values(params));
  return yield db.lastRowId();
}

// TODO: Bookmarks must be inserted depth-first
function* insert(cn, tree, copied) {

  const bookmarkIds = {};
  const placeIds = {};
  function* dfs(db, bookmark, marked, visited) {

    const placeId = (bookmark.type === 1) ?
      yield insertPlace(db, bookmark) : null;
    if (placeId) {
      placeIds[bookmark.place_id] = placeId;
    }

    const placedBookmarkId =
      yield insertBookmark(db, placeId, bookmark);

    visited[bookmark.id] += visited[bookmark.id] || 0;
    const child = _.head(bookmark.children.filter((b) => {
      return !visited[b.id] && copied[b.id];
    }));

    if (child) {
      bookmarkIds[bookmark.id] = placedBookmarkId;
      yield dfs(db, child, marked, visited);
    }
  }

  const placesFile = yield findFile(cn);
  const db = new Db(placesFile);

  const marked = _.groupBy(copied, (n) => n.id);
  yield dfs(db, tree, marked, {});
}

module.exports = insert;
