---
title: linux下常用命令查看端口占用
date: 2020-07-11 15:07:02
tags:
- Linux
categories: 前端工程化
---
* 查看当前所有tcp端口
`$ netstat -ntlp`
* 查看所有9000端口使用情况
`netstat -ntulp | grep 3306`