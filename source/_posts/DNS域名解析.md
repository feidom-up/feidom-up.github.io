---
title: DNS域名解析
date: 2020-07-28 08:52:35
tags: 前端性能优化
categories: 前端性能优化
---
DNS: domain name system  

*作用：将域名解析到对应的ip地址*
*解析原理：分级解析*

* 域名分级(一级，二级，三级)
    `www.baidu.com`
    `com`是根域名，`baidu.com`是一级域名（顶级域名），`www.baidu.com`是二级域名

* ip
    分为ipv4，ipv6

* 解析详解
    ![解析图解](http://qcukvp3iz.bkt.clouddn.com/dns%E8%A7%A3%E6%9E%90.png)
    1. www.baidu.com?
    2. com = 1.1.1.1 （TLD服务器地址）
    3. www.baidu.com?
    4. baidu.com = 2.2.2.2 （名称服务器地址 name server）
    5. www.baidu.com?
    6. www.baidu.com = 3.3.3.3 （目标ip地址）

dns缓存可以使解析更快响应。