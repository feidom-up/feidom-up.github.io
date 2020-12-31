---
title: react生命周期爬坑
date: 2020-12-28 19:43:41
tags:
- react
categories: react
---
由于函数式组件会从头执行到尾，所以生命周期一定是在谈论类组件
### 梳理生命周期的**时机**和**职责**，建立时机与操作的对应关系
  * 使用方式（时机梳理）： 挂载，更新，卸载
  * 适用范围（职责梳理）：状态变更、错误处理

#### 时机梳理

##### 挂载阶段
    挂载阶段是指组件从初始化到完成加载的过程。
* constructor 
    是类通用的构造函数，常用于初始化。所以在过去，constructor 通常用于初始化 state 与绑定函数。
```javascript
class Com extends React.Component{
   // constructor react 官方弃用
   constructor(props){
      super(props)   
      this.state = {count: 0}
   } 
```

* getDerivedStateFromProps
    * 当props被传入
    * state发生变化时
    * fouceUpdate被调用
    > 最常见的一个错误是认为只有 props 发生变化时，getDerivedStateFromProps 才会被调用，而实际上只要父级组件重新渲染时，getDerivedStateFromProps 就会被调用。所以是外部参数，也就是 props 传入时就会发生变化。你可能不需要使用派生 state

* UNSAFE_componentWillMount(componentWillMount)
    用于组件加载前做某些操作
    因在React的异步渲染机制下，会被多次调用。react弃用
    eg：同构时，在服务器端和客户端同时发起请求拉取数据，会分别被执行一次

* render 纯函数  返回jsx解构，描述渲染内容

* componentDidMount
    组件加载完成时做某些操作，用于发起请求

##### 更新阶段
    更新阶段是指外部 props 传入，或者 state 发生变化时的阶段。

* UNSAFE_componentWillReceiveProps
    被标记弃用，因为其功能可被函数 getDerivedStateFromProps 所替代。

* getDerivedStateFromProps
    同挂载阶段的表现一致。

* shouldComponentUpdate
    该方法通过返回 true 或者 false 来确定是否需要触发新的渲染。因为渲染触发最后一道关卡，所以也是性能优化的必争之地。通过添加判断条件来阻止不必要的渲染。

    React 官方提供了一个通用的优化方案，也就是 PureComponent。PureComponent 的核心原理就是默认实现了shouldComponentUpdate函数，在这个函数中对 props 和 state 进行浅比较，用来判断是否触发更新。 

* UNSAFE_componentWillUpdate
    同样已废弃，因为后续的 React 异步渲染设计中，可能会出现组件暂停更新渲染的情况。

* render
    同挂载阶段的表现一致。

* getSnapshotBeforeUpdate
    getSnapshotBeforeUpdate 方法是配合 React 新的异步渲染的机制，在 DOM 更新发生前被调用，返回值将作为 componentDidUpdate 的第三个参数。
    ```javascript
        class ScrollingList extends React.Component {
            constructor(props) {
                super(props);
                this.listRef = React.createRef();
            }
         
            getSnapshotBeforeUpdate(prevProps, prevState) {
                // Are we adding new items to the list?
                // Capture the scroll position so we can adjust scroll later.
                if (prevProps.list.length < this.props.list.length) {
                    const list = this.listRef.current;
                    return list.scrollHeight - list.scrollTop;
                }
                return null;
            }
         
            componentDidUpdate(prevProps, prevState, snapshot) {
                // If we have a snapshot value, we've just added new items.
                // Adjust scroll so these new items don't push the old ones out of view.
                // (snapshot here is the value returned from getSnapshotBeforeUpdate)
                if (snapshot !== null) {
                    const list = this.listRef.current;
                    list.scrollTop = list.scrollHeight - snapshot;
                }
            }
         
            render() {
                return (
                    <div ref={this.listRef}>{/* ...contents... */}</div>
                );
            }
    ```
* componentDidUpdate
    正如上面的案例，getSnapshotBeforeUpdate 的返回值会作为componentDidUpdate的第三个参数使用。

##### 卸载阶段

* componentWillUnmount
    卸载阶段唯一的回调函数。
    该函数主要用于执行清理工作。一个比较常见的 Bug 就是忘记在 componentWillUnmount 中取消定时器，导致定时操作依然在组件销毁后不停地执行。所以一定要在该阶段解除事件绑定，取消定时器。

    
#### 职责梳理

如果我们的 React 应用足够复杂、渲染层级足够深时，一次重新渲染，将会消耗非常高的性能，导致卡顿等问题。
关键点：
1. 什么情况下会触发重新渲染。
2. 渲染中发生报错后会怎样？又该如何处理？

----

* 函数组件

函数组件任何情况下都会重新渲染。
官方提供了一种方式优化手段，那就是 React.memo。
React.memo 并不是阻断渲染，而是跳过渲染组件的操作并直接复用最近一次渲染的结果，这与 shouldComponentUpdate 是完全不同的。
```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

* React.Component
    如果不实现 shouldComponentUpdate 函数，那么有两种情况触发重新渲染。
    1. 当 state 发生变化时。这个很好理解，是常见的情况。
    2. 当父级组件的 Props 传入时。无论 Props 有没有变化，只要传入就会引发重新渲染。

* React.PureComponent
    PureComponent 默认实现了 shouldComponentUpdate 函数。所以仅在 props 与 state 进行浅比较后，确认有变更时才会触发重新渲染。

* 错误边界
错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI，如下 React 官方所给的示例：
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}
```
无论是 React，还是 React Native，如果没有错误边界，在用户侧看到的现象会是这样的：在执行某个操作时，触发了 Bug，引发了崩溃，页面突然白屏。
但渲染时的报错，只能通过 componentDidCatch 捕获。这是在做线上页面报错监控时，极其容易忽略的点儿。


#### 坑
* 在不恰当的时机调用不合适的代码
* 在需要调用时，忘记了调用

以下情况容易造成生命周期的坑

1. getDerivedStateFromProps 容易编写反模式代码，使受控组件与非受控组件区分模糊。

2. componentWillMount 在 React 中已被标记弃用，不推荐使用，主要原因是新的异步渲染架构会导致它被多次调用。所以网络请求及事件绑定代码应移至 componentDidMount 中。

3. componentWillReceiveProps 同样被标记弃用，被 getDerivedStateFromProps 所取代，主要原因是性能问题。

4. shouldComponentUpdate 通过返回 true 或者 false 来确定是否需要触发新的渲染。主要用于性能优化。

5. componentWillUpdate 同样是由于新的异步渲染机制，而被标记废弃，不推荐使用，原先的逻辑可结合 getSnapshotBeforeUpdate 与 componentDidUpdate 改造使用。

6. 如果在 componentWillUnmount 函数中忘记解除事件绑定，取消定时器等清理操作，容易引发 bug。

7. 如果没有添加错误边界处理，当渲染发生异常时，用户将会看到一个无法操作的白屏，所以一定要添加。
  
