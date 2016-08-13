const fs = require('fs-extra');
const placesFindFile = require('../../places/find-file');

function* destinationFolder(folder) {
  return yield new Promise((fulfill, reject) => {
    if (!folder) {
      fulfill('');
    } else {
      fs.access(folder, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          reject(err);
        } else {
          fulfill(folder);
        }
      });
    }
  });
}

/**
 * function - Copy the places.sqlite file to another folder
 *
 * @param  {object} cn          Connection details
 * {
 *  firefoxHome: "string",
 *  profileIni: "string"
 *  profile: "string"
 * }
 * @param  {string} destination Destination filepath
 * @returns {string} Original places filepath
 */
function* exportToFolder(cn, destination) {
  const folder = yield destinationFolder(destination);

  const placesSqlFile = yield placesFindFile(cn);
  return yield new Promise((fulfill, reject) => {
    fs.copy(placesSqlFile, folder, function(err) {
      if (err) {
        reject(err);
      } else {
        fulfill(placesSqlFile);
      }
    });
  });
}

module.exports = exportToFolder;
