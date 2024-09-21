'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const common = require('../common')

const utils = require('../utils/common-utils')

let oldContent = [
  `SlotsGameDriver.getInstance[(][)]`,
  `ChessBoardController.getInstance[(][)]`,
  `SlotsModel.getInstance[(][)]`,
  `SlotsDataModel.getInstance[(][)]`,
  `SlotsGameState.getInstance[(][)]`,
  `SlotsSpinBar.getInstance[(][)]`,
  `HttpNetworkMgr.getInstance[(][)].addHandler`,
  `HttpNetworkMgr.getInstance[(][)].removeHandler`,
  `HttpNetworkMgr.getInstance[(][)].post`,
  `CocosUtils.playSpine`,
  `ModelFactory.getModel`,
  `VM[.]add`,
  `VM[.]remove`,
  `VM[.]`,
  `getComponent[(]PopupExtendHelper[)]`,
  `UICenterManager.getInstance[(][)]`,
  `UICenterManager.getInstance[(][)].blockWait`,
  `SlotsJackpot.getInstance[(][)]`,
  `CocosUtils.playParticle`,
  `CoreAdapter.getInstance[(][)]`,
  `GameConfig.getInstance[(][)]`,
  `CocosUtils.resetSpine`,
  `StringFormatFunction`,
  `LinePlayer.getInstance[(][)]`,
  `SlotsDataHelper.getInstance[(][)]`,
  `CoreUtils.abbreviateDigtal`,
  `CocosUtils.playAnimation`,
  `CocosUtils.setSpineSkin`,
  `CocosUtils.getStencilNode`,
  `CocosUtils.destroyNode`,
  `CocosUtils.stopSpine`,
  `PopupHelper.getInstance[(][)]`,
  `CocosUtils.getSpineDuration`,
  `CocosUtils.resetAnimation`,
  `CocosUtils.stopAnimation`,
  `this.onPopupOpen`,
  `Payment.getInstance[(][)]`,
  `this.Driver.Model.getShowDruation`,
  `this.Driver.showBonusBigWin`,
  `this.Driver.doUserSupport`,
  `VMCenter.bindPath`,
  `UIEffectManager.getInstance()`,
]

let newContent = [
  `this.Driver`,
  `this.Driver.ChessBoardController`,
  `this.Driver.Model`,
  `this.Driver.Model`,
  `this.Driver.GameState`,
  `this.Driver.SpinBar`,
  `HttpCenter.addListener`,
  `HttpCenter.removeListener`,
  `HttpCenter.post`,
  `SpineUtils.playSpine`,
  `singleton.get`,
  `VMCenter.addViewModel`,
  `VMCenter.removeViewModel`,
  `VMCenter.`,
  `getComponent(SlotsPopupHelper)`,
  `GamePopuper`,
  `GameBlockWait`,
  `this.Driver.Jackpot`,
  `EffectUtils.playParticle`,
  `singleton.get(CoreAdapter)`,
  `singleton.get(GameConfig)`,
  `SpineUtils.resetSpine`,
  `StringUtils`,
  `this.Driver.LinePlayer`,
  `this.Driver.Mediator`,
  `StringUtils.KMBT`,
  `EffectUtils.playAnimation`,
  `SpineUtils.setSpineSkin`,
  `NodeUtils.genStencil`,
  `NodeUtils.destroy`,
  `SpineUtils.stopSpine`,
  `singleton.get(PopupHelper)`,
  `SpineUtils.getSpineDuration`,
  `EffectUtils.resetAnimation`,
  `EffectUtils.stopAnimation`,
  `this.popupOpen`,
  `singleton.get(Payment)`,
  `this.Driver.getShowDruation`,
  `this.Driver.BigWin.showBigWin`,
  `this.Driver.UserSupport.doSupport`,
  `VMCenter.addListener`,
  `singleton.get(UIEffectManager)`,
]

module.exports = {
  deal (newUrl) {
    utils.walkDir(newUrl, (filePath, fileStat) => {
      if (!fileStat.isDirectory() && (path.extname(filePath) == '.ts' || path.extname(filePath) == '.js')) {
        Editor.log(`refresh ==> ${filePath}`)

        try {
          let scriptsContent = fs.readFileSync(filePath, 'utf-8')
          for (let i = 0; i < oldContent.length; ++i) {
            let regex = new RegExp(`${oldContent[i]}`, 'gi')
            scriptsContent = scriptsContent.replace(regex, newContent[i])
          }
          // 写入新的脚本内容
          fs.writeFileSync(filePath, scriptsContent)
        } catch (error) {
          Editor.log(error)
        }
      }
    })
  }
}
