'use strict';

const _ = require('lodash');
let findByRoot = require('./find-by-root');

function* readTree(cn, title) {
  const flat = yield findByRoot(cn, title);

  function makeNode(place) {
    return _.assign({}, place, { children: [] });
  }

  function build(root, places, placed) {
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
        build(child, places, placed);
      }
    }
  }

  const root = makeNode(
    _(flat).filter((place) => place.title === 'gitfox').first()
  );
  build(root, flat, []);

  return root;
}

module.exports = readTree;
