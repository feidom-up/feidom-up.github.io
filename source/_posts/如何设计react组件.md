---
title: 如何设计react组件
date: 2020-12-29 19:33:19
tags:
- react
categories: react
---
#### 痛定思痛
没有很好的设计模式，写代码将会凌乱无序。没有模块划分，也没有组合的思想。
* 把一个页面写成一个组件
* 一个组件有3000行代码

#### 基于场景的设计分类
围绕“如何组合”根据不同的场景设计不同模式
* 组件的类别
    * 无状态组件/哑组件/展示组件： 只做展示、独立运行、不额外增加功能的组件
        * 优点： 
            * 展示组件的复用性更强，复用率更高
            * 内部没有任何的state，只受制于外部的props传参
        * 衍生出的其他组件设计
            * 代理组件：基于ui框架的其他组件，外面封装一层，实现代理组件。
                1. 更换ui框架时更方便。解决了组件库的强依赖特性，实现无痛切换
                2. 都内聚在代理组件中，修改基础组件的属性更方便，不会散落在各处
            * 样式组件：本质上也是一种代理组件，但是又细分了处理样式的领域，将当前的关注点分离在组件内
                1. 自身承接业务判断逻辑，封装了ui库中的组件来控制样式，改动会更方便更友好
            * 布局组件： 基本设计与样式组件完全一样，增加了一个小优化
                1. 布局组件一般不根据状态改变，所以可以封装布局组件后，可以直接使用`shouldComponentUpdate`函数阻断渲染，提升性能

    * 有状态组件/灵巧组件： 处理业务逻辑与数据状态的组件
        灵巧组件更专注于业务本身；灵巧组件一定要至少包含一个灵巧组件或展示组件。功能更丰富，但复用率低
        * 衍生出的其他组件设计
            * 容器组件：几乎没有复用性，主要功能在**拉取数据**和**组合组件** 
            * 高阶组件： React中复用组件的高级技术，基于React组合特性形成的设计模式
                1. 道理类似函数式编程的高级函数（接收一个函数，返回一个函数），高阶组件接收参数为组件，返回值也是新一个组件。
                2. 可抽取公共逻辑
                    * 登陆态的判断
                    ```javascript
                        // 装饰器
                        const checkLogin = () => {
                            return !!localStorage.getItem('token')
                        }
                        // 装饰器写法
                        @checkLogin
                        class UserPage extends  React.Component {
                            ...
                        }
                        @checkLogin
                        class OrderPage extends  React.Component {
                            ...
                        }


                        // 高阶函数
                        const checkLogin = (WrappedComponent) => {
                            return (props) => {
                                return checkLogin() ? <WrappedComponent {...props} /> : <LoginPage />;
                            }
                        }
                        // 函数写法
                        class RawUserPage extends  React.Component {
                            ...
                        }
                        const UserPage = checkLogin(RawUserPage)

                    ```
                    * 页面埋点统计
                    ```javascript
                    const trackPageView = (pageName) = { 
                        // 发送埋点信息请求
                        ... 
                    }
                    const PV = (pageName) => {
                        return (WrappedComponent) => {
                            return class Wrap extends Component {
                            componentDidMount() {
                                trackPageView(pageName)
                            }
                            render() {
                                return (
                                <WrappedComponent {...this.props} />
                                );
                            }
                            }
                        };
                    }
                    @PV('用户页面')
                    class UserPage extends  React.Component {
                        ...
                    }
                    @PV('购物车页面')
                    class CartPage extends  React.Component {
                        ...
                    }
                    @PV('订单页面')
                    class OrderPage extends  React.Component {
                        ...
                    }
                    ```
                    * 既要判断登陆态，又要埋点：**链式调用**
                        链式调用是函数式编程高级函数的一种使用场景。在链式调用后，装饰器会按照从外向内、从上往下的顺序进行执行。
                        ```javascript
                        // 函数调用方式
                        class RawUserPage extends React.Component {
                            ...
                        }
                        const UserPage = checkLogin(PV('用户页面')(RawUserPage))

                        // 装饰器调用方式

                        @checkLogin
                        @PV('用户页面')
                        class UserPage extends  React.Component {
                            ...
                        }

                        ```
                3. 渲染劫持
                    渲染劫持可以通过控制 render 函数修改输出内容，常见的场景是显示加载元素
                    ```javascript
                    function withLoading(WrappedComponent) {
                        return class extends WrappedComponent {
                            render() {
                                if(this.props.isLoading) {
                                    return <Loading />;
                                } else {
                                    return super.render();
                                }
                            }
                        };
                    }

                    ```
                    通过高阶函数中继承原组件的方式，劫持修改 render 函数，篡改返回修改，达到显示 Loading 的效果。
            * 高阶组件的缺点
                * 丢失静态函数：由于被包裹了一层，所以静态函数在外层是无法获取的。
                    ```javascript
                    // UserPage.jsx
                    @PV('用户页面')
                    export default class UserPage extends  React.Component {
                        static getUser() {
                            ...
                        } 
                    }
                    // page.js
                    import UserPage from './UserPage'
                    UserPage.checkLogin() // 调用失败，并不存在。
                    ```
                    *解决方案*：在外部函数中把内部函数的方法复制出来：`hoist-non-react-statics`(现成的库)
                    ```javascript
                    import hoistNonReactStatics from 'hoist-non-react-statics';
                    const PV = (pageName) => {
                        return (WrappedComponent) => {
                            class Wrap extends Component {
                                componentDidMount() {
                                    trackPageView(pageName)
                                }
                                render() {
                                    return (
                                    <WrappedComponent {...this.props} />
                                    );
                                }
                            }
                            hoistNonReactStatics(Wrap, WrappedComponent);
                            return Wrap;
                        };
                    }
                    ```
                * refs 属性不能透传: ref 属性由于被高阶组件包裹了一次，所以需要进行特殊处理才能获取。React 为我们提供了一个名为 React.forwardRef 的 API 来解决这一问题，以下是官方文档中的一个案例：
                    ```javascript
                    function withLog(Component) {
                        class LogProps extends React.Component {
                                componentDidUpdate(prevProps) {
                                console.log('old props:', prevProps);
                                console.log('new props:', this.props);
                            }
                            render() {
                                const {forwardedRef, ...rest} = this.props;
                                // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
                                return <Component ref={forwardedRef} {...rest} />;
                            }
                        }
                        // 注意 React.forwardRef 回调的第二个参数 “ref”。
                        // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
                        // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
                        return React.forwardRef((props, ref) => {
                            return <LogProps {...props} forwardedRef={ref} />;
                        });
                    }
                    // 这段代码读起来会有点儿头皮发麻，它正确的阅读顺序应该是从最底下的 React.forwardRef 部分开始，通过 forwardedRef 转发 ref 到 LogProps 内部。
                    ```
                
#### 所以：组件的目录结构
```javascript
// 通过目录级别完成切分
    src
    ├── components
    │   ├── basic   // 最基本的展示组件放入 basic 目录中 建议使用类似 Storybook 的工具进行组件管理。
    │   ├── container  //将容器组件放入 container
    │   └── hoc  //高阶组件放入 hoc 中
    └── pages  //将页面外层组件放在页面目录中
```
> [Storybook官网](https://storybook.js.org/)





