---
title: vue中使用animate.css
date: 2020-08-07 10:51:11
tags:
- vue
- css
- 动画
categories: vue
---

### 在vue项目中使用animate.css
配合vue中的transition标签来结合animate.css中的效果
* npm install / yarn add 二选一
```bash
    yarn add animate.css@3.5.1
    # 在这要装3.5.1的版本，装了4.0之后的版本，会不生效。是版本兼容问题
```

* `main.js`
```javascript
    import animate from 'animate.css'
    Vue.use(animate);
```

* `component.vue`
```html
<template>
    <div> 
        <transition 
        enter-active-class="animated bounceIn" 
        leave-active-class="animated bounceOut"
        :duration="1000">
            <h3 v-show="show">这个元素存在动画效果</h3>
        </transition>
        <el-button  @click="show=!show">开始表演</el-button>
    </div> 
<template>
```