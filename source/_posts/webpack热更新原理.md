---
title: webpack热更新原理
date: 2020-12-15 16:01:43
tags: 
- 前端工程化
- webpack
categories: webpack
---

#### webpack热更新plugins配置

* **webpack-dev-server**

> 开启本地服务器，监听文件变化后，热更新页面;不刷新浏览器而是热更新，不输出文件，而是放在内存中;配合 new.webpack.HotModuleReplacementPlugin() 或 react-hot-loader 插件使用

```javascript
// package.json
webpack-dev-server mode=development -open
// config
module.exports = {
    devServer: {
        host: '0.0.0.0',
        compress: true,
        port: '3000',
        contentBase: join(__dirname, '../dist'),//监听的目录，用于刷新浏览器
        hot: true,
        overlay: {
            errors: true,
            warnings: true
        },
        disableHostCheck: true,
        publicPath: '/', // 设置时，要与output.publicPath保持一致
        historyApiFallback: true,
        // historyApiFallback: {
        //   rewrites: [from: /.*/, to: path.posix.join('/',     // 'index.html')],
        //}
        proxy: {
            '/api': 'http://localhost:8081',
        }
        //proxy: {
        //  '/api/*': {
        //     target: 'https://xxx.com',
        //     changeOrigin: true,
        //     secure: false,
        //     headers: {},
        //     onProxyReq: function(proxyReq, req, res) {
        //       proxyReq.setHeader('origin', 'xxx.com');
        //       proxyReq.setHeader('referer', 'xxx.com');
        //       proxyReq.setHeader('cookie', 'xxxxx');
        //     },
        //     onProxyRes: function(proxyRes, req, res) {
        //       const cookies = proxyRes.header['set-cookie'];
        //       cookies && buildCookie(cookies)
        //     }
        //  }
    // }
    },
}
```

* **原理**
    * `Webpack Compile`: 将JS编译为Bundle
    * `HMR Server`: 将热更新的文件输出给 HMR Runtime
    * `Bundle server`: 提供文件在浏览器的访问
    * `HMR Runtime`: 会被注入到浏览器，更新文件的变化
    * `bundle.js`: 构建输出的文件
    > HMR: Hot Module Replacement 

    ![webpack热更新原理图](http://i.feidom.com/hmr.jpg)


> 本博客笔记内容主要来自**京城一灯**公众号 前端先锋 