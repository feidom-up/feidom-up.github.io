---
title: react知识Q&A
date: 2020-12-04 11:42:24
tags:
- react
categories: react
---
**qa的关键在于回答时注意知识可扩展的深度和广度，基本从“**是什么**”，“为什么”，“怎么做”三个方面来回答**


#### Q:说说什么是react？
> 题解：react的诞生背景
  2005年 jquery诞生，浏览器兼容是当时最大的问题。不算框架，只算是工具函数合集。仍不能解决代码复用问题和工程化问题。
  2009年 angularJs带着后台java开发的思想横空出世，前端项目工程化双向绑定给当时的中台系统带来了巨大的便利，但是angular臃肿，需要学习很多angular概念，成本高。
  2010年 backbonejs出现，既兼容jquery，又有很好的mvc工程化管理，在前端风靡一时。
  2013年 reactjs诞生，react的虚拟dom，组件式开发，完美的实现了视图开发中组合优于继承的思想，很大程度上解决了开发复用的问题
  2014年 vue诞生

<font color=red size=5>A: </font>
   **是什么**：react是一个用于构建用户界面的javascript库；
   **优点**: 声明式、组件化、通用性
         声明式：编写代码更直观更简洁
         组件化：提高代码复用率，实现高内聚，低耦合的设计原则
         通用性：一次学习，随处编写。react实现了虚拟dom层，程序不会直接操作dom，依据domdiff处理视图改变。支持虚拟dom层的技术栈，都能用react进行前端处理。
   **缺点**：react并没有支持前端全部解决方案，而是交给社区来实现，所以react的社区很活跃。但是带来了学习东西多的高学习成本。


#### Q:说说react为什么选择了jsx语法
> 题解：也就是在问，为什么没有选择其他方案
        其他方案有：vue在用的模板语法，模板字符串，jxon语法
  
<font color=red size=5>A: </font>
   **是什么**：jsx语法是javacsript的扩展。jsx会被babel编译为React.createElement(),是React.createElement()的语法糖，通过类似XML的描述方式，描写函数对象。
   **优点**：更简洁更直观，更贴近原生html。贴近reac“关注点分离”的思想。
   对比其他方案：
      模板语法：分离了技术栈，引入了不该称为关注点的模板概念：模板指令，模板语法等。不符合react的设计思想
      模板字符串：使代码变得更复杂，字符串编写，不利于语法提示
      jxon：类似jsx语法，但是因为大括号的语法提示问题
  所以react选择了jsx，因为jsx与其设计理念贴合，不需要引入过多的概念，对代码提示也很友好，最适合react。

#### Q:React 的请求应该放在哪里，为什么?

* 对于异步请求，应该放在 componentDidMount 中去操作。从时间顺序来看，除了 componentDidMount 还可以有以下选择：
* constructor：可以放，但从设计上而言不推荐。constructor 主要用于初始化 state 与函数绑定，并不承载业务逻辑。而且随着类属性的流行，constructor 已经很少使用了。
* componentWillMount：已被标记废弃，在新的异步渲染架构下会触发多次渲染，容易引发 Bug，不利于未来 React 升级后的代码维护。

<font color=red size=5>A: </font>所以React 的请求放在 componentDidMount 里是最好的选择。

#### Q：社区中去除类组件`constructor`的原因
> constructor之前主要用于初始化组件的一些state状态，现在直接将状态写在顶部
`state = {count: 0}`不再写在constructor中

<font color=red size=5>A:</font>
   * constructor 中不推荐处理处理初始化以外的逻辑
   * constructor 本身只是class的初始化函数，并不属于react生命周期
   * 移除 constructor 后，代码更简洁

#### Q:setState是同步更新还是异步更新
> 题解：是A还是B这种问题，不要想当然的回答，这种问题可能在不同场景中有不同的选择
   * 可能是A
   * 可能是B
   * A和B同时存在

setState用于更新组件状态，触发组件重新渲染，更新视图UI

* 先了解下**合成事件**
   基于 事件委托 思想, 在React @17.0前
   1. React给`document(HTML)`挂上事件监听
   2. Dom事件触发后冒泡到`document(HTML)`
   3. React找到对应的组件，造出一个**合成事件**
   4. 按组件树模拟一遍事件冒泡
   所以一个页面中只能有一个版本的React，多个版本的话，事件就乱套了
   React@17.0后，事件委托对象由`document(HTML)`更改为`Dom容器(ReactDOM.render()所调用的节点)`上

* 异步场景
   * 一般情况下，setState是异步的。
   React的*setState执行更像一个队列，执行时根据队列一一执行，合并state数据。完成后执行回调*，根据结果更新虚拟Dom触发渲染
   * 为什么是异步的？
      官方回复看[这里](https://github.com/facebook/react/issues/11527#issuecomment-360199710)
      1. 保持内部的一致性
      2. 为后续的架构升级启用并发更新
* 同步场景
   在 addEventListener、 setTimeout、 setInterval这些原生事件中会同步更新

* setState的工作原理
   ![setState](https://s0.lgstatic.com/i/image2/M01/01/47/Cip5yF_YYfCAXIxiAAEJsQbj_hs785.png)
   ![setState](https://s0.lgstatic.com/i/image2/M01/01/3E/CgpVE1_YU2KAStLdAAFVKxh7Dyg317.png)
<font color=red size=5>A：</font>
   setState 并非真异步，只是看上去像异步。在源码中，通过 isBatchingUpdates 来判断
   setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。

   那么什么情况下 isBatchingUpdates 会为 true 呢？在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。

   但在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。

   一般认为，做异步设计是为了性能优化、减少渲染次数，React 团队还补充了两点。

   保持内部一致性。如果将 state 改为同步更新，那尽管 state 的更新是同步的，但是 props不是。

   启用并发更新，完成异步渲染。