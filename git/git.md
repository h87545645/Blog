# git 常用命令/错误



`错误`

### 执行 ```git clone```操作命令时报错

```
Warning: Permanently added the RSA host key for IP address 'ipxxx' to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

原因：由于未配置公钥
解决：cat ~/.ssh/id_rsa.pub 复制公钥到settting add key

### git合并分支时出现“Please enter a commit message to explain why this merge is necessary”报错的解决方法

git 在pull或者合并分支的时候有时会遇到下图这个界面


![git](https://img-blog.csdn.net/20180814133558388?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTQwMjc4NzY=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70 "git")

如果本地和远程需要合并时就会出现

按键盘上的“i”键可进入插入模式

这时可以修改最上方的黄色部分，改成你想写的合并原因

按键盘上的“Esc”键退出插入模式

最后在最下面输入“ :wq ”后按回车键即可


***
`错误`

### sourcetree时报错：openssh代理成功但服务器，拒绝了你的请求

使用sourcetree突然出现这个错误，原因未知。

解决办法：通过重新生成、添加密钥 并更新git 公钥。
