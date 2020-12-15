---
title: vue中使用gsap的动画插件
date: 2020-08-07 11:01:26
tags:
- vue
- 动画
- tweenmax
- gsap
categories: vue
---
### gsap 动画

[TweenMax基础案例](https://www.tweenmax.com.cn/demo/)

* npm install / yarn add 二选一
```bash
    npm install gsap --save
    yarn add gsap
```

* `component.vue`局部引入，哪里需要哪里搬
```html
<template>
    <div> 
        <div id="demo">
            <p>以下例子每个动画的开始时间按0.5s 错开。TweenLite没有stagger。</p>
            <div class="box green"></div>
            <div class="box grey"></div>
            <div class="box orange"></div>
            <div class="box green"></div>
            <div class="box grey"></div>
            <div class="box orange"></div>
            <div class="box green"></div>
            <div class="box grey"></div>
            <div class="box orange"></div>
        </div>
        <el-button @click="showTest()">开始</el-button>
    </div> 
<template>
<script>
    import { TweenLite, TweenMax } from 'gsap'
    export default {
        methods: {
            showTest: function(){
                //TweenMax、TimelineLite、TimelineMax可以使用stagger（错开动画），TweenLite则没有。
                TweenMax.staggerTo(".box", 1, {rotation:360, y:100}, 0.5);
            }
        }
    };
</script>
```