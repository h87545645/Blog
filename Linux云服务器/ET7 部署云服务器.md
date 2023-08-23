# ET7 部署云服务器
以腾讯云OpenCloudOS(CentOS)为例 主要参考[ET7.0 腾讯云centos部署](https://blog.csdn.net/liyuping8888/article/details/126859161)
对linux还不太熟悉 所以主要记录一下ET在linux上的问题
## build
在rider中右键工程，biuld,
成功后将Bin 文件夹放到云服务器上 
可能会遇到
1） Unable to load shared library ’kcp
这是因为linxu上没有kcp的库
然后我去安装了cmake，按教程在linux上编kcp库，又发现32位的死活编不成功
遂换成64位，终于成功
可以看到工程里存放库的文件夹
![plugins](https://github.com/h87545645/Blog/blob/main/unity3d/img/ET_plugins.png)

然后是解决方案DotNet.ThirdParty.csproj里可以看到对应引用
![ThirdParty](https://github.com/h87545645/Blog/blob/main/unity3d/img/libkcp.so.png)

而部署在云上的部分，只需要将编译好的libkcp.so直接放到Bin下面即可

## 开服设置
打开Nlog.config 文件， 将 <rules> 中对应规则的输出注释掉只留需要的log，否则logs里文件一天就能塞满磁盘。

在Bin目录下，执行
```
nohup dotnet App.dll —Process=1 —Console=0 —LogLevel=4 —StartConfig=StartConfig/Release&
```

nohup 是为了让服务器不中断执行，否则退出云服务器登陆后，程序就挂了。
需要注意正式上线时 —Console=0 一定要为0 ，console 开启时，会一直将log写入 nohup.out ,
此文件会以 1M/s 的速度增大。
