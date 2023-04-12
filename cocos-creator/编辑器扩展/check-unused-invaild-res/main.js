'use strict';


const fs = require('fs');
const path = require("path");

const PicFileChecker = require('./checker/PicFileChecker');
const SpineFileChecker = require('./checker/SpineFileChecker');
const AnimFileChecker = require('./checker/AnimFileChecker');
const utils = require('./utils');

const BUNDLES_ROOT = path.join(Editor.Project.path, "assets/game-bundle/package");
// 关卡 bundle
const SLOTS_BUNDLE_NAME = "slots";
// 活动 bundle 前缀
const ACTIVITY_BUNDLE_PERFIX = "activity-";

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
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

  // /**
  //  * 是否为关卡 bundle 文件夹
  //  */
  // _isSlotsBundleDir(parentPath, file) {
  //   let bundlePath = path.join(parentPath, file);
  //   let fileStat = fs.statSync(bundlePath);
  //   return (fileStat.isDirectory() && file === SLOTS_BUNDLE_NAME);
  // },

  // /**
  //  * 是否为活动 bundle
  //  */
  // _isActivityBundleDir(parentPath, file) {
  //   let bundlePath = path.join(parentPath, file);
  //   let fileStat = fs.statSync(bundlePath);
  //   return (fileStat.isDirectory() && file.startsWith(ACTIVITY_BUNDLE_PERFIX));
  // },

  _getFoundFileJsonMap(curBundlePath) {
    let animJsonMap = utils.searchFile(curBundlePath, true, '.anim');
    let prefabJsonMap = utils.searchFile(curBundlePath, true, '.prefab');
    let sceneJsonMap = utils.searchFile(curBundlePath, false, '.fire');
    Editor.info(` --------------- foundJsonMap animJsonMap : ${animJsonMap.size} --------------- `);
    Editor.info(` --------------- foundJsonMap prefabJsonMap : ${prefabJsonMap.size} --------------- `);
    Editor.info(` --------------- foundJsonMap sceneJsonMap : ${sceneJsonMap.size} --------------- `);
    let foundJsonMap = new Map([...animJsonMap, 
                                ...prefabJsonMap, 
                                ...sceneJsonMap]);

    return foundJsonMap;
  },

  /**
   * 检测非法的资源
   * @param {} allJsonMap 
   */
  _checkInvildFile(curBundlePath, checkedJsonMap , exceptPath) {
    if (!curBundlePath) {
      Editor.log('[main _checkInvildFile]: curBundlePath is null');
    }

    let checkers = new Array();
    checkers.push(new PicFileChecker());
    checkers.push(new SpineFileChecker());
    checkers.push(new AnimFileChecker());

    for (let checker of checkers) {
      Editor.info(` --------------- _checkInvildFile --------------- `);
      checker.startCheck(curBundlePath, checkedJsonMap,exceptPath);
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

    Editor.info(` --------------- CurCheckBundle : ${bundlePath} --------------- `);

    let foundJsonMap = this._getFoundFileJsonMap(bundlePath);

    if (foundJsonMap.size > 0) {
      // Editor.info(` --------------- foundJsonMap size : ${foundJsonMap.size} --------------- `);
      // let lastIndex = bundlePath.lastIndexOf("/");
      // let parentPath = bundlePath.splice(lastIndex,parentPath.length - lastIndex);
      this._checkInvildFile(BUNDLES_ROOT, foundJsonMap , bundlePath);
    } else {
      Editor.log("foundJsonMap length is 0");
    }

    Editor.info(` --------------- BundleCheckEnd : ${bundlePath} --------------- `);
  },

  /**
   * 检测 bundle 的资源
   */
  checkBundlesRes() {
    const checkPaths = Editor.Dialog.openFile({
      defaultPath: BUNDLES_ROOT,
      nameFieldLabel: '路径选择:',
      properties: [
        'openDirectory'
      ],
      message: '查询引用了非法的资源--将会检查当前bundle是否用了package下其他bundle的资源',
      buttonLabel: 'OK'
    })

    for (let i = 0; i < checkPaths.length; ++i) {
      if (checkPaths[i] != null) {
        this._startCheckBundleRes(checkPaths[i]);
      }
    }
  }

};