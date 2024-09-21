#  记录用到的一些cocos creator编辑器扩展



## 检查bundle包内非法资源

===================================================================================================

2024/9/21 更新

以前的思路是拿到所有资源json, 再和工程内其他bundle里的资源meta文中的uuid做匹配

matchUUID函数
```
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
```
只要能匹配到，就认定为非法资源引用。

今天发现creator 里自带的 Editor.assetdb.assetInfoByUuid(uuid) 方法 

可以直接提供uuid 找到其对应的资源路径



===================================================================================================

2024/9/21 更新

由于bundle中的资源需要下载，如果引用了其他bundle里的资源，但是那个bundle又还未下载的话，就会出现资源缺失

此工具主要流程是指定遍历记录一个bundle下的规定资源，然后与其余所有bundle的资源uuid进行比较，如果有相同的则不合规

首先在项目package目录创建文件夹

![package](https://github.com/h87545645/Blog/blob/main/cocos-creator/img/packageDir.png)

package.json是编辑器菜单的入口配置
```js
{
  "name": "check-invaild-res",
  "version": "0.0.1",
  "description": "检查bundle使用了非法资源",
  "author": "Cocos Creator",
  "main": "main.js",
  "main-menu": {
    "扩展/检查bundle使用了非法资源/check-bundles-invaild": {
      "message": "check-invaild-res:check-bundles-invaild"
    }
  }
}


```

main 指定了工具入口


[检查非法资源](https://github.com/h87545645/Blog/tree/main/cocos-creator/%E7%BC%96%E8%BE%91%E5%99%A8%E6%89%A9%E5%B1%95/check-unused-invaild-res)

## 生成资源配置

流程和上面一样，主要逻辑是资源文件夹，匹配规定的资源格式，根据文件名字生成资源配置json，并输出到指定目录成json文件

[生成资源配置](https://github.com/h87545645/Blog/tree/main/cocos-creator/%E7%BC%96%E8%BE%91%E5%99%A8%E6%89%A9%E5%B1%95/client-tools)

