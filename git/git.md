# git 常用命令/错误



`错误`

执行 ```git clone```操作命令时报错

```
Warning: Permanently added the RSA host key for IP address 'ipxxx' to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

原因：由于未配置公钥
解决：cat ~/.ssh/id_rsa.pub 复制公钥到settting add key