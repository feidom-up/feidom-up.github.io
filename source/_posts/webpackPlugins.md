---
title: webpackPlugins
date: 2021-05-28 10:07:55
tags:
- 前端工程化
- webpack
categories: webpack
---

#### webpack.DefinePlugin

* 简介
  在编译时创建一个可以配置的全局变量，在区分开发模式｜生产模式的不同时十分有用。
* 使用：
  * 在webpack的plugins中，增加`webpack.DefinePlugin(Object)`的实例
  * 方法中传入的Object的key值，可以在项目所有import的文件中使用。
  * 使用时得到的是key对应额value，这里在编译时，并不是变量的引用，而是**编译时直接替换**
  > 因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')。
* 文档地址
  * [webpack.DefinePlugin](https://v4.webpack.docschina.org/plugins/define-plugin/)