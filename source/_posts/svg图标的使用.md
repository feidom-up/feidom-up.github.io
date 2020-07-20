---
title: svg图标的使用
date: 2020-07-04 21:01:58
tags:
- css
- svg
categories: css
---
### svg图标在前端应用的优点
* 和传统的图像比起来，尺寸更小，且可压缩性更强
* 可伸缩
* 任何分辨率之下都可以被完美的打印
* svg中图像中的文本是可选的，同时也是可搜索的，很适合做地图。

### svg常用修改

* 修改宽(width)高(height)
    修改svg标签内的width、height来修改图标的大小宽(width)高(height)
* 修改颜色
    1. 在style标签中定义类，使用fill关键字定义颜色，如.st7。
    2. 在path标签中增加类名：class="st7"，用类名控制颜色。
    
如下例：
```
<?xml version="1.0" encoding="utf-8"?>
<!--  修改svg标签内的width、height来修改图标的大小宽(width)高(height)  -->
<svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  width="17px" height="16px" viewBox="0 0 11 11" style="enable-background:new 0 0 11 11;" xml:space="preserve">
<style type="text/css">
 .st0{fill:#08A6F1;}
 .st1{fill:#18C27B;}
 .st2{fill:#FFA200;}
 .st3{fill-rule:evenodd;clip-rule:evenodd;fill:#18C27B;}
 .st4{fill-rule:evenodd;clip-rule:evenodd;fill:#FFA200;}
 .st5{fill:#F44436;}
 .st6{clip-path:url(#SVGID_2_);}
 .st7{fill:#00CDD9;}
</style>
<!--  1.在style标签中定义类，使用fill关键字定义颜色，如.st7。  -->
<!--  2.在path标签中增加类名：class="st7"，用类名控制颜色。  -->
<path class="st7" d="M11,10.7c0,0.2-0.2,0.3-0.3,0.3H0.3C0.2,11,0,10.8,0,10.7V10c0-0.2,0.2-0.3,0.3-0.3h10.3c0.2,0,0.3,0.2,0.3,0.3L11,10.7
 L11,10.7z M1.9,4.8l3.3,3.4c0.1,0.1,0.4,0.1,0.5,0l0,0l3.3-3.4c0.1-0.1,0.1-0.2,0.1-0.4C9.1,4.3,9,4.2,8.8,4.2h-2V0.3
 C6.9,0.2,6.7,0,6.5,0H4.5C4.3,0,4.1,0.2,4.1,0.3v3.9h-2C2,4.2,1.8,4.4,1.8,4.6C1.8,4.7,1.8,4.8,1.9,4.8L1.9,4.8z"/>
</svg>
```
