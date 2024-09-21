const utils = require('../utils');

module.exports = function SpineFileChecker() {
  this._searchFile = function (searchPath, exceptPath) {
    const extName = '.json.meta';
    const prefixName = 'spine_';
    return utils.searchFile(searchPath, true, extName, prefixName, exceptPath);
  }

  this._parserSpineMeta = function (jsonMap) {
    let map = new Map();

    if (!jsonMap || jsonMap.size === 0) {
      return map;
    }

    let jsonKeys = jsonMap.keys();
    for (let name of jsonKeys) {
      let jsonObj = jsonMap.get(name);
      if (!jsonObj || !jsonObj.uuid) {
        continue;
      }

      let uuid = jsonObj.uuid;
      map.set(name, uuid);
    }

    return map;
  }

  this.startCheck = function (bundlePath, foundJsonMap, exceptPath) {

    let metaJsonMap = this._searchFile(bundlePath, exceptPath);
    let spineUuidMap = this._parserSpineMeta(metaJsonMap);
    Editor.info(` --------------- start spine check total : ${spineUuidMap.size}--------------- `);
    for (let [key, value] of spineUuidMap) {
      utils.matchUUID(key, value, foundJsonMap);
    }
  }
}