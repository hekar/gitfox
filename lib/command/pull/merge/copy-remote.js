'use strict';

const _ = require('lodash');

/*
 * This is a difficult decision. Simply using the id can
 * result in unwarranted duplicate entries, because I could
 * delete and re-add an entry. It's fairly easy to do with
 * the current UI for Firefox (2016).
 *
 * There it'd make more sense to use a composite key.
 * But what should that composite key be? Especially as
 * I'd like to begin adding keywords to my bookmark entries.
 *
 * By far the best conclusion would be to err on the side of
 * caution and create more duplicates than necessary.
 * This would mean using only the id of the bookmark for
 * equality.
 *
 * Afterwards we could allow the user to sync by mirroring.
 *
 * Instead of 'copyRemote', they can 'replaceLocal' (with remote).
 *
 * Of course, one could always write additional sync strategies...
 */
function copyRemote(remoteMarks, localMarks) {
  function id(node) {
    return (node.title && node.title === 'gitfox') ? -1 : node.id;
  }

  function buildMap(nodes) {
    const localMap = new Map();
    for (let node of nodes) {
      localMap.set(id(node), node);
    }
    return localMap;
  }

  function findOnlyOnLeft(left, right) {
    const rightIds = new Set(right.map(id));

    const onlyOnLeft = [];
    for (let node of left) {
      if (!rightIds.has(id(node))) {
        onlyOnLeft.push(node);
      }
    }

    return onlyOnLeft;
  }

  function copyLeftToRight(remote, local, copied) {
    if (!remote.children) {
      return;
    } else if (!local.children) {
      local.children = _.clone(remote.children);
      return;
    }
    const remoteOnly = findOnlyOnLeft(
      remote.children, local.children);

    // Do not include remote in localMap
    const localMap = buildMap(local.children);

    for (let node of remoteOnly) {
      copied.push(node);
      local.children.push(node);
    }

    for (let remoteNode of remote.children) {
      const localNode = localMap.get(id(remoteNode));
      if (localNode) {
        copyLeftToRight(remoteNode, localNode, copied);
      }
    }
  }

  function flatten(nodes, flat) {
    for (let node of nodes) {
      flat.push(node);
      flatten(node.children, flat);
    }

    return flat;
  }

  const copiedTree = [];
  copyLeftToRight(remoteMarks, localMarks, copiedTree);
  return {
    local: localMarks,
    copied: flatten(copiedTree, []),
    copiedTree
  };
}

module.exports = copyRemote;
