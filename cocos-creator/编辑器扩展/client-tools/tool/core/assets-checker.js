const fs = require('fire-fs')
const path = require('fire-path')
const util = require('util')
const utils = require('../utils')

let $assetPath = ''
let $assetData = null
let uuidMap = {}

function _loopAssetInfo ($assetData, componentInfo, filePath) {
  if (componentInfo != null) {
    switch (componentInfo['__type__']) {
      case 'cc.Sprite':
      case 'cc.Mask':
        printAssetInfo(componentInfo['_spriteFrame'], filePath)
        printAssetInfo(componentInfo['_atlas'], filePath)
        break
      case 'cc.Button':
        printAssetInfo(componentInfo['_N$normalSprite'], filePath)
        printAssetInfo(componentInfo['_N$pressedSprite'], filePath)
        printAssetInfo(componentInfo['pressedSprite'], filePath)
        printAssetInfo(componentInfo['_N$hoverSprite'], filePath)
        printAssetInfo(componentInfo['hoverSprite'], filePath)
        printAssetInfo(componentInfo['_N$disabledSprite'], filePath)
        break
      case 'sp.Skeleton':
        printAssetInfo(componentInfo['_N$skeletonData'], filePath)
        break
      case 'cc.Label':
        printAssetInfo(componentInfo['_N$file'], filePath)
        break
      case 'cc.ParticleSystem':
        printAssetInfo(componentInfo['_file'], filePath)
        printAssetInfo(componentInfo['_spriteFrame'], filePath)
        break
      case 'cc.Animation':
        let clips = componentInfo['_clips']
        for (let i = 0; i < clips.length; ++i) {
          printAssetInfo(clips[i], filePath)
        }
        break
      default:
        if (componentInfo['__type__'].indexOf(`cc.`) < 0) { // 查询脚本引用，可能存在bug
          for (let key in componentInfo) {
            if (componentInfo[key] != null) {
              let infoValues = componentInfo[key]
              switch (typeof infoValues) {
                case 'object':
                  if (Array.isArray(infoValues)) {
                    for (let i = 0; i < infoValues.length; ++i) {
                      if (infoValues[i]['__id__'] != null) {
                        _loopAssetInfo($assetData, $assetData[infoValues[i]['__id__']], filePath)
                      } else if (infoValues[i]['__uuid__'] != null) {
                        printAssetInfo(infoValues[i], filePath)
                      }
                    }
                  } else {
                    if (componentInfo[key][`__uuid__`] != null) {
                      printAssetInfo(componentInfo[key], filePath)
                    }
                  }
                  break
              }
            }
          }
        }
        break
    }
  }
}

/**
 * 查找当前节点的修饰节点
 * @param {*} nodeInfo 
 */
function checkNode (nodeInfo, path) {
  let name = nodeInfo['_name'] || ''
  let curPath = path != '' ? `${path}/${name}` : `${name}`

  if (nodeInfo['_components'] && nodeInfo['_components'].length > 0) {
    for (let i = 0; i < nodeInfo['_components'].length; ++i) {
      let typeId = nodeInfo['_components'][i]['__id__']
      _loopAssetInfo($assetData, $assetData[typeId], path)
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
function checkChildren (nodeInfo, path) {
  if (!nodeInfo['_children']) return
  // 遍历
  let children = nodeInfo['_children']
  for (let i = 0; i < children.length; ++i) {
    checkNode($assetData[children[i]['__id__']], path)
  }
}

function printAssetInfo (ids, path) {
  if (ids == null) return
  let uuids = Object.values(ids)
  for (let j = 0; j < uuids.length; ++j) {
    let assetInfo = Editor.assetdb.assetInfoByUuid(uuids[j])
    if (assetInfo.url.indexOf('db://internal/') >= 0) break

    let key = 'db://assets/resources'
    if (assetInfo.url.indexOf(`${key}`) < 0) {
      let index = assetInfo.url.indexOf(`res/pic`)
      index = index >= 0 ? index : assetInfo.url.indexOf(`res/font`)
      index = index >= 0 ? index : assetInfo.url.indexOf(`res/activity_font`)
      index = index >= 0 ? index : assetInfo.url.indexOf(`res/particle`)
      index = index >= 0 ? index : assetInfo.url.indexOf(`res/anim`)
      key = assetInfo.url.substr(0, index - 1)
    }
    if (!uuidMap[`${key}`]) uuidMap[`${key}`] = []
    uuidMap[`${key}`].push(`[${assetInfo.url}, ${uuids[j]}] => ${path}`)
  }
}

// function checkPath () {
//   Editor.log(`uuid : ${JSON.stringify(uuidMap)}`)
//   Editor.Scene.callSceneScript('client-tools', 'checkAssetPathByUuid', uuidMap, (err, content) => {
//     Editor.log(`uuid : ${content}`)
//   })
// }

module.exports = {
  init() {
    Editor.log(`AssetsChecker init`)
  },

  dealAsset(assetInfo) {
    $assetPath = utils.assetsPath(assetInfo.path)
    $assetData = fs.readJsonSync(assetInfo.path)
    uuidMap = {}

    checkNode($assetData[1], '')

    for (let key in uuidMap) {
      for (let i = 0; i < uuidMap[key].length; ++i) {
        if ($assetPath.indexOf(key) < 0 && key != 'db://assets/resources' && key != "") {
          Editor.error(`${key}:`)
          Editor.error(`${uuidMap[key][i]}`)
        } else {
          // Editor.log(`${key}:`)
          // Editor.log(`${uuidMap[key][i]}`)
        }
      }
    }
  }
}
