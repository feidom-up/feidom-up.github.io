---
title: NodeJs前端话事人
date: 2020-07-01 09:27:39
categories: nodejs
tags: 
- nodejs
---
#### NodeJs
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。 [Node.js 中文网](http://nodejs.cn/)

#### NodeJs应用场景
* 我要的只是一个香蕉，得到的确是整个森林
![实际情况](http://i.feidom.com/node_a.jpg)

* SSR(服务器端渲染)
    * SEO友好
    * 优化单页应用的首屏加载时间

#### NodeJs闪亮登场

SPA(single page web application) + NodeJs
方案：NodeJs做Proxy(代理)层，加载web页，连接后台服务。

实现了:
* 消减接口返回的response。经过NodeJs层处理返回的数据，前端拿到的只有她该拿到的东西，数据小了，传输快了，性能更好。
* 真假路由混用。Node可以独立控制路由，并不受后端限制，可以独立部署上线。前端拥有更强的主动性。
    Node可以独立控制路由，可以做**同构**。
    
Q&A：
    &emsp;Q:为什么用NodeJs做代理层，而不用其他语言？
    &emsp;A:NodeJs是基于JavaScript语言的，前端框架Vue等只提供Js的API(Nuxt.js)。
    
