---
title: webpack4定位源代码source-map
date: 2020-12-15 16:22:25
tags:
- 前端工程化
- webpack
categories: webpack
---

#### 定位源代码

* 通过 source-map 定位到源代码
* 开发环境：建议使用
    * 首先在源代码的列信息是没有意义的，只要有行信息就能完整的建立打包前后代码之间的依赖关系。因此不管是开发环境还是生产环境，我们都会选择增加cheap基本类型来忽略模块打包前后的列信息关联。
    * 其次，不管在生产环境还是开发环境，我们都需要定位debug到最最原始的资源，比如定位错误到jsx，coffeeScript的原始代码处，而不是编译成js的代码处，因此，不能忽略module属性
    * 再次我们希望通过生成.map文件的形式，因此要增加source-map属性

* 线上环境关闭
* eval：使用`eval`包裹模块代码
* cheap：不包含列信息
* inline：将.map作为DataURI嵌入，不单独生成.map文件
* module：包含loader的source
* source-map 类型

| devtool | 首次构建 | 二次构建 | 是否适合生产环境 | 可以定位的代码 |
| :-- | :-- | :-- | :-- | :-- |
| (none) | +++ | +++ | yes | 最终输出的代码 |
| eval | +++ | +++ | no | webpack生成的代码块（一个个的模块） |
| cheap-eval-source-map | + | ++ | no | 经过loader转换后的代码（只能看到行） |
| cheap-module-eval-source-map | o | ++ | no | 源代码（只能看到行） |
| eval-source-map | -- | + | no | 源代码 |
| cheap-source-map | + | o | yes | 经过loader转换后的代码（只能看到行） |
| cheap-module-source-map | o | - | yes | 源代码（只能看到行） |
| inline-cheap-source-map | + | o | no | 经过loader转换后的代码（只能看到行） |
| inline-cheap-module-source-map | o | - | no | 源代码（只能看到行） |
| source-map | -- | -- | yes | 源代码 |
| inline-source-map | -- | -- | no | 源代码 |
| hidden-source-map | -- | -- | yes | 源代码 |

```javascript
module.expors = {
  // 开发,因为eval的rebuild速度快，因此我们可以在本地环境中增加eval属性
  devtool: 'cheap-module-eval-source-map'
  // 生产
  devtool: 'cheap-module-source-map'
}
```

> 本博客笔记内容主要来自**京城一灯**公众号 前端先锋 