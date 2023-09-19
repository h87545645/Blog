# 制作一个隐私政策网页

以腾讯云轻量级云服务器为例


## 1.在腾讯云官网直接搜索WordPress

找到[手动搭建 WordPress 个人站点（Linux）](https://cloud.tencent.com/document/product/213/8044)

按照步骤部署即可，需要注意的是第5步

```
执行以下命令，设置 root 账户密码。
说明
MariaDB 10.4 在 CentOS 系统上已增加了 root 账户免密登录功能，请执行以下步骤设置您的 root 账户密码并牢记。

ALTER USER root@localhost IDENTIFIED VIA mysql_native_password USING PASSWORD('输入您的密码');

```

在OpenCloudOS上不成功

正确的方式是
```
ALTER USER 'mysqlUsername'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysqlUsernamePassword';

```
这一步不设置对，最后wordpress 会报建立数据库连接时出错`，错误信息

部署完成后 在目录下 wp-admin登陆，然后就可以编辑自己的网页了


部署完成后 访问 http://43.136.240.126/wordpress/wp-login 登陆
