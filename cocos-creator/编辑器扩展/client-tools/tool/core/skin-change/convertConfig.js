'use strict'

const utils = require('../../utils')

module.exports = {
  deal (path) {
    utils.walkDir(path, (filePath, fileStat) => {
      if (!fileStat.isDirectory() && (extname(filePath) == '.prefab' || extname(filePath) == '.fire')) {
        console.log(filePath)
      }
    });
  }
}