'use strict';

const bluebird = require('bluebird');
const sqlite3 = require('sqlite3');

function* read(placesFile) {
  const db = new sqlite3.Database(placesFile);
  const query =
    `
    with recursive
    gitfox_child(id) AS (
     select
        mb.id
     from
        moz_bookmarks mb
     where
        title='firegit' collate nocase
        or title='gitfox' collate nocase
     union
     select
        mb.id
     from
        moz_bookmarks mb, gitfox_child fgc
     where
        mb.parent=fgc.id
    )
    select
      mb.*,
      mp.url
    from
      moz_bookmarks mb
    inner join moz_places mp
      on mb.fk = mp.id
    where
      mb.id in gitfox_child
    order by
      parent desc,
      id desc,
      position asc;
    `;

  return yield bluebird.promisify(db.all.bind(db))(query);
}

module.exports = {
  read
};
