---
title: vue使用jest问题解决
date: 2020-09-03 09:40:51
tags:
- 问题解决
- 单元测试
---
vue项目中用jest测试时，遇到几个问题，在这记录以下踩的坑，以后爬得快。

#### SecurityError: localStorage is not available for opaque origins
详细报错如下：
```
Test suite failed to run

SecurityError: localStorage is not available for opaque origins


at Window.get localStorage [as localStorage] (node_modules/jsdom/lib/jsdom/browser/Window.js:257:15)
          at Array.forEach (<anonymous>)
```

解决方法：
在`jest.conf.js`文件中，增加配置`testURL: "http://localhost/"`，如下:
```
{
    ...,
    testURL: "http://localhost/"
}
```

#### Handlebars报错
导致测试报告没有数据展示，详细报错如下：
![handlebars报错](http://i.feidom.com/handlebars_error.png)
```
Handlebars: Access has been denied to resolve the property "statements" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
Handlebars: Access has been denied to resolve the property "branches" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
Handlebars: Access has been denied to resolve the property "functions" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
Handlebars: Access has been denied to resolve the property "lines" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details

```
[报错原因](https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access)说的很清楚，是Handlebars版本的问题。
解决方法：
1. 移除node_moudules包
```
rm -rf node_moudules
```
2. 在package.json文件中，新增`"handlebars": "4.5.0",`这个包,相当于手动添加这个包
```javascript
// package.json
"devDependencies": {
    ...,
    "handlebars": "4.5.0",
}
```
3. `yarn.lock`这个文件中，修改handlebars的包配置和所有依赖handlebars包的包配置
```
handlebars@^4.0.3:
    version "4.7.6"
```
改为==》
```
handlebars@4.5.0:
  version "4.5.0"
```
修改依赖handlebars的包的配置
```
istanbul-reports@^1.5.1:
  version "1.5.1"
  resolved "https://registry.yarnpkg.com/istanbul-reports/-/istanbul-reports-1.5.1.tgz#97e4dbf3b515e8c484caea15d6524eebd3ff4e1a"
  integrity sha512-+cfoZ0UXzWjhAdzosCPP3AN8vvef8XDkWtTfgaN+7L3YTpNYITnCaEkceo5SEYy644VkHka/P1FvkWvrG/rrJw==
  dependencies:
    handlebars "^4.0.3" 
```
改为==》
```
istanbul-reports@^1.5.1:
  version "1.5.1"
  resolved "https://registry.yarnpkg.com/istanbul-reports/-/istanbul-reports-1.5.1.tgz#97e4dbf3b515e8c484caea15d6524eebd3ff4e1a"
  integrity sha512-+cfoZ0UXzWjhAdzosCPP3AN8vvef8XDkWtTfgaN+7L3YTpNYITnCaEkceo5SEYy644VkHka/P1FvkWvrG/rrJw==
  dependencies:
    handlebars "4.5.0"
```

#### 警告：mapCoverage这个配置应该被移除，因为计算覆盖率的时间并不长
* 详细警告如下：
```
Deprecation Warning:

  Option "mapCoverage" has been removed, as it's no longer necessary.

  Please update your configuration.

  Configuration Documentation:
  https://facebook.github.io/jest/docs/configuration.html
```

* 这个配置在jest配置文档中的解释如下：

If you have transformers configured that emit source maps, Jest will use them to try and map code coverage against the original source code when writing reports and checking thresholds. This is done on a best-effort basis as some compile-to-JavaScript languages may provide more accurate source maps than others. This can also be resource-intensive. If Jest is taking a long time to calculate coverage at the end of a test run, try setting this option to false.

Both inline source maps and source maps returned directly from a transformer are supported. Source map URLs are not supported because Jest may not be able to locate them. To return source maps from a transformer, the process function can return an object like the following. The map property may either be the source map object, or the source map object as a JSON string.

大致意思是：
*如果您配置了发出源映射的转换器，那么在编写报告和检查阈值时，Jest将使用它们来尝试将代码覆盖率映射到原始源代码上。这样做需要付出最大的努力，因为一些编译到javascript的语言可能比其他语言提供更准确的源映射。这也可以是资源密集型的。如果Jest在测试运行结束时花费很长时间来计算覆盖率，请尝试将此选项设置为false。

支持内联源映射和从转换器直接返回的源映射。不支持源映射url，因为Jest可能无法定位它们。要从转换器返回源映射，process函数可以返回如下所示的对象。map属性可以是源映射对象，也可以是JSON字符串形式的源映射对象。

* 解决方法：
在`jest.conf.js`文件中，移除`mapCoverage:true`这个配置。