'use strict'
const path = require("path");
const common = require('./tool/common')
const utils = require('./tool/utils/common-utils')
const nodeExporter = require('./tool/core/node-exporter')
const assetChecker = require('./tool/core/assets-checker')
const slotsAdapter = require('./tool/core/slots-adapt')
const PACKAGE_JSON = require('./package.json')
const audioCfgExporter = require('./tool/core/audio-cfg-exporter')
const AUDIOPATH = path.join(Editor.Project.path, "assets/bundle/package");

module.exports = {
  load() {
    nodeExporter.init()
    audioCfgExporter.init()
  },

  unload() { },
  messages: {
    'export': function () {
      doExport()
    },
    'check': function () {
      doCheck()
    },
    'adapt': function () {
      doAdapt()
    },
    'exportAudioCfg': function () {
      doExportAudioCfg()
    }
  }
}

function doAdapt() {
  let openPaths = Editor.Dialog.openFile({
    defaultPath: common.AssetFullPath,
    nameFieldLabel: '路径选择:',
    properties: [
      'openDirectory'
    ],
    message: '请选择需要刷新的项目所在的文件夹',
    buttonLabel: 'OK'
  })

  slotsAdapter.deal(openPaths[0])
}

function doExport() {
  let currentSelection = Editor.Selection.curSelection('asset')
  console.log(currentSelection.length)

  if (currentSelection.length <= 0) {
    Editor.Dialog.messageBox(utils.getWarnMsg('Please select an prefab or scene!'))
    return
  }

  let selectionUUid = currentSelection[0]
  let assetInfo = Editor.assetdb.assetInfoByUuid(selectionUUid)

  let defaultUrl = utils.assetsFullPath(assetInfo.url)

  let assetType = assetInfo.type
  if (assetType === 'prefab' || assetType === 'scene') {
    let newUrl = Editor.Dialog.saveFile({
      filters: [
        {
          name: 'ts',
          extensions: ['ts']
        }
      ],
      defaultPath: defaultUrl,
      nameFieldLabel: '文件名:',
      properties: [
        'openDirectory',
        'createDirectory'
      ],
      message: '导出TS文件脚本',
      buttonLabel: '导出'
    })

    if (newUrl != null) {
      nodeExporter.dealAsset(assetInfo, newUrl)
    } else {
      Editor.log(`export be canceled`)
    }
  } else {
    Editor.Dialog.messageBox(utils.getWarnMsg('Please select an prefab or scene!'))
  }
}

function doCheck() {
  let currentSelection = Editor.Selection.curSelection('asset')
  // console.log(currentSelection.length)

  if (currentSelection.length <= 0) {
    Editor.Dialog.messageBox(utils.getWarnMsg('Please select an prefab or scene!'))
    return
  }

  let selectionUUid = currentSelection[0]
  let assetInfo = Editor.assetdb.assetInfoByUuid(selectionUUid)
  let assetType = assetInfo.type
  if (assetType === 'prefab' || assetType === 'scene') {
    assetChecker.dealAsset(assetInfo)
  } else {
    Editor.Dialog.messageBox(utils.getWarnMsg('Please select an prefab or scene!'))
  }
}

function doExportAudioCfg() {
  try {
    Editor.info(` --------------- doExportAudioCfg --------------- `);
    let checkPaths = Editor.Dialog.openFile({
      defaultPath: AUDIOPATH,
      nameFieldLabel: '路径选择:',
      properties: [
        'openDirectory'
      ],
      message: '导出audio配置',
      buttonLabel: 'OK'
    })
    if (checkPaths.length == 0) {
      Editor.log("searchPath is not directory");
      return;
    }
    let splits = checkPaths[0].split("/");
    let bundleName = splits[splits.length - 3];
    let defaultUrl = checkPaths[0] + "/" + bundleName + "-audio-cfg"
    Editor.info(` --------------- doExportAudioCfg defaultUrl : ${defaultUrl}--------------- `);
    let newUrl = Editor.Dialog.saveFile({
      filters: [
        {
          name: 'json',
          extensions: ['json']
        }
      ],
      defaultPath: defaultUrl,
      nameFieldLabel: '文件名:',
      properties: [
        'openDirectory',
        'createDirectory'
      ],
      message: '导出json配置',
      buttonLabel: '导出'
    })
    Editor.info(` --------------- doExportAudioCfg newUrl : ${newUrl} --------------- `);
    for (let i = 0; i < checkPaths.length; ++i) {
      if (checkPaths[i] != null) {
        audioCfgExporter.dealAsset(checkPaths[i], newUrl)
      }
    }
  } catch (error) {
    Editor.error(error);
  }

}
