---
title: webpack4资源内联
date: 2020-12-15 16:16:48
tags:
- 前端工程化
- webpack
categories: webpack
---

#### 资源内联是干什么
资源内联：就是把打包好的css等文件，在html中注入这些文件路径，实现内联

* 页面框架的初始化，比如flexible
* 上报相关打点
* css内联避免页面闪动（直接将css内联到html文件）

#### 内联html

```javascript
// raw-loader@0.5.1 内联html片段，在template中弄
// 内联html
<%= require('raw-loader!./meta.html') %>

```

#### 内联javascript

```javascript
// raw-loader内联js
// 初始化脚本，例如flexible
<script><%= require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js') %></script>

```

#### 内联css
* 方式一：style-loader

```javascript
module: {
    rules: [
        {
            test: /.s?css$/,
            use: [
            {
                loader: 'style-loader',
                options: {
                    injectType: 'singletonStyleTag', // 将所有style标签合并成一个
                }
            }
            'css-loader'
            'postcss-loader',
            'sass-loader'
            ]
        },
    ]
},
```

* 方式二： html-inline-css-webpack-plugin
首先使用 mini-css-extract-plugin（而非 style-loader）将 css 提取打包成一个独立的 css chunk 文件 然后使用html-webpack-plugin 生成 html 页面 最后使用 html-inline-css-webpack-plugin 读取打包好的 css chunk 内容注入到页面，原本 html-webpack-plugin 只会引入 css 资源地址，现在实现了 css 内联

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
 
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader"
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin(),
        new HTMLInlineCSSWebpackPlugin(),
    ],
}
```
* 方式一`style-loader` **VS** 方式二`html-inline-css-webpack-plugin` 
    * `style-loader`是css-in-js，需要加载js后才能写入到style中，有一定的延迟性
    * `html-inline-css-webpack-plugin`是将css提取出来，再写入到html中，html网页源代码中已经内联好css了，没有延迟性了
    * 请求层面：减少HTTP网络请求数

#### 小图片或者字体内联
    url-loader

> 本博客笔记内容主要来自**京城一灯**公众号 前端先锋 