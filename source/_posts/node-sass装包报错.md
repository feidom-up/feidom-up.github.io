---
title: node-sass装包报错
date: 2020-08-17 16:27:58
tags:
- 问题解决
- 安装依赖问题
---
### node-sass安装依赖error: node-sass: Command failed报错解决
好好的yarn install。 报一个下图的错。
![nodeSassError](http://i.feidom.com/nodeSassError.jpg)

**问题原因**：查看报错信息，再查找资料。可能是被墙了。
**解决办法**：将 sass-binary-site 添加至 yarn/npm config 中,指定node-sass在淘宝源中下载
```
yarn config set sass-binary-site https://npm.taobao.org/mirrors/node-sass
npm config set sass-binary-site https://npm.taobao.org/mirrors/node-sass
```
    
> 爬坑记录一下