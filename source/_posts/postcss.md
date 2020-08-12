---
title: Css从边角走向中心
date: 2020-08-04 15:25:26
tags:
- css
- postcss
categories: css
---

### 被轻视的CSS
CSS是Cascading Style Sheets（层叠样式表单）的简称。这种样式脚本一直和其他编程语言有差距。导致了css被轻视。近几年所有的前端技术都在疯狂的迭代更新，css也不例外。从sass，less，stylus这些预处理器之后，到CSS Module，CSS-in-JS（典型的代表，react的styled-components）。再聊聊[PostCss](https://www.postcss.com.cn/)这种插件系统。

### 预处理器
##### 在css发展的过程中，出现了一些痛点：
* 语法不够强大，不能够嵌套书写，不利于模块开发
* 没有变量和逻辑上的复用机制，导致在css的属性值中只能使用字面量形式，以及不断重复的样式，导致难以维护。

##### 然后css预处理器的出现，弥补了这些遗憾：
* **变量**：对变量进行声明，在需要的地方引用。
* **作用域**：对变量进行管理，像js一样，从局部作用域开始向上查找变量。
* **嵌套**：由于dom的树状结构，css有嵌套的写法，更直接的表现了父子层级之间的明确关系。
* **混合(Mixin) Extend**：
* **运算**：
* **函数**：
* **Namespaces&Accessors**：
* **scope**：
* **注释**：

css预处理器提供的这些方案，是我们开发人员在写css时更加灵活，维护性强。
但是，项目越来越大，缺乏模块的概念，全局变量的问题困扰着你。每次定义选择器时，总要顾及到其他文件中是否使用了同样的命名。

##### 有问题就有解决，各种方案出现（css分层）

###### Q：为什么要分层？
A:原因： 
* CSS有语义化的命名约定和CSS层的分离，将有助于它的可扩展性，性能的提⾼
和代码的组织管理。
* ⼤量的样式，覆盖、权重和很多!important，分好层可以让团队命名统⼀规范，
⽅便维护。
* 有责任感地去命名你的选择器。

###### 分层的设计规范有很多，以下具体介绍BEM规范
* BEM规范
和SMACCS⾮常类似，主要⽤来如何给项⽬命名。⼀个简单命名更容易让别
⼈⼀起⼯作。⽐如选项卡导航是⼀个块(Block)，这个块⾥的元素的是其中标签之⼀
(Element)，⽽当前选项卡是⼀个修饰状态(Modifier)：
```javascript
// bookList模块   
<form class="list-from">
    <input class="list-from__input"></input>
    <button class="list-from__button"></button>
</form>
// 其中归类为以下约定
// BEM：块（block）、元素（element）、修饰符（modifier）
.block{}  // 代表了更⾼级别的抽象或组件
.block__element{}  // 代表.block的后代，⽤于形成⼀个完整的.block的整体
.block--modifier{}  // 代表.block的不同状态或不同版本
// 其中块可以用单个连字符来界定：如
.site-search{} //块
.site-search__field{} //元素
.site-search--full{} //修饰符
```
......
好麻烦。
---
还有[SMACSS(Scalable and Modular Architecture for CSS 可扩展的模块化架构的CSS)](https://smacss.com/)、[SUIT：衍生自BEM](https://suitcss.github.io/)、[ACSS：原子css规范](http://patternlab.io/)、[ITCSS](http://csswizardry.net/talks/2014/11/itcss-dated.pdf)

### 后处理器
* CSS压缩 ClEAN_CSS
* 自动添加浏览器前缀 Autoprefixer
* CSS更加美观排序 CSScomb
* Rework取代styles，后处理器发热

### 近几年火爆的CSS Module，CSS-in-JS（典型的代表，react的styled-components）。
可以参考[阮一峰写的CSS Module](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
看8月3老袁的课，写一下。

### PostCSS是什么？
[PostCSS](https://www.postcss.com.cn/)
是一个用 JavaScript 工具和插件转换 CSS 代码的工具。----官方简介

PostCSS同时支持预处理和后处理，也可以在原生的css中使用它。通俗来说，PostCSS是一个“壳壳”，可以加载各种生态中的插件来实现对css的处理，可以结合兼容sass，less等
##### 下面介绍几种插件（plugins）：
* postcss-cssnext plugin ---  使用下个版本的css语法，语法见cssnext (css4)语法
* postcss-custom-properties --- 运行时变量
* postcss-simple-vars --- 与SCSS一致的变量实现
* postcss-mixins --- 实现类似sass的@mixin的功能
* postcss-extend --- 实现类似sass的继承功能
* postcss-import --- 实现类似sass的import
##### 使用gulp和webpack处理postcss代码：
// gulpfile.js
```javascript
    var gulp = require('gulp'); 
    var postcss = require('gulp-postcss'); 
    var autoprefixer = require('autoprefixer'); 
    var cssgrace = require('cssgrace'); 
    var cssnext = require('cssnext'); 

    gulp.task('css', function () { 
        var processors = [ 
            autoprefixer({browsers: ['last 3 version'], 
            cascade: false, 
            remove: false 
            }), 
            cssnext(), 
            cssgrace 
        ]; 
        return gulp.src('./src/css/*.css') 
            .pipe(postcss(processors)) 
            .pipe(gulp.dest('./dist')); 
    }); 
    gulp.task('watch', function(){ 
        gulp.watch('./src/css/*.css', ['css']); 
    }); 
    gulp.task('default', ['watch', 'css']);

```
// webpack.conf.js
```javascript
    var config = {
        output:{publicPath: '../dist/'},
        module:{
            // loaders...
        },
        postcss: function(){
            return [
                ima4dpr(dpr: 3,q: 'q50',s: 's150'}),
                px2rem({remUnit: remUnit, baseDpr: baseDpr }),
                autoprefixer({browers: ["ios_saf >= 7","android >= 4"]})
            ]
        },
        devtool: 'source-map'
    }
```
打包处理逻辑如下图所示：

![打包处理逻辑](http://i.feidom.com/%E6%89%93%E5%8C%85%E5%90%8E%E7%94%9F%E6%88%90%E7%9A%84postcss.jpg)


---
*以上内容借鉴[zimo的《谈谈PostCSS》](https://segmentfault.com/a/1190000011595620)*
