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
`$ scp /Users/yingying/Downloads/jdk-14.0.1_linux-x64_bin.rpm root@8.129.182.113:/opt/`
安装jdk
`$ rpm -i jdk-14.0.1_linux-x64_bin.rpm`

### 安装sonarqube
* 在服务器端安装Community版本
`wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-8.4.0.35506.zip`
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
sonar$ cd /opt/sonarqube-8.4.0.35506/bin/linux-x86-64/
sonar$ ./sonar.sh console
sonar$ ./sonar.sh start
```
> 意外：在启动成功后，使用公网ip:端口号 访问失败。发现是阿里云安全组的问题。配置好了以后访问成功
> 意外：在装了汉化包之后，重启sonarqube，启动成功。但是访问一直pending。过一会就好了。应该是汉化包太大，在加载的原因

### 初始化一个项目（test）
以下操作都可以在公网ip:9000项目中可视化操作
1. 使用公网ip:9000访问到sonarqube
2. 使用默认账号/密码：admin/admin登陆
3. 手工设置一个项目：test
4. 设置一个token（客户端会用到的口令）
5. 开始分析项目
6. 选择项目的主要语言：其他（js）
7. 选择客户端的操作系统（macOS）
8. [下载并解压macOS平台的解析器SonarScanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)，是一个zip文件
9. 为SonarScanner配置环境变量
配置～/.bash_profile
```bash
# sonar-scanner 环境变量  pwd找到sonar-scanner目录下的bin文件夹路径
export SCANNER_HOME="/Users/yingying/Documents/qwf/libs/sonar-scanner-4.4.0.2170-macosx"
export PATH=$PATH:$SCANNER_HOME/bin
```
使环境变量生效
`$ source .bash_profile`
可以执行`$ sonar-scanner -v`来查看是否配置安装成功
10. 在项目（例：nodejs-demo）中配置SonarScanner
在项目根目录新建`sonar-project.properties`文件。
``` bash
sonar-scanner \
  # 项目名
  -Dsonar.projectKey=test \
  # 要扫描的代码目录
  -Dsonar.sources=. \
  # 要上报报告的服务器链接
  -Dsonar.host.url=http://8.129.182.113:9000 \
  # token
  -Dsonar.login=a258647adea0e982df705ac3512cbbe47154cfd3
```
11. 在终端 shell 执行你的这个 sonar-project.properties 文件`bash sonar-project.properties`。静静等待10分钟左右...
12. 结果报表会在公网ip:9000中可视化展示

### 数据库配置
* 自带的内嵌数据库比较小。处理大项目需要配一下
* sonarQube默认不支持mysql。需要安装[mysql Connector(驱动)](https://dev.mysql.com/downloads/connector/j/)后才能使用
安装方式：将驱动放在`extensions/jdbc-driver/mysql/`（这个路径不确定）下
* 配置文件：/opt/sonarqube-8.4.0.35506/conf/sonar.properties
```
sonar.jdbc.url=jdbc:mysql://192.168.1.222:3306/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true
```
* 在使用库使，要提前建立好sonar库，命令参照如下：
``` mysql
DROP DATABASE sonar;

CREATE DATABASE sonar CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE USER 'sonar' IDENTIFIED BY 'sonar';

GRANT ALL ON sonar.* TO 'sonar'@'%' IDENTIFIED BY 'sonar';

GRANT ALL ON sonar.* TO 'sonar'@'localhost' IDENTIFIED BY 'sonar';

FLUSH PRIVILEGES;
```

### 结束
[详细操作链接](https://hondrytravis.github.io/blog/engineering/sonar.html#sonar)