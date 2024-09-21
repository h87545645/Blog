const fs = require("fs");
const path = require("path");

module.exports = {
    matchUUID,
    searchFile
}

/**
 * 匹配 uuid
 * @param { 资源名 } resName 
 * @param { UUID } uuid 
 * @param { 搜索 uuid 的 jsonMap } foundJsonMap 
 * @returns 
 */
function matchUUID(resName, uuid, foundJsonMap) {
    if (foundJsonMap.size === 0) {
      Editor.log('_matchUUID - foundJsonMap size is 0')
      return;
    }

    for (let [key, value] of foundJsonMap) {
      let jsonStr = JSON.stringify(value);
      if (jsonStr.indexOf(uuid) !== -1) {
        Editor.error(`${key} is invalid resName is ${resName}`);
      }
    }
}

/**
 * 遍历搜索文件
 * @param { 搜索路径 } searchPath  
 * @param { 是否深度搜索 } isDeepSearch 
 * @param { 搜索到的文件 jsonmap } resMap 
 * @param { 后缀 } extName 
 * @param { 前缀 } prefixName 
 */
function _walkDirForSeachFile(searchPath, isDeepSearch, resMap, extName = "", prefixName = "",exceptPath = "") {
    let files = fs.readdirSync(searchPath);
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        const filePath = path.join(searchPath, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            if (exceptPath == filePath) {
                continue;
            }
            _walkDirForSeachFile(filePath, isDeepSearch, resMap, extName, prefixName,exceptPath);
        } else {
            const isMatchExtName = file.endsWith(extName);
            const isMatchPrefix = file.startsWith(prefixName);
    
            if (isMatchExtName && isMatchPrefix) {
                let fileContent = fs.readFileSync(filePath);
                let jsonObj = JSON.parse(fileContent);
                resMap.set(file, jsonObj);
            }
        }
    }
}

/**
 * 搜索文件
 * @param { 搜索路径 } searchPath 
 * @param { 是否深度搜索 } isDeepSearch 
 * @param { 后缀 } extName 
 * @param { 前缀 } prefixName 
 * @returns  { <文件名, jsonObj> } map
 */
function searchFile(searchPath, isDeepSearch, extName = "", prefixName = "" , exceptPath = "") {
    let map = new Map();

    if (!searchPath || !fs.existsSync(searchPath)) {
        Editor.log("[Utils - searchFile]: searchPath is not exist");
        return map;
    }

    let statParent = fs.statSync(searchPath)
    if (!statParent.isDirectory()) {
        return map;
    }

    _walkDirForSeachFile(searchPath, isDeepSearch, map, extName, prefixName , exceptPath);

    return map;
}