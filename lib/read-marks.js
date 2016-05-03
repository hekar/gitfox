'use strict';

const bluebird = require('bluebird');
const sqlite3 = require('sqlite3');

function* read(placesFile) {
  const db = new sqlite3.Database(placesFile);
  const query =
    `
    with recursive
    firegit_child(id) AS (
     select
        mb.id
     from
        moz_bookmarks mb
     where
        title='firegit' collate nocase
     union
     select
        mb.id
     from
        moz_bookmarks mb, firegit_child fgc
     where
        mb.parent=fgc.id
    )
    select
      mb.*
    from
      moz_bookmarks mb
    where
      mb.id in firegit_child;
    `;

  return yield bluebird.promisify(db.all.bind(db))(query);
}

module.exports = {
  read
};
