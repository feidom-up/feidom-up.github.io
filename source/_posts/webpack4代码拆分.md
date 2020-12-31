---
title: webpack4代码拆分
date: 2020-12-15 16:17:51
tags:
- 前端工程化
- webpack
categories: webpack
---

#### 基础库分离

**将react、react-dom基础包通过cdn引入，不打入到bundle中**
* `externals`
    * 配置
    ```javascript
    module.exports = {
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM',
            mobx: 'mobx'
        },
    }
    ```
    * 在html模版中 script标签引入对应的cdn地址

* `html-webpack-externals-plugin`**（推荐使用）**
    * 在html模版中 script标签引入对应的cdn地址
    * 在`plugins`中配置
    ```javascript
    plugins: [
        new HtmlWebpackPlugin(),
        new htmlWebpackExternalsPlugin({
            externals: [
            {
                module: 'react',
                entry: react的cdn地址,
                global: 'React'
            },
            {
                module: 'react-dom',
                entry: react-dom的cdn地址,
                global: 'ReactDOM'
            },
            {
                module: 'react-router-dom',
                entry: react-router-dom的cdn地址,
                global: 'ReactRouterDOM'
            },
            // ...
            ]
        })
    ]
    ```
* webpack4 替代 CommonsChunckPlugin插件
```javascript
    module.exports = {
        optimization: {
            minimize: true,
            runtimeChunk: {
                name: 'manifest'
            },
            splitChunks: {
                chunks: 'async', // async异步引入库进行分离(默认),initial同步引入库分离，all所有引入库分离
                minSize: 30000, // 抽离公共包最小的大小
                maxSize: 0,
                minChunks: 1, // 最小使用的次数 
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: true,
                cacheGroups: {
                    // 提取基础库，不使用CDN的方式
                    //commons: {
                    //  test: /(react|react-dom|react-router-dom)/,
                    //  name: "vendors",
                    //  chunks: 'all'
                    //},
                    // 提取公共js
                    commons: {
                    chunks: "all", // initial
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    name: "commons"
                    },
                    // vendors: {
                    //   test: /[\\/]node_modules[\\/]/,
                    //   priority: -10
                    // }
                    // 合并所有css
                    // styles: {
                    //   name: 'style',
                    //   test: /\.(css|scss)$/,
                    //   chunks: 'all',
                    //   minChunks: 1,
                    //   enforce: true
                    // }
                }
            }
        },
    }

```

> 本博客笔记内容主要来自**京城一灯**公众号 前端先锋 