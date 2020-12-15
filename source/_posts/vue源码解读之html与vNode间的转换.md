---
title: vue源码解读之html与vNode间的转换
date: 2020-08-13 16:27:24
tags:
- vue
- vue源码解读
categories: vue
---
`<template>`被compiler处理。compiler使用`generate(ast, options)`方法，将template转换为指定结构的对象。

### compiler编译
阅读源码逻辑可得，在实际上compiler的主要处理点是：
```javascript
var compiled = baseCompile(template.trim(), finalOptions);
```
即调用baseCompile函数，而baseCompile则是核心，这边主要代码如下：
```javascript
const ast = parse(template.trim(), options)
if (options.optimize !== false) {
    optimize(ast, options)
}
const code = generate(ast, options)
return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
}
```
上面的代码 将template处理为ast(抽象语法树)，且 根据ast树结构构建render函数主体部分。

### compiler中调用parse()解析
核心中用到的parse()方法的处理过程为：
* 在new Vue实例化时，parseHTML解析html标签等html内容。parseHTML处理实际上会调用parseStartTag和handleStartTag来解析出开始标签，解析时，用到的方法是**正则匹配**。
* parseText处理类似{{text}}文本节点。实际上会将使用到响应式数据的文本变成：_s(text)，并且设置了@binding属性表示引用了哪个响应式变量。
还有一点就是对于换行的处理也会保留，即文本区域原样，该有换行就有换行只是响应式变量的特殊处理而已。

示例总结：
将`<div id="app"> {{ text }} </div>`,经过`parseHTML + parseText`的解析，得到如下的主要ast结构：
```javascript
type: 1,
tag: 'div',
attrs: [{ name: 'id', value: 'app'}],
attrList: [{name: 'id', value: 'app'}],
attrMap: {id: 'app'}
children: [
    expression: ""\n    "+_s(text)+"\n  ""
    text: "↵    {{ text }}↵  "
    tokens: (3) ["↵    ", {…}, "↵  "]
    type: 2
]
```
### generate通过解析出来的ast构建render
在构建render的过程中，用到了罪恶的`with()`
先看一下generate的部分源码：
```javascript
const state = new CodegenState(options)
const code = ast ? genElement(ast, state) : '_c("div")'
return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
}
```
实例的ast结构实际上构建成了:
```javascript
with(this) {
    return _c('div',
        {
            attrs:{"id":"app"}
        },
        [
            _v("\n    "+_s(text)+"\n  ")
        ]
    )
}
```
上面使用函数形式表示的，实际上Vue源码此处是字符串，即：
```javascript
"with(this){return _c("div",{attrs:{"id":"app"}},[_v("\n "+_s(text)+"\n ")])}"
```
其中用到的_c(),_v(),_s的意思分别为：
```javascript
// _c()就是$createElement，即h函数。该方法是vnode创建的实际出发点，Vue核心方法之一。具体源码如下：
vm._c = function(a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
};
// -v()实际上是createTextVNode，即创建虚拟文本节点（文本类型的虚拟DOM），实例方法如下
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
}
// -s()实际上是toString，处理对象和其他形式文本输出。处理null、对象以及数组形式的数据等将其转换为字符串。实例方法如下
function toString(val) {
    return val === null 
        ? ' ' 
        : typeof val === 'object' 
        // 格式化对象，并指定缩进为2个空格
        ? JSON.stringify(val, null, 2) 
        : String(val);
}
```
这里需要说明下_c中createElement中a、b、c、d参数表示的含义：
```javascript
// a：tag，表示标签名
// b：data，表示属性、事件、class、props等的配置对象
// c: children，表示子节点
// d：normalizationType，表示类型，即要如何处理children中的数据
```

至此，我们得到了render函数：
```javascript
render: `with(this){return ${code}}`,
```

### VNode的创建是在render执行过程中触发的
render中用`with()`执行了_c(),_v()等方法。
_c()就是$createElement,在createElement的处理逻辑中，最为核心的就是调用VNode构造函数创建虚拟DOM:
```javascript
new VNode(tag, data, children, undefined, undefined, context)
```
然后再说一下VNode构造函数
VNode构造函数实际上就是定义相关属性，VNode中重要的属性有：
```javascript
// tag：当前标签名
// data：标签属性、props、事件等对象集合
// text：当前标签文本内容
// context：上下文对象，即Vue实例对象
var VNode = function(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
	this.tag = tag;
	this.data = data;
	this.children = children;
	...
}
```
### render中创建了VNode，那什么时候调用render呢??
这里说明下之前render生成时的过程及时间点
* 初始化时renderMixin
这部分是加载Vue.js文件过程中的处理，涉及到render的是renderMixin函数，实际上该函数主要定义Vue原型方法：
```javascript
// Vue.prototype.$nextTick方法定义
// Vue.prototype._render方法定义
```
* new Vue时initRender
创建Vue实例时会调用initRender进行初始化，实际上就是相关属性的定义
* $mount挂载render处理
在这个时候将template处理成render函数。
* $mount中构建出了render函数，那再来看看render函数的调用
![看下这张图](http://i.feidom.com/vue-render%28%29%E5%87%BD%E6%95%B0%E5%95%A5%E6%97%B6%E5%80%99%E7%94%A8.png)
上图是mountComponent主要的处理逻辑，实际上render函数的执行是在_render中处理的。_render函数的结果作为vm._update函数的参数。
这里有一个非常需要注意的点，实际上是在构建Watcher实例触发的：
```javascript
var updateComponent = function() {
	vm._update(vm._render());
};
new Watcher(vm, updateComponent, noop)
```
updateComponent会作为getter函数，并且会在Watcher.prototype.get中被调用，而这个步骤就是重新生成html的过程。
* 再说下_render方法
实际上_render中主要的处理也就是render函数的调用，核心代码如下：
```javascript
var vnode = render.call(vm._renderProxy, vm.$createElement);
return vnode;
```
* 再说下_update实例方法
_update中处理实际上有两个主要点：
```
* vm._vnode相关处理，两点：prevNode = vm._vnode，vm._vnode = vnode
* vm.__patch__的调用
```
prevNode记录更新前的vnode，如果是初始化，那么prevNode就是空，调用__patch__实现vnode -> html的过程，也是**diff算法**的实现过程，是整个Vue中核心点之一。
_update核心源码如下：
```javascript
var prevNode = vm._vnode;
vm._vnode = vnode;
if (!prevNode) {
	// 初始化
	vm.$el = vm.__patch__(vm.$el，vnode, hydrating, false);
} else {
	// 更新
	vm.$el = vm.__patch__(prevNode, vnode);
}
```
_update负责比较dom节点并替换。
### 总结
通过上面主要分析了处理html、处理文本情况，对于指令相关等部分直接略过，满足了分析这边的目的：探寻下Vue是如何解析template的。
整个处理流程如下：
构建code：
```
$mount -> compileToFunctions -> compile -> baseCompile -> parse -> generate -> render
其中parse中主要的处理：
parse -> parseHTML、parseText（循环处理startTag、text等）
```
而vnode的创建实际上是在render调用阶段发生的，即执行render函数，函数体中_c、_v等函数触发的VNode创建。
render函数调用:
```
生成render函数 -> mountComponent -> new Watcher -> Vue.prototype._render调用
```

> 在查看源码的过程中，搜索了各种资料帮助自己理解，其中来自[玉案轩窗老哥的Vue系列](https://blog.csdn.net/s1879046/category_7294206.html)条理清晰，对自己帮助很大。以上笔记也借鉴了他的内容，方便之后学习理解。