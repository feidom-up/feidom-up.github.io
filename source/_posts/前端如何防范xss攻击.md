---
title: 前端如何防范xss攻击
date: 2020-09-10 13:56:05
tags: 前端安全
categories: 前端安全
---
##### xss是什么

  Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等，进而危害数据安全。为了和 CSS 区分，这里把攻击的第一个字母改成了 X，于是叫做 XSS。

  XSS 的本质是：恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。

##### 怎么办

  * 输入过滤

    ​    输入过滤就在后台接口处理数据时合适，做个数据转义

  * 渲染时处理

    ​	传统前端，拼接 HTML及使用 `.innerHTML`、`.outerHTML`、`document.write()`将数据渲染到页面上时，很容易将不可信的问题数据插到页面上。

    ​    Sdk前端项目，使用Vue框架。Vue框架在渲染前，会将template模板编译为虚拟Dom树，减少了 encode 操作，减少了 XSS 隐患。

    

    但是，使用`v-html`时会有问题，这一点在vue官方文档中有提到：![v-html](http://i.feidom.com/Vhtml.jpg)

    解决方案：

      * 尽量使用插值表达式`{{}}`，它会把要显示的内容转为字符串。

      * 如果使用v-html，要保证来自服务端的渲染数据都是安全的。

      * 在使用第三方UI组件库的的时候，要检查一下它们渲染页面的方式，是否使用了 v-html。

      * 有的时候实在绕不开，必须用。那就用[lodash的_.template](https://www.lodashjs.com/docs/lodash.template)做一层字符串逃逸操作，再塞给 v-html 就行。

        ```
        var template = _.template("<%- value %>");
        template({value: '<script>'});
        输出 ==> &lt;script&gt;
        
        ```

  * 在项目中使用第三方库[xss](https://www.npmjs.com/package/xss),[中文文档](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)
