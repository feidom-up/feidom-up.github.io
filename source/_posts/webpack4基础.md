---
title: webpack4基础
date: 2020-11-25 10:16:54
tags: 
- 前端工程化
- webpack
categories: webpack
---

#### 安装
`yarn add webpack webpack-cli`


#### 基础配置

* **entry**  依赖入口

```javascript
entry: '{path}/app.js' //单入口 SPA
entry: {
    app: '{path}/app.js',
    otherapp: '{path}/otherapp.js'
} //多入口 MPA
```

* **output**  指定打包后的输出

```javascript
output: {
    path: path.resolve(__diranme,'dist')
    filename: '[name].js' // 单入口可以写死文件名，多入口一定要使用占位符[name]，来自动生成多个文件
    // filename: '[name].[chunkhash:5]]js'
    // filename: '[name].[hash]js'
}
```

* **Loaders** 解析器
    * webpack本身只支持js和json两种文件类型，其他类型的文件需要各种`Loaders`支持，转化为有效的模块。
    * 本身是一个函数，接受源文件作为参数，返回转换的结果
    * 常用loaders
    | loader | 作用 |
    |  :-----  | :-----  |
    | ts-loader | 加载解析ts文件 |
    | babel-loader | 在webpack中使用babel解析ES6 |
    | css-loader/less-loader/scss-loader | css/less/sass解析器 |
    | cstyle-loader |将样式通过 style 标签，插入到 head 中 |
    | url-loader/file-loader | 处理文件，图片、字体、多媒体 url-loader 实现较小的图片转成base64，插入到代码中，当超过限制的limit后，会自动降级到file-loader |
    | raw-loader | 将.txt文件以字符串的形式导入 |
    | thread-loader | 多进程打包js和css |

    ```javascript
    // webpack.config
    module: {
        rules: [
            // 解析ES6,app根目录要配置.babelrc，如下面的.babelrc
            {test: /.js?x$/, use: 'babel-loader', exclude: /node_modules/} // exclude 除去node_modules里的文件
            // 将.txt文件以字符串的形式导入
            {test: /.txt$/, use: 'raw-loader'},
            // 匹配sass/css文件，用对应的loader处理文件
            {
                test: /.s?css$/,
                use: [
                isDev ? 'style-loader' : MiniCssExtractPlugin.loader
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        // css模块化使用
                        modules: {
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        }
                    }
                },
                // 预处理器, autoprefixer(需要安装)
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => {
                            require('autoprefixer')({
                                browsers: ['last 2 version', '>1%', 'ios7']
                            })
                        }
                    }
                },
                'sass-loader',
                // px自动转rem
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75, // 一个rem等于多少px
                        remPrecision: 8 // px转换成rem的小数位
                    }
                }
                ],
                include: [],
                exclude: [
                    Root('src/components')
                ]
            },
            // 
            {
                test: /\.(png|jpg|jpeg|gif|eot|woff|woff2|ttf|svg|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10 * 1024, // 10k
                            name: isDev ? 'images/[name].[ext]' : 'images/[name].[hash.[ext]',
                            publicPath: idDev ? '/' : 'cdn地址',
                        },
                    },
                    // prduction，用于图片压缩
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true
                        }
                    }
                ]
            },
        ]
    }
    // .babelrc
    {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        "plugins": [
            // 各种插件
            "@babel/propsoal-class-properties"
        ]
    }
    ```

