'use strict';

const _ = require('lodash');

function write(marks) {
  function writeMarkdown(acc, mark, level) {
    level = level || 0;
    acc.push(`${_.repeat('  ', level)} * [${mark.title}](${mark.url})`);
    mark.children.forEach((child) => writeMarkdown(acc, child, level + 1));
    return acc;
  }

  return writeMarkdown(['# Gitfox Bookmarks'], marks).join('\n');
}

module.exports = {
  write
};
