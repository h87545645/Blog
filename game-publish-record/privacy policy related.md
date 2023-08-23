# 隐私政策展示

国内上架游戏如果app内获取了用户的ANDROID ID等隐私数据 需要在获取前引导用户同意隐私政策，否则将被拒绝。

当前游戏在玩家授权隐私政策协议前就有获取安卓ID和传感器列表的行为，可以参考以下三种解决方案处理：
方案一
[将 Unity 项目导出为 Android 工程，在 Android Studio 中为游戏新增一个上层 Activity用于进行隐私政策展示与授权](https://taptap-privacy-compliance.oss-cn-shanghai.aliyuncs.com/report/Unity%E5%AF%BC%E5%87%BA%E5%AE%89%E5%8D%93%E5%B7%A5%E7%A8%8B%E5%B9%B6%E6%96%B0%E5%BB%BAactivity%E7%94%A8%E4%BA%8E%E6%94%BE%E7%BD%AE%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE.pdf)
---
方案二
1、建议您更新 CN 版本的 Unity 到最新的 LTS 版本；
2、检查 Unity Analystics 相关服务，先把 Analysitics 做一个延迟初始化（默认是启动 Unity 即初始化），待隐私同意后再进行初始化。然后查找是否用了 IAP 的包， IAP
包有缺陷，即只要工程里面含有这个包，启动必获取 Android ID，无法屏蔽，建议先移除这个包再重新打包。
---
方案三
也可不导出到Android Studio，[参考如下方案：](https://blog.csdn.net/final5788/article/details/127229381)

我用的第三个方案，总的来说非常方便

如果有云服务器的话，可以自己做一个隐私政策网页，不用购买域名也行。

如何制作[隐私政策网页](https://github.com/h87545645/Blog/blob/main/game-publish-record/privacy%20policy%20website.md)
