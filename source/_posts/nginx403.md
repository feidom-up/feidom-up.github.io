---
title: Nginx 403 Forbidden
date: 2020-07-31 16:05:22
tags:
- 问题解决
- Nginx
categories: 前端工程化
---

* 检查目录权限。权限不足的就加个权限。
```bash
    chmod -R 755 /root/feidom_blog/
```

* `nginx.conf`中的user问题
```bash
    $ vi /usr/local/nginx/conf/nginx.conf
    # user  nobody;
    # 把 user 用户名 改为 user root 或 其它有高权限的用户名称即可
    user root;
```
* centos中的selinux是否为关闭状态
查看SELinux状态：
```
$ /usr/sbin/sestatus -v
SELinux status:                 disabled
##  disabled/enabled  (关闭/开启)
```
关闭SELinux：
1. 临时关闭，不用重启机器。
`$ setenforce 0 `  #设置SELinux 成为permissive模式;
`$ setenforce 1`      #设置SELinux 成为enforcing模式
2. 修改/etc/selinux/config 文件后，重启机器使其生效。
`SELINUX=enforcing`  改为 `SELINUX=disabled`

