#  记录用到的一些cocos creator编辑器扩展



## 检查bundle包内非法资源


首先在项目package目录创建文件夹

![package](https://github.com/h87545645/Blog/blob/main/cocos-creator/img/packageDir.png)

package.json是编辑器菜单的入口配置
```js
{
  "name": "check-unused-res",
  "version": "0.0.1",
  "description": "检查未使用的资源",
  "author": "Cocos Creator",
  "main": "main.js",
  "main-menu": {
    "扩展/检测bundle中未使用的资源/check-bundles": {
      "message": "check-unused-res:check-bundles"
    }
  }
}

```

main 指定了工具入口
