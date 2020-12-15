---
title: vue定义全局方法
date: 2020-11-05 08:34:48
tags: 
- vue
categories: vue
---

### 一、将方法挂在到vue原型(Vue.prototype)上

* 定义：
```javascript
    // global.js
    const Func = ()=>{
        console.log('global')
    }
    export default {
        Func
    }
```

* 在main.js中配置
```javascript
    // main.js
    import Vue from 'vue'
    import global from '@/global'
    object.keys(global).forEach((key)=>{
        Vue.prototype['$global' + key] = global[key]
    })
```

* 使用
```javascript
    export default {
        mounted(){
            this.$globalFunc()
        }
    }
```
> 缺点，调用的时候，没有方法提示

### 二、全局混入mixin

* 定义：
```javascript
    // mixin.js
    const mixin = {
        methods: {
            func(){
                console.log('global')
            },
            ...
        }
    }
    export default mixin
```
* 在main.js中配置
```javascript
    // main.js
    import Vue from 'vue'
    import mixin from '@/mixin'
    Vue.mixin(mixin)
```
* 在vue文件中使用
```javascript
    export default {
        mounted(){
            this.func()
        }
    }
```
> mixin里的methods会和创建的每个单文件组件合并，调用方法时有提示

### 三、使用Plugin
> Vue.use的实现本身没有挂载功能，只是触发了插件的install方法，本质上还是使用了`Vue.prototype`
* 定义：
```javascript
    // plugin.js
    function func(){
        console.log('global')
    }
    const plugin = {
        // install是plugin中默认的方法
        // 当外界在use这个组件或函数的时候，就会调用本身的install方法，同时传入一个Vue这个类的参数
        install: function(Vue){
            Vue.prototype.$pluginGlobalFunc = func
        }
    }
    export default plugin
```

* 在main.js中配置
```javascript
    // main.js
    import Vue from 'vue'
    import plugin from '@/plugin'
    Vue.use(plugin)
```
* 在vue文件中使用
```javascript
    export default {
        mounted(){
            this.$pluginGlobalFunc()
        }
    }
```
> mixin里的methods会和创建的每个单文件组件合并，调用方法时有提示

### 四任意vue文件中写全局函数
```javascript
    // 创建全局方法
    this.$root.$on('func', function(){
        console.log('global');
    });
    // 销毁全局方法
    this.$root.$off('func');
    // 调用全局方法
    this.$root.$emit('func');
```

> 本章内容主要来自京城一灯