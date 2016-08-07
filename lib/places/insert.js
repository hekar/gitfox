'use strict';

const _ = require('lodash');
let Db = require('./db');
let findFile = require('./find-file');
const uuid = require('node-uuid');

function* findRoot(db, title) {
  const query = `
    select
      mb.*
    from moz_bookmarks mb
    where
      title = $<title>
  `;

  const params = {
    title
  };

  return yield db.findOne(query, params);
}

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
      $<url>,
      $<title>,
      $<rev_host>,
      $<visit_count>,
      $<hidden>,
      $<typed>,
      $<favicon_id>,
      $<frecency>,
      $<last_visit_date>,
      $<guid>,
      $<foreign_count>
    )
  `;

  const params = {
    url: bookmark.place_url,
    title: bookmark.place_title,
    rev_host: bookmark.place_rev_host,
    visit_count: bookmark.place_visit_count,
    hidden: bookmark.place_hidden,
    typed: bookmark.place_typed,
    favicon_id: bookmark.place_favicon_id,
    frecency: bookmark.place_frecency,
    last_visit_date: bookmark.place_last_visit_date,
    guid: uuid.v4(),
    foreign_count: bookmark.place_foreign_count
  };

  yield db.insert(query, params);
  return yield db.lastRowId();
}

function* insertBookmark(db, bookmark, placeId) {
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
      $<type>,
      $<placeId>,
      $<parent>,
      $<position>,
      $<title>,
      $<keyword_id>,
      $<folder_type>,
      $<dateAdded>,
      $<lastModified>,
      $<guid>
    )
  `;

  const params = {
    type: bookmark.type,
    placeId: placeId,
    parent: bookmark.parent,
    position: bookmark.position,
    title: bookmark.title,
    keyword_id: bookmark.keyword_id,
    folder_type: bookmark.folder_type,
    dateAdded: bookmark.dateAdded,
    lastModified: bookmark.lastModified,
    guid: uuid.v4()
  };

  yield db.insert(query, params);
  return yield db.lastRowId();
}

function isRoot(bookmark) {
  return bookmark.title === 'gitfox';
}

function* conditionallyInsertBookmark(db, bookmark, placeId) {
  if (isRoot(bookmark)) {
    const root = yield findRoot(db, bookmark.title);
    if (!root) {
      return (yield insertBookmark(db, bookmark, placeId)).id;
    } else {
      return root.id;
    }
  } else {
    return (yield insertBookmark(db, bookmark, placeId)).id;
  }
}

// TODO: Bookmarks must be inserted depth-first
function* insert(cn, tree, copied) {

  const bookmarkIds = {};
  const placeIds = {};
  function* dfs(db, bookmark, marked, visited) {
    const isMarked = bookmark.id in marked;
    const isBookmarkUrl = bookmark.type === 1;
    const placeId = (isMarked && isBookmarkUrl) ?
      yield insertPlace(db, bookmark) : null;
    if (placeId) {
      placeIds[bookmark.place_id] = placeId;
    }

    const placedBookmarkId = (isMarked) ?
      yield conditionallyInsertBookmark(db, bookmark, placeId) :
      bookmark.id;
    visited[bookmark.id] = visited[bookmark.id] || 0;
    const children = bookmark.children.filter((b) => {
      return !visited[b.id];
    });

    for (let child of children) {
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
