---
title: React面向组件跨层级通信
date: 2020-12-31 17:13:02
tags:
- react
categories: react
---

#### 父与子
    父组件包裹子组件，父组件向子组件传递数据。
```javascript
    // 子 
    const Button = ({ text }) => {
        <button type="button">{text}</button>
    }
    // 父
    class HomePage extends React.Component {
    state = {
        text: "默认文案"
    }
    asyc componentDidMount() {
        const response = await fetch('/api/buttonText')
        this.setState({
        text: response.buttoText
        })
    }
        render() {
            const {
            text
            } = this.state
            return (
                <Button text={text} />
            )
        }
    }
```
这样的通信方式非常适用于展示组件。
#### 子与父
    子组件存在于父组件之中，子组件需要向父组件传递数据。
* 回调函数（主要方式）

```javascript
// 子
class FetchPosts extends React.Component {
    state = {
        loading: true,
        data: []
    }
    async componentDidMount() {
        const response = await fetch('/api/posts')
        this.setState({
            data: response.data,
            loading: false,
        })
    }
    render() {
        if (this.state.loading) {
            return <Loading />  
        }
        return this.props.renderPosts(this.state.data)
    }
}
// 父
class HomePage extends React.Component {
    render() {
        return (
        <FetchPosts
            renderPosts={posts => (
            <ul>
                {posts.map(post => (
                <li key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                </li>
                    ))}
                </ul>
            )}
        />)
    }
}
```

* 实例函数（不符合 React 的设计理念，不被推荐）
```javascript
import React from 'react'
class HomePage extends React.Component {
   modalRef = React.createRef()  //实例
   showModal = () ={
     this.modalRef.show()
   }
   hideModal = () => {
     this.modalRef.hide()
   }
    render() {
        const {
          text
        } = this.state
        return (
            <>
              <Button onClick={this.showModal}>展示 Modal </Button>
              <Button onClick={this.hideModal}>隐藏 Modal </Button>
              <Modal ref={modalRef} />
            </>
          />
        )
    }
}
```
#### 兄弟
    两个组件并列存在于父组件中，数据需要进行相互传递，往往依赖共同的父组件进行中转。
```javascript
// 子
class Input extends React.Component {
    handleChanged = (e) => {
        this.onChangeText(e.target.text)
    }
    render() {
        return <input onChange={handleTextChanged} />
    }
}
// 子
const StaticText = ({ children }) => {
    return (
        <P>{children}</p>
    )
}
// 父
class HomePage extends React.Component {
    state = {
        text: '默认文案'
    }
    handleTextChanged = (text) => {
        this.setState({
        text,
        })
    }
    render() {
        return (
            <>
              <Input onChangeText={this.handleTextChanged} />
              <StaticText>this.state.text</StaticText> 
            </>
        )
    }
}
```
#### 无直接关系
    两个组件并没有直接的关联关系，处在一棵树中相距甚远的位置，但需要共享、传递数据。

* Context
    Context 第一个最常见的用途就是做 i18n
    1. i18n使用Context `I18nContext`
    ```javascript
    import  { createContext } from 'react';
    const I18nContext = createContext({
        translate: () => '',
        getLocale: () => {},
        setLocale: () => {},
    });
    export default I18nContext;
    ```
    2. 用`I18nContext`封装个组件`I18nProvider`
    ```javascript
    import React, { useState } from 'react';
    import I18nContext from './I18nContext';
    class I18nProvider extends React.Component {
        state = {
            locale: '',
        }
        render() {
            const i18n =  {
                translate: key => this.props.languages[locale][key],
                getLocale: () => this.state.locale,
                setLocale: locale => this.setState({
                    loacal,
                })
            }
            return (
                <I18nContext.Provider value={i18n}>
                    {this.props.children}
                </I18nContext.Provider>
            )
        }
    }
    export default I18nProvider;
    ```
    3. 用`I18nContext`实现高阶组件`withI18n`
    ```javascript
    import React from 'react';
    import I18nContext from './I18nContext';
    const withI18n = () => {
        return WrappedComponent => {
            return (props) => (
            <I18nContext.Consumer>
                {i18n => <WrappedComponent {...i18n} {...props} />}
            </I18nContext.Consumer>
            )
        }
    };
    export default withI18n;
    ```
    4. 在最顶层注入 Provider
    ```javascript
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';
    import { I18nProvider } from './i18n';
    const locales = [ 'en-US', 'zh-CN' ];
    const languages = {
        'en-US': require('./locales/en-US'),
        'zh-CN': require('./locales/zh-CN'),
    }
    ReactDOM.render(
        <I18nProvider locales={locales} languages={languages}>
            <App />
        </I18nProvider>,
        document.getElementById('root')
    );
    ```
    5. 在需要的地方使用
    ```javascript
    const Title = withI18n(
        ({ translate }) => { 
            return ( <div>{translate('title')}</div> )
        }
    )
    const Footer = withI18n(
        ({ setLocale }) => { 
            return ( <Button onClick=(() => {
                setLocale('zh-CN')
            }) /> )
        }
    )
    ```

* 全局变量
    全局变量，顾名思义就是放在 Window 上的变量。但值得注意的是修改 Window 上的变量并不会引起 React 组件重新渲染。
* 状态管理框架
    * Flux
    * Redux
    * Mobx
