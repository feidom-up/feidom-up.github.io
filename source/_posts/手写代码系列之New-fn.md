---
title: 手写代码系列之New(fn)
date: 2021-03-17 08:46:47
categories: 手写代码系列
---

### New操作符做了哪些事
* 创建了一个全新的对象。
* 会被执行[[Prototype]]（也就是__proto__）链接。
* 使this指向新创建的对象。
* 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
* 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。

### 实现
* 版本一：
    ```javascript
    function myNew(fn){
        return function(){
            // 创建一个对象，且将其隐式原型指向构造函数原型
            let obj = {
                __proto__: fn.prototype
            }
            // 执行构造函数
            fn.call(obj, ...arguments)
            // 返回该对象
            return obj
        }
    }

    // 使用示例：
    function Person(name, age){
        this.name = name
        this.age = age
    }
    let obj = myNew(Person)('chen', 18)
    ```

* 版本二：
    ```javascript
    function myNew(fn){
        let res = {};
        if(fn.prototype !==null){
            res.__proto__ = fn.prototype;
        }
        let ret = fn.apply(res, Array.prototype.slice.call(arguments, 1));
        if(typeof ret === "object" || typeof ret === "function") && ret !== null{
            return ret
        }
        return res
    }
    // 使用示例：
    function A() {}
    var obj = New(A, 1, 2);
    // equals to
    var obj = new A(1, 2);
    ```