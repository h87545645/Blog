# 记录租用腾讯云服务器的各种坑

服务器为Linux opencloud操作系统

## 安装cmake

Linux下安装CMake，安装的方式一共有三种：

通过软件包仓库安装
通过编译好的版本进行安装
从源码手动编译安装

我采用从源码手动编译安装

从[官网](https://cmake.org/download/)下载Source distributions下的压缩包

 解压
tar -zxvf cmake-3.17.0-rc2.tar.gz
cd cmake-3.17.0-rc2

 配置
./bootstrap --prefix=/usr/local/cmake

报错
```
linux Could not find OpenSSL.  Install an OpenSSL development package or   configure CMake with -DCMAKE_USE_OPENSSL=OFF to build without OpenSSL.
```
找了半天说安装openssl
```
yum install libssl-dev
```

但是安装会报错 
```
No match for argument: libssl-dev
```
opencloud 其实是兼容的Centos
所以应该执行
```
yum -y install openssl-devel安装，openssl和openssl-devel的区别简单来说就是devel这个是开发需要的头文件等东西。
```

```
CMake Error at /opt/cmake-3.26.3/Modules/CMakeTestCCompiler.cmake:67 (message):
  The C compiler

    "/usr/bin/cc"

  is not able to compile a simple test program.

  It fails with the following output:

    Change Dir: /root/ET/Public/Share/Libs/Kcp/build_linux32/CMakeFiles/CMakeScratch/TryCompile-VfgT65
```

cmake -DCMAKE_CXX_COMPILER=$(which g++)
