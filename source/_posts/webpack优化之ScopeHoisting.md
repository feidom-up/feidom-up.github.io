---
title: webpack优化之Scope Hoisting
date: 2020-12-21 13:58:20
tags: 
- 前端工程化
- webpack
categories: webpack
---

#### webpack打包现象
webpack构建后的代码存在大量的闭包代码

* 大量函数闭包包裹代码，导致体积增大(模块越多越明显)
* 运行代码时创建的函数作用域变多，内存开销变大
* 被webpack转换后的模块会带上一层包裹，import会被转换成__webpack_require__

#### Scope Hoisting原理

* 将所有模块的代码按照引用顺序放在一个函数作用域中，然后适当的重命名一些变量以防止变量名冲突
* 对比，通过scope hoisting 可以减少函数声明代码和内存开销

#### 开启scop hoisting

* webpack4 mode 为 production默认开启，必须是ES6语法，commonJS不支持
* webpack3 增加插件 new webpack.optimize.ModuleConcatenationPlugin()