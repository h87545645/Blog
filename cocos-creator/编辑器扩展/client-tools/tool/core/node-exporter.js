'use strict'

const fs = require('fire-fs')
const path = require('fire-path')
const util = require('util')

const common = require('../common')
const utils = require('../utils/common-utils')

let nameList = {}
let sameNameList = []

let $assetData = null
let declareContent = ''

/**
 * 查找当前节点的修饰节点
 * @param {*} nodeInfo 
 */
let checkNode = (nodeInfo, path) => {
  let name = nodeInfo['_name'] || ''
  let curPath = path != '' ? `${path}/${name}` : `${name}`

  // Editor.log(`name: ${name}, curPath: ${curPath}`)
  let decorateIdx = getDecorateIndex(name)
  if (decorateIdx > -1) {
    let attributeName = name.slice(1, name.length)
    let type = getTypeByInfo(nodeInfo) || 'cc.Node' // 根据prefab内的节点信息，确定组件类型
    if (!nameList[name]) {
      declareContent += `\t${common.NodeDecorate[decorateIdx]}(${type})\n\tprotected ${attributeName}: ${type} = null;\n\n` // 拼接声明
      nameList[name] = true
    } else {
      sameNameList.push(curPath)
    }
  }

  checkChildren(nodeInfo, curPath)
}

/**
 * 查找当前节点的子节点中的修饰节点
 * @param {*} nodeInfo 节点信息
 * @param {*} path 当前节点所在路径
 * @returns 
 */
let checkChildren = (nodeInfo, path) => {
  if (!nodeInfo['_children']) return

  // 遍历
  let children = nodeInfo['_children']
  for (let i = 0; i < children.length; ++i) {
    checkNode($assetData[children[i]['__id__']], path)
  }
}

/**
 * 获取装饰器序号
 */
let getDecorateIndex = (name) => {
  for (let i = 0; i < common.NodePrefix.length; ++i) {
    if (name.indexOf(common.NodePrefix[i]) === 0) {
      return i
    }
  }
  return -1
}

/**
 * 获取节点的导出类型
 * @param {*} nodeInfo 
 * @returns 
 */
let getTypeByInfo = (nodeInfo) => {
  if (nodeInfo['_components'].length > 0) {
    let typeId = nodeInfo['_components'][0]['__id__']
    let componentInfo = $assetData[typeId]
    if (componentInfo != null) {
      let type = componentInfo['__type__']
      if (type.indexOf('cc.') >= 0 || type.indexOf('sp.') >= 0) return type

      let result = Editor.Utils.UuidUtils.decompressUuid(type)
      if (result != null) {
        let assetsInfo = Editor.assetdb.assetInfoByUuid(result)
        let assetsUrl = assetsInfo.url
        return path.basenameNoExt(assetsUrl)
      }
    }
  }
  return null
}

/**
 * 导出或更新文件
 * @param {*} content 声明内容
 * @param {*} className 类名
 * @param {*} filePath 文件路径
 */
let export2File = (content, className, filePath) => {
  // 如果文件已存在，就替换自动导出部分的内容
  if (Editor.assetdb.exists(filePath)) {
    // 获取脚本内容
    let scriptPath = Editor.url(filePath)
    let scriptContent = fs.readFileSync(scriptPath) + ''

    // 新的注入内容
    let newInjectStr = util.format(common.ReplaceContent, content)

    // 注入新的内容到脚本
    scriptContent = scriptContent.replace(common.ReplaceReg, newInjectStr)

    // 保存文件
    Editor.assetdb.saveExists(filePath, scriptContent)
  }
  // 不存在就按模版文件创建
  else {
    // 获取模版
    let tempName = 'tsTempAutoBind.ts'
    let templatePath = Editor.url(`packages://client-tools/template/${tempName}`)

    // 生成模版内容
    let scriptTemplate = fs.readFileSync(templatePath) + ''
    scriptTemplate = scriptTemplate.replace(/_CLASS_NAME_/g, className)
    scriptTemplate = scriptTemplate.replace(/_AUTHOR_/g, className)
    scriptTemplate = scriptTemplate.replace(/_DATE_/g, `${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)

    // 注入内容到模版
    let injectStr = util.format(common.ReplaceContent, content)
    scriptTemplate = scriptTemplate.replace(common.ReplaceReg, injectStr)

    // 创建新的脚本文件
    Editor.assetdb.create(filePath, scriptTemplate)
  }
}

module.exports = {
  init() {
    nameList = {}
    sameNameList = []
    declareContent = ''
  },

  dealAsset(assetInfo, newUrl) {
    if (!fs.existsSync(common.AssetFullPath)) {
      fs.mkdirsSync(common.AssetFullPath)
    }

    let url = assetInfo.url

    // 获取预制名称
    let assetName = path.basenameNoExt(url)

    // 获取导出的文件名，作为类名写入导出的脚本
    let className = path.basenameNoExt(newUrl)

    // 生成导出文件路径
    let idx = newUrl.indexOf(`/assets`)
    let exportPath = `db://${newUrl.substr(idx + 1)}`
    // 如果不包括后缀
    if (exportPath.indexOf('.ts') < 0) {
      exportPath = exportPath + '.ts'
    }

    $assetData = fs.readJsonSync(assetInfo.path)

    let assetType = $assetData[0]['__type__']

    if (assetType !== 'cc.Prefab' && assetType !== 'cc.SceneAsset') {
      Editor.Dialog.messageBox(utils.getWarnMsg(`请选中一个预制体或者一个场景文件`))
      return false
    }

    nameList = {}
    sameNameList = []
    declareContent = ''

    checkNode($assetData[1], '')

    // 如果有同名的属性声明，则。。。
    if (sameNameList.length > 0) {
      let warn = sameNameList.join('\n')
      Editor.log('export warn - same name::' + warn)
      Editor.Dialog.messageBox(utils.getWarnMsg(`有命名重复请修改`))
      return
    }

    // if (declareContent) {
    // }
    export2File(declareContent, className, exportPath)

    Editor.log(`export ${assetType}: ${assetName} ==> ${exportPath}`)
  }
}
