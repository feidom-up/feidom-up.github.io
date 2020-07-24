---
title: Navigation Timing & Navigation Timing API
date: 2020-07-24 10:35:22
tags: 前端性能优化
categories: 前端性能优化
---
### Navigation Timing
![实际情况](http://qcukvp3iz.bkt.clouddn.com/performance_timing_api.jpg)

图解：
* Prompt for unload
    * navigationStart

* redirect
    * redirectStart
    * redirectEnd
* unload
    * unloadStart
    * unloadEnd

* App cache
    * fetchStart

***

* DNS
    * domainLookipStart
    * domainLookupEnd
* TCP
    * connectStart
    * (secureConnectionStart)
    * connectEnd
* Request
    * requestStart
* Response
    * responseStart
    * responseEnd

***

* Processing
    * domLoading
    * domInteractive
    * domContentLoaded
    * domComplate
* onload
    * loadEventStart
    * loadEventEnd
