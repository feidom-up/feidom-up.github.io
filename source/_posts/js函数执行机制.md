---
title: js上下文执行机制
date: 2021-08-09 08:28:01
tags: js原理
categories: js原理
---

#### 执行上下文
* ECS(Execute Context Stack): js函数执行上下文从逻辑上形成一个栈。栈底总是全局上下文，栈顶是当前（活动的）执行上下文。
* GC(Global Context): 全局上下文。
* GO(Global Context): 全局上下文生成的对象。
* VO(Var Object): 声明时对象。
* AO(Action Object): 执行时对象。

![看下这张图](http://i.feidom.com/%E5%87%BD%E6%95%B0%E6%89%A7%E8%A1%8C%E6%9C%BA%E5%88%B6.png)

在AO执行时，分为两个阶段：
  * 变量定义：AO的准备阶段，es6之前的**变量提升**就在这个阶段
  * 变量赋值。

#### 数据结构
```javascript
// 全局上下文
GC:{
  lexicalEnvironment: { // 词法环境
    EnvironmentRecord: { // 环境记录
      Type: "Object",
      {...}, // 标识符什么的其他信息
      outer: null, // 全局上下文没有引用
    }
  },
  variablesEnvironment:{ // 变量环境

  }
}

// 函数执行上下文 Function Exection Context
EC:{
  lexicalEnvironment: { // 词法环境
    EnvironmentRecord: { // 环境记录
      Type: "Declarative", //函数环境
      {...}, // 标识符什么的其他信息
      outer: '<Global outer>, <function enviroment reference>,', // 对全局环境或外部函数环境的引用
    }
  },
  variablesEnvironment:{ // 变量环境

  }
}
```
为了适配早起的ES5的var等，增加了变量环境。变量环境也是一个词法环境，其环境记录其包含了由变量声明语句。
在ES6中，词法环境记录器和变量环境记录器的区别在于：
* 词法环境：用于存储函数声明和变量（let，const）的绑定。
* 变量环境：仅用于存储变量（var）的绑定

#### 作用域链
* scope chain：作用域链
其实就是在 [AO,GC,VO] 时。
**闭包原理** 在作用域scope堆空间中存储closore(fn)。