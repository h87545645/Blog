const fs = require('fs')
const path = require('path')
const ffs = require('fire-fs')
const fpath = require('fire-path')
const consts = require('../common')

module.exports = {
  getWarnMsg,
  assetsFullPath,
  walkDir,
  walkAssetTree,
  assetsPath
}

/**
 * 获取警告弹窗
 * @param {*} showMessage 
 * @returns 
 */
function getWarnMsg (showMessage) {
  return {
    type: 'warning',
    buttons: ['OK'],
    titile: 'warning',
    message: showMessage,
    defaultId: 0,
    noLink: true
  }
}

/**
 * 获取资源的绝对路径
 * @param {*} url 
 * @returns 
 */
function assetsFullPath (url) {
  let idx1 = url.indexOf(`/assets`)
  let idx2 = url.indexOf(`.`)
  let postfix = `${url.substring(idx1, idx2)}`
  return fpath.join(consts.ProjectPath, postfix)
}

/**
 * 资源绝对路径转db路径
 * @param {*} abPath 
 */
function assetsPath (abPath, filename, postfix = 'json') {
  let index = abPath.indexOf(`assets`)
  return `db://${abPath.substring(index)}/${filename}.${postfix}`
}

/**
 * 遍历文件夹
 * @param {*} path 
 * @param {*} func 
 * @returns 
 */
function walkDir (fpath, func) {
  if (!fs.existsSync(fpath)) {
    return
  }

  let statParent = fs.statSync(fpath)
  if (!statParent.isDirectory()) {
    func(fpath, statParent)
    return
  }

  let files = fs.readdirSync(fpath)
  for (let i = 0; i < files.length; ++i) {
    let file = files[i]
    let filePath = path.join(fpath, file)
    let fileStat = fs.statSync(filePath)
    if (fileStat.isDirectory()) {
      walkDir(filePath, func)
    }
    func(filePath, fileStat)
  }
}

/**
 * 
 * @param {*} assetData 整个预制的全数据
 * @param {*} nodeInfo 单个节点
 * @param {*} treePath 当前遍历节点的路径
 * @param {*} callback 回调
 */
 function _loopTree (assetData, nodeInfo, treePath, callback) {
  let name = nodeInfo['_name'] || ''
  if (nodeInfo != null) {
    // 回调处理
    callback(assetData, nodeInfo, treePath)
    
    // 遍历子节点
    if (nodeInfo['_children'].length > 0) {
      let children = nodeInfo['_children']
      for (let i = 0; i < children.length; ++i) {
        _loopTree(assetData, assetData[children[i]['__id__']], treePath != '' ? `${treePath}/${name}` : `${name}`, callback)
      }
    }
  }
}

function walkAssetTree (path, callback) {
  let assetData = ffs.readJsonSync(path)
  _loopTree(assetData, assetData[1], '', callback)
}
