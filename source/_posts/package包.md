---
title: package.json了解多少
date: 2020-08-02 09:17:51
categories: nodejs
tags: 
- nodejs
---

* **scripts属性**
生命周期
1. pre钩子
```javascript
    "scripts": {
        "predev": "echo 111",
        "dev": "echo 222"
    },
```
上述代码执行`yarn run dev`,会先执行pre钩子，结果如下：
```bash
    $ yarn run dev
    // 以下为结果
    111
    222
```
2. &(同步串行) 和 &&(异步并行)
```javascript
    "scripts": {
        "dev": "echo 111",
        "server": "echo 222",
        "start": "npm run dev & npm run server"
    },
```
上述代码执行`yarn start`,会先执行dev,再执行server，dev有报错，server不会被执行。
```javascript
    "scripts": {
        "dev": "echo 111",
        "server": "echo 222",
        "start": "npm run dev && npm run server"
    },
```
上述代码执行`yarn start`,会同步行dev和server，dev有报错，server仍会被执行。