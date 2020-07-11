---
title: sonarqube配置及使用
date: 2020-07-11 08:47:02
tags:
- 前端工程化
- sonarqube
categories: 前端工程化
---


[sonarqube官网文档](https://docs.sonarqube.org/latest/)：代码质量的检测及管理
### 安装java环境

* 安装java环境（本地和服务器都需要）
sonarqube依赖高版本的java环境，以下内容使用jdk14
在[oracle官网](https://www.oracle.com/)下载[java](https://www.oracle.com/java/technologies/javase-jdk14-downloads.html)mac版（macOS Installer）和服务器Linux版（Linux RPM Package）。这种的不需要配环境变量，自动配好。
> 注意：不要装openjdk
* 将服务器Linux版的jdk上传到服务器并安装(pwd命令查看文件绝对路径)
`scp /Users/yingying/Downloads/jdk-14.0.1_linux-x64_bin.rpm root@8.129.182.113:/opt/`
安装jdk
`rpm -i jdk-14.0.1_linux-x64_bin.rpm`

### 安装sonarqube
* 在服务器端安装
`wget https://binaries.sonarsource.com/CommercialDistribution/sonarqube-developer/sonarqube-developer-8.4.0.35506.zip`
* sonarqube不能使用root身份启动，所以建一个sonar用户，将sonarqube-developer-8.4.0.35506.zip文件给到sonar用户。
```bash
root$ useradd sonar
root$ passwd sonar
root$ chown -R sonar sonarqube-developer-8.4.0.35506.zip
```
* 切换用户身份到sonar进行接下来的操作
```bash
sonar$ unzip sonarqube-developer-8.4.0.35506.zip
```
提示没有权限。
> 注意：在opt文件夹下解压 文件.zip。会创建一个新的文件夹存放解压文件。此时sonar用户没有opt文件夹的读写执行权限。所以报错`Permission denied`
解决：使用root身份修改文件权限。给sonar权限。
```bash
root$ chmod 754 opt
root$ chmod 777 /opt/sonarqube-developer-8.4.0.35506.zip
```
然后执行unzip，解压成功。之后进入解压文件夹下的bin目录的linux-x86-64目录
```bash
sonar$ cd /opt/sonarqube-8.4.0.35506/bin/linux-x86-64/
```


### 运行sonarqube
在这有sonar.sh启动脚本，先不着急./sonar.sh start。先使用console查看启动日志,再start
```bash
sonar$ ./sonar.sh console
sonar$ ./sonar.sh start
```
> 意外：在启动成功后，使用公网ip:端口号 访问失败。发现是阿里云安全组的问题。配置好了以后访问成功
> 意外：在装了汉化包之后，重启sonarqube，启动成功。但是访问一直pending。过一会就好了。应该是汉化包太大，在加载的原因