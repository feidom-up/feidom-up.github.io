---
title: webpack4多页面应用MPA
date: 2020-12-15 16:17:12
tags:
- 前端工程化
- webpack
categories: webpack
---
#### 多页面应用MPA

* 每一次页面跳转，后台都会返回一个新的html，多页应用
* 属于后端渲染，有明显的优势：SEO友好、每个页面是解耦的
* 缺点：每个页面对应一个entry，一个html-webpack-plugin，（这种太麻烦了，每次新增都需要再配置一次）

#### 针对上述缺点的解决方案

```javascript

// 例如 ./src/index/index.js 与 ./src/search/index.js
// path: './src/*/index.js'
const setMPA = filenames => {
  const entry = {}, htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, filenames))
  for(let item of entryFiles){
    // (/\/([a-z\_\$]+)\/index.js$/)
    const match = item.match(/src\(.*)/index\.js$/)
    const pageName = match && match[1];
    entry[pageName] = item

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: `src/${pageName}/index.html`,
        filename: `${pageName}.html`,
        chunks: ["runtime", "common", pageName],
        minify: {
          // ..
        }
      })
    )
  }
  return {
    entry,
    htmlWebpackPlugins
  }
}
entry: entry
plugin: [//.....].concat(htmlWebpackPlugins)

```

> 本博客笔记内容主要来自**京城一灯**公众号 前端先锋 