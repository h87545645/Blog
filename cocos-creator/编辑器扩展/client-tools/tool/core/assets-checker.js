const fs = require('fire-fs')
const path = require('fire-path')
const util = require('util')

let $assetData = null
let uuidMap = {}

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
      let componentInfo = $assetData[typeId]
      if (componentInfo != null) {
        let type = componentInfo['__type__']
        if (type == 'cc.Sprite') {
          printAssetInfo(componentInfo['_spriteFrame'], curPath)
        } else if (type == 'cc.Button') {
          printAssetInfo(componentInfo['_N$normalSprite'], curPath)
          printAssetInfo(componentInfo['_N$pressedSprite'], curPath)
          printAssetInfo(componentInfo['pressedSprite'], curPath)
          printAssetInfo(componentInfo['_N$hoverSprite'], curPath)
          printAssetInfo(componentInfo['hoverSprite'], curPath)
          printAssetInfo(componentInfo['_N$disabledSprite'], curPath)
        } else if (type == 'sp.Skeleton') {
          printAssetInfo(componentInfo['_N$skeletonData'], curPath)
        } else if (type == 'cc.Label') {
          printAssetInfo(componentInfo['_N$file'], curPath)
        } else if (type == 'cc.ParticleSystem') {
          printAssetInfo(componentInfo['_file'], curPath)
          printAssetInfo(componentInfo['_spriteFrame'], curPath)
        } else if (type == 'cc.Animation') {
          let clips = componentInfo['_clips']
          for (let i = 0; i < clips.length; ++i) {
            printAssetInfo(clips[i], curPath)
          }
        }
      }
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
    $assetData = fs.readJsonSync(assetInfo.path)
    uuidMap = {}

    checkNode($assetData[1], '')
    
    for (let key in uuidMap) {
      Editor.log(`${key}:`)
      for (let i = 0; i < uuidMap[key].length; ++i) {
        Editor.log(`${uuidMap[key][i]}`)
      }
    }
  }
}
