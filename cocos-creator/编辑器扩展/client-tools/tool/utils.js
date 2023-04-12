const fs = require('fs')
const path = require('path')
const fpath = require('fire-path')
const consts = require('./common')

module.exports = {
  getWarnMsg,
  assetsFullPath,
  walkDir,
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
function assetsPath (abPath) {
  let index = abPath.indexOf(`assets`)
  return `db://${abPath.substring(index)}`
}

/**
 * 遍历文件夹
 * @param {*} path 
 * @param {*} func 
 * @returns 
 */
function walkDir (path, func) {
  if (!fs.existsSync(path)) {
    return
  }

  let statParent = fs.statSync(path)
  if (!statParent.isDirectory()) {
    func(path, statParent)
    return
  }

  let files = fs.readdirSync(path)
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    let filePath = path.join(path, file)
    let fileStat = fs.statSync(filePath)
    if (fileStat.isDirectory()) {
      func(filePath, fileStat)
      walkDir(filePath, func)
    } else {
      func(filePath, fileStat)
    }
  }
}
