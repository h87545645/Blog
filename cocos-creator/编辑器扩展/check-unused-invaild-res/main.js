'use strict';


const fs = require('fs');
const path = require("path");

const PicFileChecker = require('./checker/PicFileChecker');
const SpineFileChecker = require('./checker/SpineFileChecker');
const AnimFileChecker = require('./checker/AnimFileChecker');
const utils = require('./utils');

const BUNDLES_ROOT = path.join(Editor.Project.path, "assets/bundle");

const RESOURCES_ROOT = path.join(Editor.Project.path, "assets/resources");
// 关卡 bundle
const SLOTS_BUNDLE_NAME = "slots";
// 活动 bundle 前缀
const ACTIVITY_BUNDLE_PERFIX = "activity-";

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    "scene:ready": function () {
    },

    "check-bundles-invaild": function () {
      this.checkBundlesRes()
    }
  },


  /**
   * 获得需要检查资源的json文件
   */
  _getFoundFileJsonMap(curBundlePath) {
    let animJsonMap = utils.searchFile(curBundlePath, true, '.anim');
    let prefabJsonMap = utils.searchFile(curBundlePath, true, '.prefab');
    let sceneJsonMap = utils.searchFile(curBundlePath, true, '.fire');
    Editor.info(` --------------- foundJsonMap animJsonMap : ${animJsonMap.size} --------------- `);
    Editor.info(` --------------- foundJsonMap prefabJsonMap : ${prefabJsonMap.size} --------------- `);
    Editor.info(` --------------- foundJsonMap sceneJsonMap : ${sceneJsonMap.size} --------------- `);
    let foundJsonMap = new Map([...animJsonMap,
    ...prefabJsonMap,
    ...sceneJsonMap]);

    return foundJsonMap;

    // 这里的foundJsonMap结构为 {xxx.prefab : xxx.prefab对应的jsonOBJ , xxx.fire : xxx.fire对应的jsonOBJ}
  },

  /**
   * 检测非法的资源
   * @param {} allJsonMap 
   */
  _checkInvildFile(checkJsonMap, exceptPaths) {
    // if (!curBundlePath) {
    //   Editor.log('[main _checkInvildFile]: curBundlePath is null');
    // }
    // let checkers = new Array();
    // checkers.push(new PicFileChecker());
    // checkers.push(new SpineFileChecker());
    // checkers.push(new AnimFileChecker());
    // for (let checker of checkers) {
    //   checker.startCheck(checkJsonMap, exceptPath);
    // }

    let uuidMap = new Map();
    for (let [key, value] of checkJsonMap) {
      Editor.info(` --------------- resources name : ${key} --------------- `);
      let uuidArray = [];
      this._getUUIDInJson(value, uuidArray);
      uuidMap.set(key, uuidArray);
    }

    for (let [key, value] of uuidMap) {
      for (let i = 0; i < value.length; i++) {
        let uuid = value[i];
        let assetInfo = Editor.assetdb.assetInfoByUuid(uuid);
        if (assetInfo.url.indexOf('db://internal/') >= 0 || assetInfo.url.indexOf('db://assets/resources') >= 0) continue
        if (assetInfo.path.indexOf(exceptPaths) < 0) {
          Editor.error(`uuid :( ${uuid} ), ${key} contains invalid resource ${assetInfo.url}`);
        }
      }
    }
  },

  /**
   * 递归获得prefab animation 场景fire里所有的 uuid
   */
  _getUUIDInJson(jsonMap, uuidArray) {
    if (typeof jsonMap !== 'object' || jsonMap == null) {
      return;
    }
    for (let key in jsonMap) {
      if (key === "__uuid__") {
        uuidArray.push(jsonMap[key]);
      }
      this._getUUIDInJson(jsonMap[key], uuidArray);
    }
  },


  _startCheckBundleRes(bundlePath) {
    if (!fs.existsSync(bundlePath)) {
      Editor.log(`_startCheckBundleRes: ${bundlePath} is not exist`);
      return;
    }

    let fileStat = fs.statSync(bundlePath);
    if (!fileStat.isDirectory()) {
      Editor.log(`_startCheckBundleRes: ${bundlePath} is not directory`);
      return;
    }

    Editor.info(` --------------- checkPath : ${bundlePath} --------------- `);

    let foundJsonMap = this._getFoundFileJsonMap(bundlePath);

    if (foundJsonMap.size > 0) {
      // Editor.info(` --------------- foundJsonMap size : ${foundJsonMap.size} --------------- `);
      // let lastIndex = bundlePath.lastIndexOf("/");
      // let parentPath = bundlePath.splice(lastIndex,parentPath.length - lastIndex);
      this._checkInvildFile(foundJsonMap, bundlePath);
    } else {
      Editor.log("foundJsonMap is empty");
    }

    Editor.info(` --------------- BundleInvaildCheckFinished : ${bundlePath} --------------- `);
  },


  /**
   * 入口 ， 打开dialog 选择检测目录路径
   */
  checkBundlesRes() {
    const checkPaths = Editor.Dialog.openFile({
      defaultPath: BUNDLES_ROOT,
      nameFieldLabel: '路径选择:',
      properties: [
        'openDirectory' /* , 'multiSelections' */
      ],
      message: '查询引用了非法的资源--将会检查当前bundle是否应用了其他bundle的资源',
      buttonLabel: 'OK',
    })

    // const comparePath = Editor.Dialog.openFile({
    //   defaultPath: path.join(Editor.Project.path, "assets"),
    //   nameFieldLabel: '路径选择:',
    //   properties: [
    //     'openDirectory'
    //   ],
    //   message: '需要对比的目录,将遍历所选目录下所有bundle,检查是否有引用',
    //   buttonLabel: 'OK'
    // })


    for (let i = 0; i < checkPaths.length; ++i) {
      if (checkPaths[i] != null/*  && comparePath[0] != null */) {
        this._startCheckBundleRes(checkPaths[i]);
      }
    }
  }

};