---
title: vue3的数据响应式系统
date: 2021-03-19 15:54:57
tags:
- vue
- vue源码解读
categories: vue
---

### Vue2.0的数据监听
**Object.defineProperty**
```javascript
    const object1 = {};

    Object.defineProperty(object1, 'property1', {
        value: 42,
        writable: false,
        get(){},
        set(newValue) { bValue = newValue; },
        enumerable : true,
        configurable : true
    });

    object1.property1 = 77;
    // throws an error in strict mode

    console.log(object1.property1);
    // expected output: 42
```
### Vue3.0的数据响应式系统
**proxy** get\set

```javascript
// 引用vue-next(3)源码中'packages/reactivity/dist/reactivity.global.js'

const {reactive, effect} = VueObserver;
//  reactive: 把数据处理成为响应式数据
//  effect: 
//      1.首先会执行一次对应的监听函数
//      2.修改对应监听函数内使用的响应式数据，对应的监听函数就会立即执行，重新执行的过程就会获取新的数据
const yideng = {count: 0};
const state = reactive(yideng);
const fn = ()=>{
    const count = state.count;
    const.log('当前的count', count)
    //render(count)  如果在这触发render渲染
}

effect(fn)
```
