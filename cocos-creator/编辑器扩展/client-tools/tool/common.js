const path = require('fire-path')
const fs = require('fire-fs')

module.exports = {
  ProjectPath: Editor.Project.path, // 工程路径
  AssetFullPath: path.join(Editor.Project.path, 'assets'), // assets全路径

  ReplaceReg: new RegExp(`\/\/--Don't change, auto-generated properties start--[\\w\\W]*//--Don't change, auto-generated properties complete--`),
  ReplaceContent: `//--Don't change, auto-generated properties start--\n%s\t//--Don't change, auto-generated properties complete--`,

  NodePrefix: ['$', '&'], // 导出标识
  NodeDecorate: ['@auto', '@property'] // 装饰器
}
