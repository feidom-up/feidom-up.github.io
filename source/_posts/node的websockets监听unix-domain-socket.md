---
layout: node的websockets监听unix_domain_socket
title: node的websockets监听unix_domain_socket
date: 2020-07-20 17:45:57
categories: nodejs
tags: 
- nodejs
---

### WebSockets listening on UNIX domain socket?

* Server side:
```javascript
var http = require('http');
var WebSocketServer = require('ws').Server;
var server = http.createServer()
var wss = new WebSocketServer({ server : server});
server.listen('/tmp/server.sock')
```

* Client side:
```javascript
var ws = require('ws');
var client = new ws("ws+unix:///tmp/server.sock")
client.send('hello')
```


[原文地址](https://stackoverflow.com/questions/23930293/websockets-listening-on-unix-domain-socket?answertab=active#tab-top)