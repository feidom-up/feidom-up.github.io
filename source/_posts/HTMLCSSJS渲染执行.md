---
title: HTML、CSS、JS互相阻塞？咋回事
date: 2020-07-23 17:08:37
tags: 前端性能优化
categories: 前端性能优化
---

js是同步的，为了操作dom。在html执行中，也由于这个原因，有同步阻塞的情况。

### js的执行会影响Dom渲染吗?
    ```html
        <head>
            <script>
                // 这个script放在dom上边，影响dom解析，也影响dom渲染。
                alert('1')
            </script>
        </head>
        <body>
            <h1>Hello world</h1>
            <script>
                // 这个script放在dom下边，影响dom渲染，不影响dom解析
                alert('1')
            </script>
        </body>
    ```

### css的执行会影响Dom渲染吗?
    ```html
        <head>
            <style>
                h1{
                    color: red !important;
                }
            </style>
            <script>
                setTimeout(()=>{
                    console.log(document.querySelectorAll('h1'))
                },0)
            </script>
            <link rel="stylesheet" href="https://cdn.staticfile.org/animate.css/4.1.0/animate.compat.css" >
            <!-- animate.css没回来之前，script中打印了h1，但是h1并没有在页面中展示。 -->
            <!-- css不影响dom解析，影响dom渲染 -->
        </head>
        <body>
            <h1>Hello world</h1>
        </body>
    ```

### css的执行会影响js执行吗?
    ```html
        <head>
            <style>
                h1{
                    color: red !important;
                }
            </style>
            <link rel="stylesheet" href="https://cdn.staticfile.org/animate.css/4.1.0/animate.compat.css" >
            <!-- animate.css没回来之前，script中没有打印h1。h1并没有在页面中展示。 -->
            <!-- css加载阻塞js执行。原因：js中可能存在对dom元素的操作或者取值，同步解决这个问题。所以阻塞。 -->
        </head>
        <body>
            <h1>Hello world</h1>
            <script>
                console.log('1')
            </script>
        </body>
    ```

### css的执行会影响domReady吗?
domReady时，js可以操作dom。
    ```html
        <head>
            <script>
               document.addEventListener('DOMContentLoaded', function(){
                   console.log('DOMContentLoaded')
               })
            </script>
            <link rel="stylesheet" href="https://cdn.staticfile.org/animate.css/4.1.0/animate.compat.css" >
            <!-- 在animate.css没回来之前，打印了DOMContentLoaded。说明css不影响domReady -->
            <script>
                console.log('111')
            </script>
            <!-- 加了上面这个script脚本时，在animate.css没回来之前，不打印111，也不打印DOMContentLoaded。
            也是因为js中可能存在对dom元素的操作或者取值 -->
        </head>
        <body>
            <h1>Hello world</h1>
        </body>
    ```