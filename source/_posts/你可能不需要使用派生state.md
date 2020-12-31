---
title: 你可能不需要使用派生state
date: 2020-12-28 17:14:17
tags:
- react
categories: react
---

[你可能不需要使用派生state](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

文中列举了两种反模式的使用方式
* 直接复制prop到state
* 在props变化后修改state

这两种使用方式除了增加代码的维护成本外，没有任何的好处