* **plugins** 插件
    插件用于bundle文件的优化，资源管理和环境变量注入，作用于整个构建过程
    * webpack-dev-server 热更新
        详情请关注[webpack热更新原理](/2020/12/15/webpack热更新原理/)
    * webpack-dev-middleware 
    > 将webpack输出文件传输给服务器，适用于灵活的定制场景
    ```javascript
    const express = requrie('express')
    const webpack = require('webpack')
    const webpackDevMiddleware = requrie('webpack-dev-middleware')

    const app = express()
    const config = require('./webpack.config.js')
    const compiler = webpack(config)

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }))
    app.listen(3000)
    ```
    * mini-css-extract-plugin和optimize-css-assets-webpack-plugin
    > 提取css，建议使用contenthash
    ```javascript
    module: {
        rules: [
            {
                test: /.s?css$/,
                use: [
                isDev ? 'style-loader' : iniCssExtractPlugin.loader
                {
                    loader: 'css-loader',
                    options: {
                    importLoaders: 1,
                    // css模块化使用
                    modules: {
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    }
                    }
                },
                'postcss-loader',
                'sass-loader'
                ]
            },
        ]
        },
        plugins: [
            // 提取css
            new MiniCssExtractPlugin({
                filename: 'styles/[name].[contenthash:5].css',
            }),
            // 压缩css
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require("cssnano"),//需要安装cssnano
                cssProcessorPluginOptions: {
                preset: [
                    'default',
                    {
                    discardComments: {
                        removeAll: true
                    }
                    }
                ]
                },
                canPrint: true
            }),
        ]
    ```
    * html-webpack-plugin 
    ```javascript
    plugins: [
        new HtmlWebpackPlugin({
            // 自定义参数title传递到html中
            // html中使用<title><%= htmlWebpackPlugin.options.title %></title>
            // <script>let number = <%= htmlWebpackPlugin.options.number %><script>
            number: 1,
            title: '京程一灯',
            filename: 'index.html',
            // chunks: ['index'] //用于多页面，使用哪些chunk
            template: resolve(__dirname, '/src/index.html'),
            minify: {
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
            collapseWhitespace: true,
            preserveLineBreak: false,
            removeAttributeQuotes: true,
            removeComments: false
            }
        }),
    ]
    ```
    * clean-webpack-plugin 或者使用 rimraf dist
    ```javascript
    plugins: [
        new CleanWebpackPlugin()
    ]
    ```

* **mode** 
    * 用来指定当前构建环境 development、production 和 none
    * 设置 mode 可以使用 wepack内置函数，内部自动开启一些配置项，默认值为 production

    内置功能
    development：process.env.NODE_ENV为development,开启NamedChunksPlugin 和 NameModulesPlugin
    这两个插件用于热更新，控制台打印路径
    prodution：process.env.NODE_ENV为prodution.开启 FlagDependencyUsagePlugin、ModuleConcatenationPlugin、NoEmitOnErrorsPlugin，OccurrentceOrderPlugin、SideEffectsFlagPlugin等
    none：不开启任何优化选项

* **watch** 
    * 文件监听可以在webpack命令后加上 --watch 参数，或在webpack.config中设置watch:true。 
    * 原理：轮询判断文件的最后编辑时间是否变化
```javascript
module.exports = {
    // 默认false，不开启
    watch: true,
    // 只有开启时，watchOptions才有意义
    watchOptions: {
        // 忽略，支持正则
        ignored: /node_modules/,
        // 监听到变化后等300ms再执行，默认300ms
        aggregateTimeout: 300,
        // 怕乱文件是否变化是通过不停询问系统指定文件有没变化实现的，默认每秒1000次
        poll: 1000
    }
}
```

* 文件指纹
    * 打包后输出文件名后缀，也就是hash值
    * hash：和整个项目构建相关，只要项目中有一个文件修改，整个项目中的文件hash都会修改成统一的一个
    * chunkhash：和webpck打包的chunk有关，不同的entry会生成不同的chunkhash值（适用于js文件）
    * contenthash：根据文件内容定义hash，文件内容不变，则contenthash不变，用于批量更新（适用于css文件）

* 优化命令行日志
    * 统计信息 stats，webpack属性，这种方式不好
        error-only：值发生错误时输出
        minimal：只在发生错误或有新的编译时输出
        none：没有输出
        normal：标准输出，默认
        verbose：全部输出
    ```javascript
        // development
        devServer: {
            // .....
            stats: 'errors-only'
        }
        // production
        module.exports = {
            stats: 'errors-only'
        }

    ```
    * stats结合friendly-errors-webpack-plugin（推荐）
    ```javascript
    plugins: [
        new FriendlyErrorsPlugin()
    ],
    stats: 'errors-only'
    ```

* 构建异常和中断处理
    * wepback4之前的版本构建失败不会跑出错误码
    * node中的process.exit规范
        0 表示成功完成，回调函数中，err 为 null
        非0 表示执行失败，回调函数中，err 不为空，err.code就是传给exit的数字
    * 主动捕获错误，并处理构建错误
        * 写个插件，compiler 在每次构建结束后会出发done这个hook

    ```javascript
    plugins: [
        function() {
            // webpack3 this.plugin('done', (stats) => {})
            // webpack4
            this.hooks.done.tap('done', (stats) => {
            if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                console.log('build error');
                // dosomething
                process.exit(1);
            }
            })
        }    
    ]      

    ```


> 本博客笔记内容主要来自**京城一灯**公众号 前端先锋 