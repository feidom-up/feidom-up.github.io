---
title: vue中使用svg图标
date: 2020-11-03 08:41:24
tags:
- vue
- svg
categories: vue
---

### 对svg图标的简单实用和认识
[svg图标的使用](/2020/07/04/svg图标的使用/)

### 在Vue项目中写一个svg组件
* 安装[svg-sprite-loader](https://www.npmjs.com/package/svg-sprite-loader)插件对svg文件进行编译解析
    `yarn add svg-sprite-loader`
* 在`src/assets/`目录下新建`icons`目录，存放需要用到的svg图标
* 在vue-cli4中，对`vue.config.js`进行配置
    ```javascript
        chainWebpack: config => {
            // set svg-sprite-loader
            // 第一步：让其他svg loader不要对svg进行操作
            config.module
            .rule('svg')
            .exclude.add(path.join(__dirname, 'src/assets/icons'))
            .end()
            // 第二步：使用svg-sprite-loader 对svg进行操作
            config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, 'src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            //定义规则 使用时 <svg class="icon"> <use xlink:href="#icon-svg文件名"></use></svg>
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        }
    ```
* 如果是vue-cli2中，配置`build/webpack.base.conf.js`
    ```javascript
        module.exports = {
            module: {
                rules: [
                    {
                        test: /\.svg$/,
                        loader: "svg-sprite-loader",
                        include: [resolve("src/assets/icons")],
                        options: {
                        symbolId: "icon-[name]"
                        }
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        loader: "url-loader",
                        exclude: [resolve("src/assets/icons")],
                        options: {
                        limit: 10000,
                        name: utils.assetsPath("img/[name].[hash:7].[ext]")
                        }
                    },
                ]
            }
        }
    ```
* 在icons目录下，新建`index.js`文件
    ```javascript
        import Vue from 'vue'
        import SvgIcon from '@/components/common/svgIcon'
        // 全局注册组件
        Vue.component('svg-icon', SvgIcon)
        // 定义一个加载目录的函数
        const requireAll = requireContext => {
            requireContext.keys().map(requireContext)
        }
        const req = require.context('@/assets/icons', false, /\.svg$/)
        // 加载目录下的所有 svg 文件
        requireAll(req)
    ```
* 上述`index.js`中，引用了`svgIcon`组件，在对应的引用路径下新建`svgIcon.vue`文件
    ```vue
        <template>
            <svg :class="svgClass" aria-hidden="true">
                <use :xlink:href="iconName"></use>
            </svg>
        </template>
        <script>
            export default {
                name: 'svg-icon',
                props: {
                    // 组件样式，可以控制svg图标
                    iconClass: {
                        type: String,
                        required: true
                    },
                    // 使用svg文件名的方式使用对应svg图标
                    className: {
                        type: String
                    }
                },
                computed: {
                    iconName() {
                        return `#icon-${this.iconClass}`
                    },
                    svgClass() {
                        if (this.className) {
                            return 'svg-icon ' + this.className
                        } else {
                            return 'svg-icon'
                        }
                    }
                }
            }
        </script>

        <style scoped>
        .svg-icon {
            float: left;
            margin: 4px 6px 0 0;
            width: 13px;
            height: 13px;
            vertical-align: 1px;
            fill: #e1e1e1;
            overflow: hidden;
        }
        </style>
    ```
* 在`main.js`中引入
    `import './assets/icons'`
* 使用svg-icon
    ```vue
    <svg-icon
        :iconClass="'download'"   //覆盖样式类名
        className="downloadIcon"  //文件名
    ></svg-icon>
    ```