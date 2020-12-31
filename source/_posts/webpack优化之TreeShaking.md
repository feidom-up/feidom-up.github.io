---
title: webpack优化之tree-shaking
date: 2020-12-21 13:57:47
tags: 
- 前端工程化
- webpack
categories: webpack
---

#### tree-shaking

* 静态分析，不是动态分析
* 代码不会被执行到，就不会打包到bound.js
* 必须使用ES6的语法(import、export)才支持tree-shaking，commonjs方式不支持
* webpck默认支持，在.babelrc里面设置 modules: false即可，同时mode=production默认开启

#### tree-shaking原理

* 只能作为模块顶层的语句出现
* import的模块只能是字符串常量   export function() {}
* import binding 是 immutable 的


代码擦除: uglify阶段删除无用代码