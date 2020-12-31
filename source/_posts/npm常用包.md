---
title: npm/yarn及其他包管理工具常用总结
date: 2020-08-02 09:32:06
categories: npm
tags: 
- yarn
- npm
---
* 安装
    * npm
    装了`nodeJs`会装好npm

    * yarn 
    [安装yarn](https://yarn.bootcss.com/docs/install/)

    `npm install -g yarn`
* 修改源
    * npm (淘宝源 ｜ 本源)
    `npm config set registry http://registry.npm.taobao.org/`
    
    `npm config set registry https://registry.npmjs.org/`

    * yarn (淘宝源 ｜ 本源)
    `yarn config set registry http://registry.npm.taobao.org/`
    
    `yarn config set registry https://registry.npmjs.org/`
* 设置代理
    * npm 
    `npm config set proxy http://127.0.0.1:8080`
    
    `npm config set https-proxy http://127.0.0.1:8080`
    * yarn 
    `yarn config set proxy http://127.0.0.1:8080`
    
    `yarn config set https-proxy http://127.0.0.1:8080`
* 删除代理
    * npm
    `npm config delete proxy` 
    
    `npm config delete https-proxy`
    * yarn
    `yarn config delete proxy` 

    `yarn config delete https-proxy`
* 查看安装包
    * npm
    `npm list -g --depth 0`
    * yarn
    `yarn global list --depth=0`


> <font color=red size=5>npx</font> 
    npx 是 npm 5.2+ 版本之后自带的工具，能够帮助我们更高效的执行 npm 软件仓库里的安装包。对于那些不常使用、或者只想一次性尝试的工具，推荐使用 npx 的方式代替 npm install -g、yarn global 全局安装
    $ npx create-react-app my-app
    # 执行以上这条命令 npx 会按以下顺序工作：
    # 1. 先查看当前项目有没 create-react-app
    # 2. 如果当前项目找不到，会去全局查找 create-react-app
    # 3. 如果全局还找不到，会帮我们临时从 npm 包仓库安装 create-react-app，不会污染到当前项目，也不会装到全局