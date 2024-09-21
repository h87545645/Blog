const utils = require('../utils');

module.exports = function PicFileChecker() {
  /**
   * 过滤关卡的 paytable
   */
  this._filterSlotsPaytable = function (jsonMap) {
    if (!jsonMap || jsonMap.size === 0) return jsonMap;

    let map = new Map();

    for (let [key, value] of jsonMap) {
      if (key.indexOf('paytable') === -1) {
        map.set(key, value);
      }
    }

    return map;
  },

    this._searchFile = function (searchPath, exceptPath) {
      const commonExtName = '.plist.meta';

      // 关卡
      const slotsPrefixName = 'game_';
      let slotsJsonMap = utils.searchFile(searchPath, true, commonExtName, slotsPrefixName, exceptPath);
      slotsJsonMap = this._filterSlotsPaytable(slotsJsonMap);

      // 活动
      const activityPrefixName = 'ui_activity_';
      let acivityJsonMap = utils.searchFile(searchPath, true, commonExtName, activityPrefixName, exceptPath);

      // eff 文件
      const effPrefixName = 'eff_';
      let effJsonMap = utils.searchFile(searchPath, true, commonExtName, effPrefixName, exceptPath);

      // par 文件
      const parPrefixName = 'par_';
      let parJsonMap = utils.searchFile(searchPath, true, commonExtName, parPrefixName, exceptPath);

      return new Map([...slotsJsonMap,
      ...acivityJsonMap,
      ...effJsonMap,
      ...parJsonMap]);
    }

  this._parserPicMeta = function (jsonMap) {
    let map = new Map();

    if (!jsonMap || jsonMap.size === 0) {
      return map;
    }

    for (let jsonObj of jsonMap.values()) {
      if (!jsonObj || !jsonObj.subMetas) {
        continue;
      }

      let keys = Object.keys(jsonObj.subMetas);
      if (keys && keys.length > 0) {
        for (let key of keys) {
          let uuid = jsonObj.subMetas[key].uuid;
          map.set(key, uuid);
        }
      }
    }

    return map;
  }

  this.startCheck = function (bundlePath, foundJsonMap, exceptPath) {
    let metaJsonMap = this._searchFile(bundlePath, exceptPath);
    let picUuidMap = this._parserPicMeta(metaJsonMap);
    Editor.info(` --------------- start Pic check total : ${picUuidMap.size}--------------- `);
    for (let [key, value] of picUuidMap) {
      utils.matchUUID(key, value, foundJsonMap);
    }
  }
}