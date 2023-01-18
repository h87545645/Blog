# 记录一个使用TextMeshPro的大坑
为了做中文多语言创建了中文的裁剪字体，在编辑器里运行都没问题，但是在微信小游戏测试打包assetbundle后,包含我的字体的assetbundle疯狂报错，并且只有在assetbundle里才会出问题。
最后终于找到了原因，是因为没有导入TMP的基本资源，可能是之前被我自己删掉了。可以在Window - TextMeshPro - Import TMP Essential Resources menu item重新导入

![Please assign a Font Asset to this TextMeshPro gameobj]([https://github.com/h87545645/Blog/tree/main/unity3d/img](https://github.com/h87545645/Blog/blob/main/unity3d/img/QQ%E6%88%AA%E5%9B%BE20230118232054.png) "unity 论坛")
[论坛链接](https://forum.unity.com/threads/please-assign-a-font-asset-to-this-textmeshpro-gameobj.1022008/)




