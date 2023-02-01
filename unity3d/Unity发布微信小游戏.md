# Unity发布微信小游戏踩坑

首先按照[Unity WebGL 微信小游戏适配方案](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform)安装unity插件.

主要记录转换过程中遇到的问题

* 1.字体资源压缩

由于textMeshPro不支持中文，需要自己制作中文字体。

导入中文字体后会发现字体非常大，可能有10多M，而微信小游戏要求首包不超过20M，所以还需要压缩字体文件，简单来说就是去掉生僻字，只留下常用的字符。

推荐使用百度的开源工具[fontmin](https://github.com/ecomfe/fontmin)

不要使用fontmin的客户端程序，因为客户端会自动去除空格字符，导致压缩后不能打空格。直接用node.js 执行Fontmin.glyph 参数选择trim : false
```javascript
    .use(Fontmin.glyph({        // 字型提取插件
        text: text,            // 所需文字
        trim: false
    }))
```

压缩后的字体只剩几百k。

嫌麻烦也可以直接用别人弄好的[Unity-TextMeshPro-Chinese-Characters-Set](https://github.com/wy-luke/Unity-TextMeshPro-Chinese-Characters-Set)

还有就是textMeshPro导入后千万不要删除它自带的一些字体，否则打包微信小游戏后会报错，但是在编辑器运行确没任何问题。[如果不小心删了可以看这里]()

* 2.小游戏资源部署

微信小游戏对包体大小有严格要求，所以最好打包时只留下启动场景，其他场景和资源打包成assetsbundle放到服务器cdn加速。

一开始我找了很多cdn的方案，费用都比较贵，而且大多需要自己备案域名，域名购买又是一笔费用，后来发现可以直接使用[微信云托管的对象储存](https://cloud.weixin.qq.com/cloudrun/storage)功能

![微信云托管](https://github.com/h87545645/Blog/blob/main/unity3d/img/wechat_storage.png "对象储存")

把代码和assetsbundle都上传，然后cdn地址填好就行了。



