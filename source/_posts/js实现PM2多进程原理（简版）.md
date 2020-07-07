---
title: js实现PM2多进程原理（简版）
date: 2020-07-07 11:43:27
tags:
- PM2
- 进程管理
- nodejs
categories: nodejs
---
### app.js
> 前端实现的node项目
```javascript
// worker
var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8000);
```

### pm2.js
> 模拟PM2多进程
```javascript
// master
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;   // 多核cpu的核数
 
// cluster.isMaster为true，表示是主进程
if (cluster.isMaster) {
    console.log(numCPUs);
    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();
    }
} else {
    require("./app.js");
}
```

* pm2.js运行后，会创建一个主进程（父进程master）。
* 然后创建numCPUs个node进程，这些进程相当于子进程。受到主进程master的管理，调度分配
共创建了numCPUs+1个进程
> 重点在`cluster.fork()`来fork子进程。然后cluster.isMaster为false时，创建的子进程去`require("./app.js")`，实现多进程管理。