---
title: PostCss
date: 2020-08-04 15:25:26
tags:
- css
- postcss
categories: css
---

### 被边缘化的CSS
CSS是Cascading Style Sheets（层叠样式表单）的简称。这种样式脚本一直和其他编程语言有差距。导致了css被轻视。近几年所有的前端技术都在疯狂的迭代更新，css也不例外。从sass，less，stylus这些预处理器之后，到CSS Module，CSS-in-JS（典型的代表，react的styled-components）。再聊聊[PostCss](https://www.postcss.com.cn/)这种插件系统。

### 预处理器
##### 在css发展的过程中，出现了一些痛点：
* 语法不够强大，不能够嵌套书写，不利于模块开发
* 没有变量和逻辑上的复用机制，导致在css的属性值中只能使用字面量形式，以及不断重复的样式，导致难以维护。

##### 然后css预处理器的出现，弥补了这些遗憾：
* **变量**：对变量进行声明，在需要的地方引用。
* **作用域**：对变量进行管理，像js一样，从局部作用域开始向上查找变量。
* **嵌套**：由于dom的树状结构，css有嵌套的写法，更直接的表现了父子层级之间的明确关系。

css预处理器提供的这些方案，是我们开发人员在写css时更加灵活，维护性强。
但是，项目越来越大，缺乏模块的概念，全局变量的问题困扰着你。每次定义选择器时，总要顾及到其他文件中是否使用了同样的命名。

#### 有问题就有解决，各种方案出现
* BEM规范
```javascript
// bookList模块   
<form class="list-from">
    <input class="list-from__input"></input>
    <button class="list-from__button"></button>
</form>
// 其中归类为以下约定
// BEM：块（block）、元素（element）、修饰符（modifier）
.block{}
.block__element{}
.block--modifier{}
// 其中块可以用单个连字符来界定：如
.site-search{} //块
.site-search__field{} //元素
.site-search--full{} //修饰符
```
......
好麻烦。

#### 近几年火爆的CSS Module，CSS-in-JS（典型的代表，react的styled-components）。
可以参考[阮一峰写的CSS Module](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
看8月3老袁的课，写一下。

#### PostCSS是什么？
[PostCSS](https://www.postcss.com.cn/)
是一个用 JavaScript 工具和插件转换 CSS 代码的工具。----官方简介

PostCSS同事支持预处理和后处理，也可以在原生的css中使用它。通俗来说，PostCSS是一个“壳壳”，可以加载各种生态中的插件来实现对css的处理，可以结合兼容sass，less等
下面介绍几种插件（plugins）：
* postcss-cssnext plugin ---  使用下个版本的css语法，语法见cssnext (css4)语法



---
*以上内容借鉴[zimo的《谈谈PostCSS》](https://segmentfault.com/a/1190000011595620)*
