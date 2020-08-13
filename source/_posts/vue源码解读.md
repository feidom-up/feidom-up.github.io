---
title: vue源码解读
date: 2020-08-13 14:45:50
tags:
- vue
- vue源码解读
categories: vue
---
### 先来一张vue双向绑定的工作流程图
![vue的工作流程图](http://i.feidom.com/vue%E5%B7%A5%E4%BD%9C%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

### 解析这张图
> 以下的解析以图中的数据value为例。

* vue双向绑定的设计模式，来自于**观察者模式**，对观察者模式的理解，请查看我的另一篇笔记：[设计模式-观察者模式](/2020/08/12/观察者模式/)

    **Observer**:封装了`Object.defineProperty`，用来监测数据value的getter和setter，通知到Dep。
    **Dep**:相当于电话本（通俗的理解）
    **Watcher**：在电话本中注册订阅，订阅value。
    **Directive**：指令，根据不同的数据渲染视图。更新Dom视图
    **Dom**：渲染value

* 粗略版工作流
    * **Observer中，value的setter被更新触发** ==notify==》 **Dep(电话本)** ==update==》 **Watcher**  ==update==》 **Directive** ==update==》 **Dom**

    * **Observer** ==depend==》 **Dep**: Observer依赖Dep。
    * **Watcher** ==addDep==》 **Dep**：Watcher发现指令中需要用到vaule。在Dep(通俗的电话本)中注册。
    * **Directive** ==update==》 **Dom**: 指令语句更新Dom。其中存在 `html 《==转换==》 vNode(vue的虚拟Dom)`。

### 各阶段间详细解读
* [html 《==转换==》 vNode](/2020/08/13/vue源码解读之html与vNode间的转换/)
* [Observer重写array监听](/2020/08/12/vue源码解析之observer重写array监听/)
    
        
        



