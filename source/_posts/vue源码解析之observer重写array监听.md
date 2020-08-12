---
title: vue2.x源码解读之observer重写array监听
date: 2020-08-12 14:37:36
tags:
- vue
- vue源码解读
categories: vue
---
### Observer
vue的核心功能之一就是双向绑定，在vue2.x中，双向绑定的原理，是依赖[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)这个方法。由于这个方法的一些弊端，导致Observer的实现，需要兼容这些弊端。以下内容详细说明了来龙去脉

### 先自己实现一个Observer
```javascript
    function defineReactive(data, key, value){
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function defineGet(){
                console.log(`get key: ${key} vaule:${value}`);
                return value
            },
            set: function defineSet(newVal){
                console.log(`set key: ${key} vaule: vaule:${newVal}`);
                value = newVal
            }
        })
    }
    function observe(data){
        Object.keys(data).forEach(function(key){
            defineReactive(data,key,data[key])
        })
    }
    // let arr = [1, 2, 3]
    // observe(arr)
```
* 首先对数组(arr)的监听
```javascript
let arr = [1, 2, 3]
observe(arr)
```
1. 代码运行后，在控制台直接给arr增加一个元素。代码及输出如下：
```javascript
// 键入
arr[3] = 4;
// 输出
// 4
```
===> **新增的数组元素无法监听**
原因： 在监听数组arr时，监听了它的key:0,1,2(数组下标)。并没有监听下标3，所以监听失败。
2. 代码运行后，在控制台直接给arr最前面unshift一个元素。代码及输出如下：
```javascript
// 键入
arr.unshift(1);
// 输出
// get key: 2 vaule:3
// get key: 1 vaule:2
// set key: 2 vaule: vaule:2
// get key: 0 vaule:1
// set key: 1 vaule: vaule:1
// set key: 0 vaule: vaule:4
// 4
```
===> **在进行部分数组操作时，会造成监听多次**（数组移位）
原因： 在监听数组arr时，监听了它的key:0,1,2(数组下标)。当在数组arr的前面插入一个数据，造成数组移位（splice也会这样），所有的元素向后移动一个位置。造成多次get/set。
如下图所示：
![数组移位](http://i.feidom.com/%E6%95%B0%E7%BB%84%E7%A7%BB%E4%BD%8D.png)

* 对对象(obj)的监听
```javascript
let obj = {"key1":"vaule1"}
observe(obj)
```
1. 代码运行后，在控制台直接给obj增加一个元素`obj["key2"] = "value2"`。代码及输出如下：
```javascript
// 键入
obj["key2"] = "value2";
// 输出
// "value2"
```
===> **新增的对象元素无法监听**
原因类同监听数组时的情况1

### Observer的Object.defineProperty这些问题，vue如何解决
在vue的core中，observe下专门对array的监听进行了重写，以下内容为源码中的代码片段，来说明如何重写实现。
```javascript
import { def } from '../util/index'

const arrayProto = Array.prototype  // 获取Array原型
export const arrayMethods = Object.create(arrayProto)  // 用新的原型对象创建一个arrayMethods

// 定义一个要重写的方法的数组，其中的方法，都是会发生数组移位的
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * 拦截变化方法并发出事件,遍历重写的方法的数组methodsToPatch
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // def是一个Object.defineProperty
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change 
    // 手动发布变更信息
    ob.dep.notify()
    return result
  })
})
```