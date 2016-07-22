'use strict';

const _ = require('lodash');
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
        title='gitfox' collate nocase
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
      coalesce(mp.url, '') as url
    from
      moz_bookmarks mb
    left join moz_places mp
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

function* readTree(placesFile) {
  const flat = yield read(placesFile);

  function makeNode(place) {
    return _.assign({}, place, { children: [] });
  }

  function build(root, places, placed, level) {
    if (places.length === placed.length) {
      return;
    } else {
      const children = _(places)
        .filter((place) => place.parent === root.id)
        .map(makeNode)
        .value();

      for (const child of children) {
        root.children.push(child);
        placed.push(child);
        build(child, places, placed)
      }
    }
  }

  const root = makeNode(
    _(flat).filter((place) => place.title === 'gitfox').first()
  );
  build(root, flat, []);

  return root;
}

module.exports = {
  read,
  readTree
};
