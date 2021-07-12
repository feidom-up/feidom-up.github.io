---
title: 从props的children中获取ref
date: 2021-07-12 17:46:29
tags:
- react
categories: react
---

#### 从`props.children`中处理ref

```javascript
class Child extends React.Component {

  render() {
    return <div>Child</div>;
  }
}  

class GetRef extends React.Component {

  componentDidMount() {
    console.log(this.ref);
  }

  render() {
    const childElement = React.Children.only(this.props.children);

    return React.cloneElement(
      childElement, 
      { ref: el => this.ref = el }
    );
  }

}

class App extends Component {

  render() {
    return <GetRef><Child/></GetRef>;
  }

}
```

#### 结合转发ref将ref绑定到children组件中的div中
```javascript
// Com组件
interface Props {
  forwardedRef: ref | null;
}
class Com extends React.Component<Props, State> {
  render() {
    const {forwardedRef} = this.props;
    return <>
      <div>
        <div>
          <div ref={forwardedRef}></div>
        </div>
      </div>
    <>
  } 
}
const forwardRefCom =  React.forwardRef((props, ref) => (
    <Com forwardedRef={ref} {...props} />
  ));
return forwardRefCom;
```