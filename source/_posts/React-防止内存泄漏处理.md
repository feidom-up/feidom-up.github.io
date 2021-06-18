---
title: React-防止内存泄漏处理
date: 2021-06-18 13:40:49
tags:
- react
categories: react
---

用React写了一段代码，浏览器的控制台<font color=red size=5>Error </font>如下：
<font color=red>Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.</font>

啥意思呢：不能在未挂载的组件上执行React状态更新。这是一个无用功，但它表明你的应用程序中存在内存泄漏。要解决这个问题，在useEffect清理函数中取消所有的订阅和异步任务。

以下是这段问题代码：

```javascript
  const Component = (props) => {
    const { itemId } = props;
    const [ isRemoveing, setIsRemoveing ] = useState(false);
    const handlerRemove = async() => {
      if(isRemoveing) return;
      setIsRemoveing(true);
      await removeItem(itemId); // 删除当前这个组件的数据，这个组件卸载
      setIsRemoveing(false);
    }
    return (
      <>
        <div class_name={ !isRemoveing ? 'class1' : 'class2' } onClick={handlerRemove} ></div>
      </>
    )
  }
```
**原因是啥呢**：await等待一个异步请求的返回再`setIsRemoveing`。假如这个组件unmounted之后，请求还没回来，你还在这setState，不就炸了。

好吧，那解决方式是不是在`useEffect`中定义一个卸载时的变量`unmounted`，然后在setIsRemoveing时判断卸载状态？

嗯，基本是这个思路。那这个`unmounted`该怎么定义，是直接`const unmounted = false;`, 还是`const [ unmounted, setUnmounted ] = useState(false);`？ 
以下是Stack Overflow里一个帖子的回复：
* 方式一：
  ```javascript
  useEffect(() => {
    let unmounted = false;
    setPageLoading(true);
    props
      .dispatch(fetchCourses())
      .then(() => {
        if (!unmounted) {
          setPageLoading(false);
        }
      })
      .catch((error: string) => {
        if (!unmounted) {
          toast.error(error);
          setPageLoading(false);
        }
      });

    return () => { unmounted = true };
  }, []);
  ```
* 方式二：useRef
```javascript
  const Example = (props) => {
    const unmounted = useRef(false);
    useEffect(() => {
      return () => { unmounted.current = true }
    }, []);

    const setFilter = () => {
      // ...
      props.dispatch(fetchCourses()).then(() => {
        if (!unmounted.current) {
          setLoading(false);
        }
      })
    }

    // ...
    return (
      <ReactTable onFetchData={setFilter} /* other props omitted */ />
    );
  }
```

方式二中如果不用ref，用state或者直接定义变量的话，都实现不了。
好吧，是我不熟悉的[useRef](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref),这个链接是官方文档，可以先看下。
然后为了研究它，我找到一篇来自[Lee Warrick](https://leewarrick.com/)的[React's useEffect and useRef Explained for Mortals](https://leewarrick.com/blog/react-use-effect-explained/)。[这里](/2021/06/18/useEffect-useRef/)是我对这篇文章的翻译，仅供参考。

#### 参考
[React Hooks - Check If A Component Is Mounted](https://daviseford.com/blog/2019/07/11/react-hooks-check-if-mounted.html)
[how-to-stop-memory-leak-in-useeffect-hook-react](https://stackoverflow.com/questions/58038008/how-to-stop-memory-leak-in-useeffect-hook-react/58038029)