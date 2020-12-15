---
title: vue使用flow静态检查
date: 2020-08-18 11:21:27
tags:
- vue
- flow
categories: vue
---
### 了解下flow
js是一门弱语言，灵活性强。这本来是它的优势。但是在程序运行中，数据类型变幻往往造成程序的不稳定。
flow.js是用来为js做静态类型检查的。在使用ts前，flow.js是一个不错的类型检查器。他和ts不是一回事。ts是js的超集，而flow只是一个工具
### 在vue项目中使用flow

* 安装flow相关依赖包
```bash
# yarn
$ yarn add 
  babel-plugin-syntax-flow # 添加对Babel中的流语法的支持。
  babel-plugin-transform-class-properties #  添加对类属性和静态方法的支持
  babel-plugin-transform-flow-strip-types # 在使用Babel转换前从源文件中删除类型注释。
  eslint #  Eslint。它实际上是JS的linter，集成了各种编辑器和ide。
  babel-eslint # 对Eslint进行补丁，以使用Babel的解析器解析源文件。
  eslint-plugin-html # 允许Eslint处理HTML文件 (ie. Only lints stuff inside script tags.)
  eslint-plugin-flowtype-errors # 通过Eslint传递流错误，并传递到编辑器的Eslint插件(如果有的话)。
  eslint-plugin-vue # 用于使用Vue的Eslint的插件。
  eslint-config-vue # 用于使用Vue的Eslint的配置.
  flow-bin     # flow 类型检查
-D
```
* 配置.babelrc
```javascript
{
  ...
  "plugins": [
    "babel-plugin-transform-class-properties",
    "babel-plugin-syntax-flow",
    "babel-plugin-transform-flow-strip-types"
  ]
}
```
* 配置.eslintrc
```javascript
{
  "parser": "babel-eslint",

  "plugins": [
    "html",
    "flowtype-errors"
  ],

  "extends": [
    "vue"
  ],

  "rules": {
    "flowtype-errors/show-errors": 2
  }
}
```
* 配置.flowconfig
    * 在`package.json`的`scripts`标签中。添加`"flow": "flow"`
    ```javascript
    "scripts":{
        "flow": "flow"
    }
    ```
    * 在项目的根目录，执行`flow init` 生成.flowconfig文件
    ```.flowconfig
        [ignore]
        .*/node_modules/.*
        .*/test/.*
        .*/build/.*
        .*/config/.*
        [include]

        [libs]

        [options]
        module.file_ext=.vue
        module.file_ext=.js
    ```
* 在js文件和.vue文件中加入`/* @flow */`,flow开始工作
test.js
```javascript
/* @flow */
const doSomethingStupid(stringArg) {
  // Flow should show an error here, "The operand of an arithmetic operation must be a number."
  return stringArg * 3109;
}
console.log(doSomethingStupid(`I'm stringy`))
```
test.vue
```html
<template>
  <p>I'm made with Flow!</p>
</template>

<script>
/* @flow */

const randomThing: string = 'Boop!'

export default {
  created() {
    console.log(randomThing)
  }
}
</script>
```


### 在webpack 中使用 flow 检查
* 安装一个 flow 的 webpack 插件 `flow-webpack-next-plugin`
```bash
yarn add flow-webpack-next-plugin -D
```
* 配置webpack
    ```javascript
    var FlowWebpackPlugin = require('flow-webpack-next-plugin');
    plugins: [
        new FlowWebpackPlugin()
    ]
    ```


### 记录一个flow报错 required module not found
原因： 因为webpack配置了别名(alias)，所以在 js 文件内直接 import 别名会导致 flow 无法正确找到对应的 module
解决： 在 .flowconfig 使用 name_mapper 将对应的别名做一个映射，问题解决

```.flowconfig
    [options]
    module.file_ext=.vue
    module.file_ext=.js
    module.name_mapper='\(@\)' -> '<PROJECT_ROOT>/src/'
```

### 站在巨人的肩膀上
[https://www.jianshu.com/p/95854085ec40](https://www.jianshu.com/p/95854085ec40)
[https://www.digitalocean.com/community/tutorials/vuejs-components-flow](https://www.digitalocean.com/community/tutorials/vuejs-components-flow)