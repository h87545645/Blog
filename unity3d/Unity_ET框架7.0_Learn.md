# ET7.0框架使用记录

22年经过一年的学习和努力，终于完成了一个类JumpKing的游戏demo,并测试发布到了微信小游戏。

但是离正式发布越近越觉得动力不足，高情商来说就是游戏不够有趣，低情商来说就是觉得做了个垃圾发布到底有什么意思。

春节和家人朋友一起玩马里奥派对的时候，我就在想为什么任天堂的游戏总是能让人觉得有趣。

主要的当然是任天堂一贯的玩法优先，本身游戏的机制和玩法足够有趣。但是马里奥派对这种游戏的有趣不仅来自玩法和机制的有趣，还有一个重要的原因则是它可以和好友一起玩，并且在与好友合作与竞争中让一个个小游戏带来的快乐翻倍。

所以我也萌生了把我的demo改造成一个能让玩家间合作竞争的想法。

但是我并不会服务器相关技能，于是决定从头开始学习服务器技术，在了解服务器方案的过程中看到了ET框架，突然想起曾经的一个同事有一段时间热衷于研究ET框架总是把ET框架挂在嘴边，虽然如今他已经不再游戏行业，我还是马上请教了他ET框架改造demo的可能性。

ET框架能方便的进行双端开发，并且自带ILRuntime热更新，一开始觉得完美符合我的需求。实际使用下来发现其使用ECS模式特别反人类，特别是习惯了OOP开发后。一段代码逻辑可能被拆到3个地方，对于逻辑理解和代码阅读调试非常不友好，并且刚开始无从下手，纠结什么该归为Entity,什么该归为component。也许万事开头难吧，熟练后希望能体会到ECS易维护的好处。

目前我想还是先使用ET完成demo的联机改造，以后有机会再学习加入更成熟的GameFramework框架。

关于[ET 和 GameFramework对比](https://blog.csdn.net/yupu56/article/details/106993157)

ET目录结构

![ET目录结构](https://github.com/h87545645/Blog/blob/main/unity3d/img/ET.png)

客户端文件结构

![客户端文件结构](https://github.com/h87545645/Blog/blob/main/unity3d/img/ET_Client.png)

下面将记录使用ET过程中遇到的问题经验总结


# 1.部署

参考荷兰猪小灰灰[ET框架-开发环境搭建](https://blog.csdn.net/m0_48781656/article/details/123012935)

# 2.运行demo

启动服务器后，打开init场景运行，可能会遇到空对象报错，需要在菜单栏Tool->build debug code 一次。图片以后补充。

# 3.导出excel表 执行win_startExcelExport时报错没有 tool.dll 


![win_startExcelExport](https://github.com/h87545645/Blog/blob/main/unity3d/img/ET_excel_err.png "win_startExcelExport")

一开始去下载tool.dll，然后又出现其他dll没有，也没有找到其他人用ET出现此问题，所以怀疑是工程哪里没设置对。

用visual studio 打开Client-Server.sln后 选择整个解决方案，重新build工程后解决。

# 4.使用textmeshpro 无法引用问题

ET6.0后使用程序集来编写代码，code没有放在工程里，所有新的插件无法引用。

需要找到对应程序集文件设置 .asmdef文件
![asmdef文件](https://github.com/h87545645/Blog/blob/main/unity3d/img/asmdef文件.png "asmdef文件")

将对应assembly definition references 加入

# 5.使用HybridCLR打包时报错
HybridCLR->generate=>all报错 GenerateStripedAOTDlls 失败

![buildError](https://github.com/h87545645/Blog/blob/main/unity3d/img/buildError.png)

需要清理build 

![cleanBuild](https://github.com/h87545645/Blog/blob/main/unity3d/img/cleanBuild.png)


# 6.将场景设置成AssetBundle后不能加载

[将场景设置成AssetBundle后不能加载](https://et-framework.cn/d/1380-assetbundle)

目的是将场景打成AssetBundle方便热更

在buildsetting 取消勾选后报错

解决方法：在startScene里配置所有场景

# 7.接入yooAssets资源管理
参照yooAssets官方例子，将资源分为代码dll，预制dll，UI dll etc. 
在ET框架的 init.cs中，在执行codeLoader之前，加入yooAssets热更的逻辑
并将ET中所有使用AB包加载的地方改为yooAssets的API来加载

游戏开始时，走下载热更逻辑，热更结束后再正常codeLoader加载dll代码。

yooAssets 打包出来的资源直接丢到cdn桶里

# 8.部署云服务器

[部署流程](https://github.com/h87545645/Blog/blob/main/Linux%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8/ET7%20%E9%83%A8%E7%BD%B2%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8.md)



# 9.打包流程

## ET->BuildTool->BuildHotFix&Model
这一步会生成代码的dll文件并拷贝到Bundles/Codes下

## Hybridclr->generate->all
Hybridclr的傻瓜式一键生成所有

## ET->BuildTool->buildpackage 
打包

## Hybridclr->copyAot
这一步是将补充元数据拷贝到Bundles/Aot目录

## ET->BuildTool->buildpackage 
再次打包

## YooAssets->build
将生成的dll用YooAssets打包,将打包后的资源放到CDN上



//TODO 补充截图 自动化打包

# 10.ET中monobehavior如何与热更层通信

ET的设计模式要求hotfix中全是静态类，并且不能有任何继承（ECS）

而很多时候又需要用到monobehavior的功能，如scrollRect和碰撞检测等，在碰撞后需要通知hotfix层执行逻辑

在mono层通过ET的事件组件发送事件通知hotfix层，scene是root

事件定义我放在了ThridParty里，放在外面死活不行。
并且mono层的代码必须放到loader文件夹下，否则打包后Hybridclr生成的桥接函数里将不包含事件导致报错


