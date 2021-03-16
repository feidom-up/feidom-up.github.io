---
title: Virtual DOM的工作原理
date: 2021-01-02 23:22:41
tags:
- vue
- react
categories: 
- react
- vue
---

#### Virtual DOM 也被称为虚拟DOM

* 在react中，`jsx语法`经过`babel解析`转化为`React.createElement()`函数调用后生成`ast抽象语法树`，再通过`render`函数将`ast树`转换为`fiber 结构`，填入许多调度、更新、diff相关数据，并转换`ast树`为`虚拟DOM树`，再完成挂载。
* 在vue中，模版语法 经过 `generate`处理(正则匹配 生成 `ast抽象语法树`)，`render`中调用`_c()/createElement()`函数将`ast树`生成`VNode(虚拟DOM)`,再完成挂载。

#### 虚拟DOM的来源
react的前身是facebook的`XHP`，在这个框架中，页面都是通过转义的方式生成的，并没有直接的HTML，确保在`XHP`中写出安全的静态页面。

初衷是：
* 简化前端开发（后端赋能）
* 防止xss攻击

发展是：
* 通过虚拟DOM规避风险，不让用户直接的操作DOM了，而是把它封起来自己管理

#### 虚拟DOM的表现形式

```javascript
    {
        tag: 'input',
        props: {
            type: 'button',
            value: ''
        },
        childrean: []
    }
```

> React 有两个函数
    * diff 函数，去计算状态变更前后的虚拟 DOM 树差异
    * 渲染函数，渲染整个虚拟 DOM 树或者处理差异点。
    现在是不是有些理解为什么 React 与 ReactDOM 是两个库了？正是由于计算与渲染的分工。
    其中 React 的主要工作是组件实现、更新调度；ReactDOM 提供了在 网页上渲染 的基础


#### 虚拟DOM的优缺点

优点
* 性能优越
* 规避XSS
* 可跨平台

但是不是所有的操作都是虚拟DOM更高效
&emsp;&emsp;大量的直接操作DOM容易引起页面性能下降。这时React基于虚拟DOM的diff处理与批处理操作，可降低DOM的操作频次和范围，提升页面性能
&emsp;&emsp;但是在首次渲染或者微量dom操作的时候，虚拟DOM的性能就更慢一些。

那虚拟 DOM 一定可以规避 XSS吗？
&emsp;&emsp;虚拟 DOM 内部确保了字符转义，所以确实可以做到这点，但 React 存在风险，因为 React 留有 dangerouslySetInnerHTML API 绕过转义。

没有虚拟 DOM 不能实现跨平台吗？
&emsp;&emsp;比如 NativeScript 没有虚拟 DOM 层 ，它是通过提供兼容原生 API 的 JS API 实现跨平台开发。
那虚拟 DOM 的优势在哪里？
&emsp;&emsp;实际上它的优势在于跨平台的成本更低。在 React Native 之后，前端社区从虚拟 DOM 中体会到了跨平台的无限前景，
所以在后续的发展中，都借鉴了虚拟 DOM。比如：社区流行的小程序同构方案，在构建过程中会提供类似虚拟 DOM 的结构描述对象，来支撑多端转换。

缺点
* 内存占用较高
* 难以进行优化