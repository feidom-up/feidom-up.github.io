---
title: Touch和Mouse事件
date: 2021-06-07 08:28:00
tags: 移动端
categories: 移动端
---

#### 一个问题引发的思考

移动端的一个页面，猜测哈，hover事件&mouseover事件都被监听时，mouse应该失效吧。因为移动端只有点触，没有mouse。
事实：出现mouseover（定义了这个时候的样式）状态，就很奇怪。
然后，本以为mouse和touch在浏览器中是这样的：
* pc端：mouse事件生效，touch事件~~失效~~
* 移动端：mouse事件~~失效~~，touch事件生效
* **但是**，结果是这样的：
同时监听了mouse和touch两种事件，在ios移动设备中的safari浏览器中，点击触发touch事件之后，定义的mouseover事件也触发了，产生了bug。

#### 研究它
敲黑板：
* pc端：onTouch事件会被屏蔽。
* 移动端：两种事件都会被触发。且顺序是这样的：
  1. touchstart
  2. touchmove
  3. touchend
  4. mouseover
  5. mousemove
  6. mousedown
  7. mouseup
  8. click

好吧，这是这一切出现的原因。
在适配多种设备的项目中，怎么区分这两种事件，让mouse事件在移动端失效呢。

#### 方法：
  * 设置一个flag，mouse事件时判断touchFlag决定return或者执行。
  * 分开写，判断设备后需要mouse的写mouse，需要touch的写touch。
  * 最好的方法：preventDefault()
  > **Use preventDefault() inside touch event handlers, so the default mouse-emulation handling doesn’t occur.**


#### preventDefault()
专门挑出来说一下这个：preventDefault()【该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。】
于是，在`touchstart`方法中使用`e.preventDefault()`去阻止之后的mouseover事件。
<font color='red'>报错了</font>：Unable to preventDefault inside passive event listener due to target being treated as passive.

> 翻译： 由于目标被视为被动，无法在被动事件监听器内防止。

##### passive 的事件监听器
```javascript
addEventListener(type, listener, {
    capture: false,
    passive: true,
    once: false
})
```
三个属性都是布尔类型的开关。其中 capture 属性等价于以前的 useCapture 参数；once 属性就是表明该监听器是一次性的，执行一次后就被自动 removeEventListener 掉，还没有浏览器实现它；passive 属性在 Firefox 和 Chrome 已经实现。
很多移动端的页面都会监听 touchstart 等 touch 事件，像这样：
```javascript
document.addEventListener("touchstart", function(e){
    ... // 浏览器不知道这里会不会有 e.preventDefault()
})
```
由于 touchstart 事件对象的 cancelable 属性为 true，也就是说它的默认行为可以被监听器通过 preventDefault() 方法阻止，那它的默认行为是什么呢，通常来说就是滚动当前页面（还可能是缩放页面），如果它的默认行为被阻止了，页面就必须静止不动。但浏览器无法预先知道一个监听器会不会调用 preventDefault()，它能做的只有等监听器执行完后再去执行默认行为，而监听器执行是要耗时的，有些甚至耗时很明显，这样就会导致页面卡顿。

Passive Event Listeners：就是告诉前页面内的事件监听器内部是否会调用`preventDefault`函数来阻止事件的默认行为，以便浏览器根据这个信息更好地做出决策来优化页面性能。当属性passive的值为true的时候，代表该监听器内部不会调用`preventDefault`函数来阻止默认滑动行为，Chrome浏览器称这类型的监听器为被动（passive）监听器。目前Chrome主要利用该特性来优化页面的滑动性能，所以Passive Event Listeners特性当前仅支持mousewheel/touch相关事件。

**耗时是什么**
当用户在移动设备上点击网页中的某个元素时，没有为移动交互设计的网页在触摸开始事件和处理鼠标事件（mousedown）之间至少有300毫秒的延迟。如果你有触摸设备，你可以看看这个例子。或者，使用Chrome浏览器，你可以在Chrome开发者工具中打开 "模拟触摸事件"，以帮助你在非触摸系统上测试触摸界面!

这个延迟是为了让浏览器有时间判断用户是否在做其他手势--特别是双击缩放。很明显，在你想对手指触摸做出即时反应的情况下，这可能是个问题。目前正在进行的工作是试图限制这种延迟自动发生的情况。

|| Chrome for Android | Android Browser | Opera Mobile for Android | Firefox for Android | Safari iOS |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Non-scalable viewport | No delay | 300ms | 300ms | No delay | 300ms |
| No Viewport | 300ms | 300ms | 300ms | 300ms | 300ms |

避免这种问题的一个简单方法，就是直接告诉浏览器，我这个页面不需要滚动：`<meta name="viewport" content="width=device-width,user-scalable=no">`，一般在移动端这样写可以。

**综上**：
  事件监听时，设置第三个参数中：passive为false，告诉浏览器我要自己控制`preventDefault`函数来阻止事件的默认行为。

**如下**：
  ```javascript
  private onTouchStart(e:MouseEvent) {
    e.preventDefault();
    console.log('onTouchStart', e.cancelable);
  }
  private onMouseOver(e:MouseEvent) {
    console.log('onMouseOver', e.cancelable);
  }
  componentDidMount() {
    if (this.touchElement) {
      this.touchElement.addEventListener('touchstart', this.onTouchStart, {passive: false});
      this.touchElement.addEventListener('mouseover', this.onMouseOver, {passive: false});
    }
  }
  ```
  ```jsx
  <div styleName={'btn-start-wrap'} ref={
    (ref) => {
      if (ref) {
        this.touchElement = ref;
      }
  }}>
  ```
  以上的代码touchstart后不会触发mouseover。实现了阻止移动端也触发mouse事件的逻辑。

  #### 参见：
  [Passive Event Listeners——让页面滑动更加流畅的新特性](https://www.jianshu.com/p/5bae6433025f)
  [紫云飞 -- passive 的事件监听器](https://www.cnblogs.com/ziyunfei/p/5545439.html)
  [touch&mouse](https://www.html5rocks.com/en/mobile/touchandmouse/)