---
title: react的转发ref
date: 2021-07-12 17:18:41
tags:
- react
categories: react
---

#### 简单理解
使用通用的高阶组件时，外层组件ref控制高阶组件中包裹的子组件中的元素，此时外层组件传入的ref并不作用于高阶上，这个时候，高阶组件就要用到`React.forwardRef`进行ref转发。

#### 官方文档
[React.forwardRef](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref)

#### 简单举栗🌰
🌰栗子 来自[JamesSawyer----React 中的转发ref](https://www.jianshu.com/p/ea89610dbbfd)
```javascript
  // 高阶组件
import React from 'react';

function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('先前的属性：', prevProps);
      console.log('当前属性：', this.props);
    }
    
    render() {
      // 使用forwardedRef作为一个ref属性传入组件中
      const { forwardedRef, ...rest } = this.props;
      return (
        <Component ref={forwardedRef} {...rest} />
      );
    }
  }
  
  // 使用React.forwardRef对LogProps组件进行转发
  return React.forwardRef((props, ref) => (
    {' 上面定义的LogProps组件接受一个forwarded属性 '}
    <LogProps forwardedRef={ref} {...props} />
  ));
}

// FancyButton.js 子组件
import React from 'react';
import logProps from './logProps';

// 接受props和ref作为参数
// 返回一个React 组件
const FancyButton = React.forwardRef((props, ref) => (
    <button class="fancybutton" ref={ref}>
    {props.children}
  </button>
));

// 使用高阶组件对其进行封装
export default logProps(FancyButton);

// 父组件
// app.js
class App extends React.Component {
  
  constructor(props) {
    super(props);
    // 创建一个ref 名字随意
    this.ref = React.createRef();
  }
  
  componentDidMount() {
    console.log('ref', this.ref);
    // this.ref.current 表示获取ref指向的DOM元素
    this.ref.current.classList.add('primary'); // 给FancyButton中的button添加一个class
    this.ref.current.focus(); // focus到button元素上
  }
  
  render() {
    // 直接使用ref={this.fancyButtonRef}
    return (
        <FancyButton ref={this.fancyButtonRef}>子组件</FancyButton>
    );
  }
}
```