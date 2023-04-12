'use strict'
const path = require("path");
const utils = require('./tool/utils')
const nodeExporter = require('./tool/core/node-exporter')
const assetChecker = require('./tool/core/assets-checker')
const convertConfig = require('./tool/core/skin-change/convertConfig')
const audioCfgExporter = require('./tool/core/audio-cfg-exporter')

const AUDIOPATH = path.join(Editor.Project.path, "assets/game-bundle/package");

module.exports = {
  load() {
    // execute when package loaded
    nodeExporter.init()
    audioCfgExporter.init()
  },

  unload() {
    // execute when package unloaded
  },

  messages: {
    'export': function () {
      doExport()
    },
    'check': function () {
      doCheck()
    },
    'exportCfg': function () {
      doExportChangeCfg()
    },
    'exportAudioCfg': function () {
      doExportAudioCfg()
    }
    
  }
}

function doExport () {
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

function doCheck () {
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

function doExportChangeCfg () {
  let openPaths = Editor.Dialog.openFile({
    defaultPath: BUNDLES_ROOT,
    nameFieldLabel: '路径选择:',
    properties: [
      'openDirectory'
    ],
    message: '查询没有引用的资源',
    buttonLabel: 'OK'
  })

  for (let i = 0; i < openPaths.length; ++i) {
    if (openPaths[i] != null) {
      convertConfig.deal(openPaths[i])
    }
  }
}


function doExportAudioCfg () {
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
  let newUrl = Editor.Dialog.saveFile({
    filters: [
      {
        name: 'json',
        extensions: ['json']
      }
    ],
    defaultPath: checkPaths[0],
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
      audioCfgExporter.dealAsset(checkPaths[i],newUrl)
    }
  }
}
