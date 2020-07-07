---
title: categories和tags页面不自动收录的问题
date: 2020-07-06 09:51:18
tags: 
- 问题解决
- 技术
- hexo
categories: hexo
---

在使用hexo的过程中，发现分类(categories)页面和标签(tags)页面不自动收录文章(其实收录了，只是没显示)的categories和tags。
解决方案：
* 编辑categories/index.md
```
title: 分类
date: 2020-07-01 08:56:35
type: categories

增加下面这一行
layout: "categories"
```
* tags/index.md
```
title: 标签
date: 2020-07-01 09:03:55
type: "tags"

增加下面这一行
layout: "tags"
```

