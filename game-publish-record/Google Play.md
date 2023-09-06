# Google Play 上架
## 注册谷歌开发者账号
按照要求填写信息，支付$25

## unity打包设置
TODO

## Android 11获取应用列表 android.permission.QUERY_ALL_PACKAGES
上传到谷歌后台后提示应用里使用了android.permission.QUERY_ALL_PACKAGES，使用了拉去本地已安装应用权限会出现这个警告，只有去除
但是在unity中搜索不到哪里用了，也不知道如何去除。

最后将unity工程导出成Android studio工程后，在AS里全局搜索QUERY_ALL_PACKAGES
![img](https://github.com/h87545645/Blog/blob/main/image/as_QUERY_ALL_PACKAGES.png)

将后面的on改成off即可。
