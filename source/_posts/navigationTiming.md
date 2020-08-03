---
title: Navigation Timing & Navigation Timing API
date: 2020-07-24 10:35:22
tags: 前端性能优化
categories: 前端性能优化
---
### Navigation Timing
![实际情况](http://i.feidom.com/performance_timing_api.jpg)

图解：
* Prompt for unload                   // 激起卸载
    * navigationStart                 // 导航开始
* redirect                            // 本地重定向
    * redirectStart
    * redirectEnd
* unload                              // 本地重定向的同时 卸载
    * unloadStart
    * unloadEnd

* App cache                           // 有缓存拿缓存
    * fetchStart

***

* DNS                                 // [DNS域名解析](/2020/07/28/DNS域名解析/)
    * domainLookipStart
    * domainLookupEnd
* TCP                                 // 建立tcp连接
    * connectStart                    // 开始三次握手，四次挥手
    * (secureConnectionStart)         // 建立https安全协议的加密链接
    * connectEnd
* Request                             // 请求
    * requestStart
* Response                            // 响应
    * responseStart
    * responseEnd

***

* Processing                          // 前端HTML处理
    * domLoading                      
    * domInteractive                  
    * domContentLoaded                
    * domComplate
* onload                              // onload
    * loadEventStart
    * loadEventEnd
