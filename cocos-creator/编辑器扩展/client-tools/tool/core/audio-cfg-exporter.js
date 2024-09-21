const fs = require('fs')
const path = require("fire-path");


let json_obj = {}

const right_type = new Array("avi", "wmv", "mpg", "mpeg", "mov", "rm", "ram", "swf", "flv", "mp4", "mp3", "wma", "avi", "rm", "rmvb", "flv", "mpg", "mkv")

/**
 * 搜索文件
 * @param { 搜索路径 } searchPath 
 * @param { 是否深度搜索 } isDeepSearch 
 * @param { 后缀 } extName 
 * @param { 前缀 } prefixName 
 * @returns  
 */
function searchFile(searchPath, isDeepSearch , jsonObj) {

  if (!searchPath || !fs.existsSync(searchPath)) {
    Editor.log("[Utils - searchFile]: searchPath is not exist");
    return;
  }
  Editor.info(` --------------- audio-cfg-exporter searchFile statParent --------------- `);
  let statParent = fs.statSync(searchPath)
  if (!statParent.isDirectory()) {
    Editor.log("searchPath is not directory");
    return;
  }
  Editor.info(` --------------- audio-cfg-exporter searchFile start --------------- `);
  _walkDirForSeachFile(searchPath, isDeepSearch, jsonObj, searchPath);
}

/**
 * 遍历搜索文件
 * @param { 搜索路径 } searchPath  
 * @param { 是否深度搜索 } isDeepSearch 
 * @param { 搜索到的文件名对象 } nameList 
 */
function _walkDirForSeachFile(searchPath, isDeepSearch, jsonObj , rootPath) {
  let files = fs.readdirSync(searchPath);
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    const filePath = path.join(searchPath, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      // Editor.info(` --------------- audio-cfg-exporter DFS SEARCH : ${filePath} --------------- `);
      _walkDirForSeachFile(filePath, isDeepSearch, jsonObj , rootPath);
    } else {

      let index = file.lastIndexOf(".");
      if (index < 0) {
        continue;
      }
     
      let suffix = path.extname(filePath).slice(1); // 去除点号并返回后缀名部分
      // Editor.info(` --------------- audio-cfg-exporter file suffix : ${suffix} , index : ${right_type.indexOf(suffix)}--------------- `);

      if (right_type.indexOf(suffix) >= 0) {
        let name = path.basename(filePath, path.extname(filePath));
        Editor.info(` --------------- audio-cfg-exporter audio name : ${name} --------------- `);
        let filePathWithoutSuffix = path.join(searchPath, name);
        filePathWithoutSuffix = path.relative(rootPath, filePathWithoutSuffix);
        Editor.info(` --------------- audio-cfg-exporter filePathWithoutSuffix: ${filePathWithoutSuffix} --------------- `);
        jsonObj[name] = filePathWithoutSuffix;
      }
    }
  }
}

/**
 * 导出或更新文件
 * @param {*} content 声明内容
 * @param {*} filePath 文件路径
 */
let export2File = (content, filePath) => {

  // 如果文件已存在，就替换自动导出部分的内容
  if (Editor.assetdb.exists(filePath)) {
    // 保存文件
    Editor.assetdb.saveExists(filePath, content)
  }
  // 不存在就按模版文件创建
  else {
    // 创建新的配置文件
    Editor.assetdb.create(filePath, content)
  }
}





module.exports = {
  init() {
    json_obj = {}
  },

  dealAsset(filePath, newUrl) {
    if (!fs.existsSync(filePath)) {
      Editor.log(`audioExport: ${filePath} is not exist`);
      return;
    }
    let fileStat = fs.statSync(filePath);
    if (!fileStat.isDirectory()) {
      Editor.log(`audioExport: ${filePath} is not directory`);
      return;
    }
    Editor.info(` --------------- doExportAudioCfg serch file path : ${filePath} --------------- `);
    //遍历所有文件名，写入json
    searchFile(filePath, true , json_obj);
    if (JSON.stringify(json_obj) === '{}') {
      Editor.log(`audioExport: no files found`);
      return;
    }

    Editor.info(` --------------- doExportAudioCfg json_obj ${json_obj} --------------- `);
    // 获取导出的文件名，作为类名写入导出的脚本
    let className = path.basenameNoExt(newUrl)
    Editor.info(` --------------- doExportAudioCfg className ${className} --------------- `);
    //生成json配置
    // 生成导出文件路径
    let idx = newUrl.indexOf(`/assets`)
    let exportPath = `db://${newUrl.substr(idx + 1)}`
    // 如果不包括后缀
    if (exportPath.indexOf('.json') < 0) {
      exportPath = exportPath + '.json'
    }
    Editor.info(` --------------- doExportAudioCfg exportPath ${exportPath} --------------- `);
    export2File(JSON.stringify(json_obj), exportPath)
    Editor.info(` --------------- audio-cfg-exporter finish  --------------- `);
  }
}