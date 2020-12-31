---
title: webpack优化之代码分割splitChunck
date: 2020-12-21 14:06:00
tags: 
- 前端工程化
- webpack
categories: webpack
---

#### 代码分割

* splitChunck
* 动态引用
    * 适用场景：抽离相同代码到一个共享块
    * 脚本懒加载，使得初始下载代码更小
* 懒加载JS脚本方式
    * CommonJS: require.ensure
    * ES6: 动态import（需要babel支持，@babel/plugin-syntax-dynamic-import)

```javascript
    // 配置.babelrc
    "plugins": [
        ["@babel/plugin-syntax-dynamic-import"],
    ]
```

> dist代码通过window['webpackJsonp']来获取对应脚本