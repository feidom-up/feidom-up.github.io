---
title: Linux免密远程登录
date: 2020-07-07 10:51:12
tags:
- Linux
- 前端工程化
categories: Linux
---
前端在部署项目时，使用Linux免密远程登录可以实现自动化中的一环。

### 免密登录的原理
ssh，密码学，公钥，私钥

### 免密登录的步骤
> 下文中：[你自己的名字]是私钥，[你自己的名字_rsa]是公钥

* 生成密匙对

    `$ ssh-keygen -t rsa -C [你自己的名字] -f [你自己的名字_rsa]`
* 上传配置公钥
    * 上传公钥到服务器对应账号的home路径下的.ssh/中
    `$ ssh-copy-id -i [你自己的名字_rsa] [用户名@服务器ip或域名]`
    * 配置公钥文件访问权限为 600  (设置拥有者可读写，其他人不可读写执行 -rw-------)
    `$ chmod 600 [你自己的名字_rsa]`
* 配置本地私钥
    * 把第一步生成的私钥复制到你的home目录下的.ssh/ 路径下
    * 配置你的私钥文件访问权限为 600  (-rw-------,不是600系统会认为不安全拒绝访问)
     `$ chmod 600 [你自己的名字]`
    > 这一步之后已经可以免密登录`ssh -i [你自己的名字] root@[ip]`
* 免密登陆功能的本地配置文件(更方便的免密登录方式)
    * 编辑自己home目录的.ssh/ 路径下的config文件`vi config`
    ```bash
        # 多主机配置
        Host gateway-produce
        HostName IP或绑定的域名
        Port 22
        Host node-produce
        HostName IP或绑定的域名
        Port 22
        Host java-produce
        HostName IP或绑定的域名
        Port 22

        Host *-produce (多主机别名，免密登录时可以使用这个别名登录)
        User root
        IdentityFile ~/.ssh/你自己的名字_rsa
        Protocol 2
        Compression yes
        ServerAliveInterval 60
        ServerAliveCountMax 20
        LogLevel INFO

        #单主机配置
        Host feidom-cloud (别名，免密登录时可以使用这个别名登录)
        User root
        HostName IP或绑定的域名
        IdentityFile ~/.ssh/你自己的名字_rsa
        Protocol 2
        Compression yes
        ServerAliveInterval 60
        ServerAliveCountMax 20
        LogLevel INFO

        #单主机配置
        Host feidom2-site
        User git
        HostName IP或绑定的域名
        IdentityFile ~/.ssh/你自己的名字_rsa
        Protocol 2
        Compression yes
        ServerAliveInterval 60
        ServerAliveCountMax 20
        LogLevel INFO
    ```
    * 配置config文件的访问权限为 644
    > 使用`ssh [别名]`
