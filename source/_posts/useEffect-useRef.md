---
title: useEffect & useRef
date: 2021-06-18 09:58:48
tags:
- react
categories: react
---
#### 注意
本文是一片翻译，原文来自[Lee Warrick](https://leewarrick.com/)的[React's useEffect and useRef Explained for Mortals](https://leewarrick.com/blog/react-use-effect-explained/)。
为啥翻译并记录这篇文章呢，因为看了以后觉得通俗易懂的为凡人解释了`useEffect`和`useRef`。
在此记录，方便以后回头复习。

#### 通俗的解释React的 useEffect 和 useRef
![原文中过的图](https://leewarrick.com/blog/static/fdb92914fc9093dee6a2c20dad8fbd50/c35de/acropolis.jpg)
&emsp;&emsp;如果React文档让你一筹莫展，或者Dan Abramov的博客让你觉得你在阅读从奥林匹斯山流传下来的古希腊文卷轴，你并不孤单,不是只有你这样认为。
&emsp;&emsp;有时，React神殿的众神们很难将他们的智慧转化为我们其他人可以理解的语言。事情通常是这样的。你在使用React时遇到困难，用谷歌搜索你的问题，然后读到一个博客或Stack Overflow的帖子，其中的一些建议让你感到比开始时更迷茫。
&emsp;&emsp;我当然也曾多次成为这种情况的受害者。特别是useEffect。在我们深入研究这个特殊的钩子之前，让我说我喜欢用hooks来写React，而且不想再回到类中去。这就是说，useEffect是一个很大的痛点。

###### 到底什么是“effect副作用”
&emsp;&emsp;为了让你真正理解useEffect，让我们退后一点，谈谈编程和JavaScript。
&emsp;&emsp;useEffect的名字就是我们亲切地称为 "副作用 "的效果。
&emsp;&emsp;那么什么是副作用呢？它是一段代码，它伸出手来......做别的事情。这是一个抽象的概念，所以让我们用例子来说明。
&emsp;&emsp;这里有一个没有副作用的函数。
```javascript
  function add(a, b) {
    return a + b
  }
```
&emsp;&emsp;函数add除了接受一个输入并返回一个输出外，什么也没做。它并没有伸手到自身以外的地方去捣乱!
&emsp;&emsp;我们来介绍一个副作用。
```javascript
  const resultDiv = document.getElementById('add-example')
  function add(a, b) {
    const result = a + b
    resultDiv.textContent = `The Result is ${result}`
    return a + b
  }
  add(3, 4)
```
```html5
<div id="add-example"></div>
```
&emsp;&emsp;现在，我们的函数伸到了自身之外来更新DOM（Document Object Model的缩写），并显示了结果。这个额外的行为是一个副作用。
###### React中的副作用
&emsp;&emsp;那么React呢？它是一个几乎只更新DOM的库。一个视图库，如果你愿意的话。那么在React中，你会把什么叫做副作用呢？
&emsp;&emsp;任何在更新页面之外的东西。如果你不使用React来更新状态或渲染HTML，那就是一个副作用。它是任何非React的东西。
&emsp;&emsp;这意味着任何时候你调用API，使用setInterval/setTimeout，添加键盘监听器，或者真的任何时候你搞乱窗口对象，你都在引入副作用。
&emsp;&emsp;hooks很神奇，让你写出真正可读、可重用的代码......除了当你处理副作用的时候。这很不幸，因为当你仔细想想，作为网络开发者，我们所做的大多数有趣的事情都是围绕着副作用展开的。
&emsp;&emsp;让我们从钩子上退一步，看看我们如何在基于类的组件中处理副作用。
###### 类组件和副作用
&emsp;&emsp;在基于类的组件中，我们会使用生命周期方法来执行侧面效果。例如，在componentDidMount上，我们会调用API来获取渲染的数据。
&emsp;&emsp;"为什么不在构造函数中调用API？"你可能会问。好吧，因为React说我们用于渲染的东西都在 "状态 "中，在我们的组件被加载到页面上之前，我们不能乱用状态。如果我们试图在组件加载之前更新状态，就会出现错误。
&emsp;&emsp;下面是一个典型的基于类的组件的情况,这是一个小精灵的例子（后面会用hooks改写）。
```javascript
class Pokemon extends React.Component {
  constructor() {
    super()
    this.state = null
  }
  componentDidMount() {
    fetch('https://pokeapi.co/api/v2/pokemon/gengar/')
    .then(res => res.json())
    .then(res => {
        this.setState(res)
    })
  }
  render() {
    const pokemon = this.state
    const style = {textTransform: 'capitalize'}
    return (
      <div>
      { pokemon
        ? <>
          <img src={pokemon.sprites.front_default}
            alt={'Image of ' + pokemon.name}/>
          <p style={style}>Name: {pokemon.name}</p>
          <p style={style}>
            Type: {pokemon.types.map(x => x.type.name).join(', ')}
          </p>
        </>
        : 'Loading...'
      }
      </div>
    )
  }
}
```
&emsp;&emsp;这样做很好，除了不这样做的时候。当我们想再次点击API来抓取不同的小精灵时会发生什么？如果这个组件被连接到我们的应用程序中的某个路由上，而这个路由发生了变化，但这个组件并没有卸载/重装。如果用户进入了不同的页面，而组件在API调用结束前就卸载了怎么办？
&emsp;&emsp;答案是增加更多的生命周期方法，如`componentDidUpdate`和`componentWillUnmount`，以执行更多的API调用，防止奇怪的卸载错误。所以我们添加了这些生命周期方法来处理我们所有的边缘情况。当我们完成后，我们发现我们的大部分组件都是由生命周期代码组成的。

##### 然后来试一下Hooks
&emsp;&emsp;React团队意识到，类的API有点笨重，难以推理。人们正在制作生命周期流程图，试图了解React的内部运作......这是一个混乱。
&emsp;&emsp;因此，在2018年10月的ReactConf上，在Sophie Alpert概述了类的使用有多么糟糕之后，Dan Abramov上台介绍了钩子（你可以在这里观看视频）。
&emsp;&emsp;钩子在功能组件中引入了状态性，以及处理副作用的新方法。钩子使React的代码更容易重复使用，而且代码量更少--这是一个巨大的胜利！但是有一个小问题。
&emsp;&emsp;除了一个小问题。**每次渲染，整个组件/功能都要重新运行**。
&emsp;&emsp;让我们看一个基于Hooks开发的例子：
```javascript
function RerenderExample() {
  const [bool, setBool] = React.useState(false)
  const randomNum = Math.random()
  return (
    <div>
      <p>This number will be different each time you click the button:</p>
      <p>{randomNum}</p>
      <button onClick={() => setBool(!bool)}>Trigger a render</button>
    </div>
  )
}
```
&emsp;&emsp;我们在渲染的JSX中甚至没有使用bool，但每次状态改变时，整个函数都会运行。每次渲染，组件内的所有东西都会重新运行：函数定义、变量创建/分配等等。
&emsp;&emsp;如果你在想 "如果我必须在组件中做一些计算量大的事情怎么办？这不可能是高性能的......"，这是个敏锐的观察。在一个功能性组件中进行昂贵的操作是不可能有性能的。事实上，useCallback和useMemo的存在正是为了解决这个问题而设置的避难所。Kent C Dodds在这里对这些问题有一个挑战性的解读，但总结起来，根据Kent的说法，在你看到性能影响之前，你不应该担心重读的问题。
> 注意：如果你对钩子不熟悉，请把这篇文章收藏起来，等你准备好了再来看看。除非你必须要担心记忆化的问题
&emsp;&emsp;像useState这样的钩子采用了一些内在的魔法来避免重现的问题。这很好，而且使用useState似乎很简单，但是**当你需要做设置状态以外的事情时，怎么办？**
&emsp;&emsp;使用useEffect。那些讨厌的生命周期方法没有了，万岁！然而，这个钩子也有它自己的奇怪之处。首先让我们来看看语法。
```javascript
//accepts two arguments: a function, and dependency array
useEffect(() => {
  // do stuff
  return () => {} //function to undo our stuff from above when component unmounts
}, []) //dependency array of things to watch for changes on
```
&emsp;&emsp;所以你给useEffect传递一个要运行的回调函数，其中包含你的副作用，然后是一个要观察的事物的数组。如果被监视的事物发生变化，useEffect将重新运行我们的回调函数。如果你需要在卸载时清理你的副作用，返回一个包含该代码的函数。
&emsp;&emsp;让我们看看我们的小精灵的例子，用钩子和useEffect。
```javascript
function Pokemon() {
  const [pokemon, setPokemon] = React.useState(null)
  React.useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/gengar/')
    .then(res => res.json())
    .then(res => {
      setPokemon(res)
    })
  }, []) // empty array means nothing to watch, so run once and no more
  const style = {textTransform: 'capitalize'}
  return (
    <div>
    { pokemon
      ? <>
        <img src={pokemon.sprites.front_default}
            alt={'Image of ' + pokemon.name}/>
        <p style={style}>Name: {pokemon.name}</p>
        <p style={style}>
          Type: {pokemon.types.map(x => x.type.name).join(', ')}
        </p>
      </>
      : 'Loading...'
    }
    </div>
  )
}
```
&emsp;&emsp;如果你盯着那个空的依赖性数组，你已经注意到了第一个useEffect的怪癖。通过传递一个空数组，我们在说 "只做这一次"。React万神殿告诉我们，在极少数情况下这是可以的，但大多数时候你都希望里面有东西。原因是，通常你想与你的代码中的东西同步，而不是只执行一次效果。例如，如果我们的小精灵组件依赖于一个路由参数或道具，任何可以说 "去获得一个新的小精灵 "而不需要挂载/卸载的东西呢？
&emsp;&emsp;比方说，我们的组件依赖于一个道具pokemonToGet，它是一个参数，告诉它要从API中获得哪些小精灵。让我们也为测试目的添加一个小小的表单。
```javascript
function Pokemon({pokemonToGet}) {
  const [pokemon, setPokemon] = React.useState(null)
  React.useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonToGet}/`)
    .then(res => res.json())
    .then(res => {
      setPokemon(res)
    })
  }, [pokemonToGet]) // get a new pokemon with the pokemonToGet prop changes
  const style = {textTransform: 'capitalize'}
  return (
    <div>
    { pokemon
      ? <>
        <img src={pokemon.sprites.front_default}
          alt={'Image of ' + pokemon.name}/>
        <p style={style}>Name: {pokemon.name}</p>
        <p style={style}>
          Type: {pokemon.types.map(x => x.type.name).join(', ')}
        </p>
      </>
      : 'Loading...'
    }
    </div>
  )
}
function PokemonForm() {
  const [inputValue, setInputValue] = React.useState("rowlet")
  const [pokemonToGet, setPokemonToGet] = React.useState("gengar")
  function getPokemon() {
    setPokemonToGet(inputValue.trim().toLowerCase())
    setInputValue("")
  }
  return (
    <div>
      <input onChange={(e) => setInputValue(e.target.value)}
        value={inputValue} type="text"/>
      <button onClick={getPokemon}>
        Get Pokemon
      </button>
      <Pokemon pokemonToGet={pokemonToGet} />
    </div>
  )
}
render(<PokemonForm />)
```
&emsp;&emsp;很好，现在我们的组件根据我们的道具变化获取了一个新的小精灵。如果使用类，我们就必须使用`componentDidUpdate`之类的东西来达到类似的效果。
&emsp;&emsp;Ryan Florence在推特上对useEffect的用法做了很好的总结。
> The question is not “when does this effect run” the question is “with which state does this effect synchronize with”
  useEffect(fn) // all state
  useEffect(fn, []) // no state
  useEffect(fn, [these, states])

&emsp;&emsp;他提到的 "所有状态 "的情况，即你没有传入任何依赖关系的情况是一个奇怪的情况。我个人从未发现它的用途。我们知道整个组件在每次渲染时都会运行，所以我想知道是否有一些奇怪的边缘情况需要你使用`useEffect(fn)`而不使用任何依赖阵列。在任何情况下，大多数时候你都会用这个方法：`useEffect(fn, [these, states])`。

##### UseEffect和Previous State: 事情败露的地方。
&emsp;&emsp;到目前为止，useEffect的心理模型似乎很简单：将它与你选择的某些状态变化同步。问题是，当你需要在一个效果中引用该状态，而不仅仅是知道它是否发生了变化。
&emsp;&emsp;在useEffect中，你无法获得对当前状态的访问。
&emsp;&emsp;在我们的API调用例子中，我们没有看到这一点，因为我们只是覆盖了之前的状态。
&emsp;&emsp;让我们看一个简单的例子:
```javascript
function Timer() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
        setCount(count + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>The count is: {count}</div>
  )
}
```
&emsp;&emsp;似乎我们做了所有正确的事情（甚至清理了卸载时的副作用），但我们的计数器没有递增。这是一个问题吗？我们是否无法访问setInterval所属的窗口对象？
&emsp;&emsp;不是，也不是。如果你把console.log添加到那个间隔中，你会看到它每秒钟都在跳动。
&emsp;&emsp;我可以证明给你看:
```javascript
function Timer() {
  const [count, setCount] = React.useState(0)
  const [randomNum, setRandomNum] = React.useState(0)

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1)
      setRandomNum(Math.random())
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>
      <p>The count is: {count}</p>
      <p>RandomNum is {randomNum}</p>
    </div>
  )
}
```
&emsp;&emsp;注意，我们每秒钟都会得到一个新的随机数。我们的时间间隔代码是好的。
&emsp;&emsp;我们能够设置新的状态，但无法访问当前状态。
&emsp;&emsp;这就是一个 "陈旧的闭包"。我不会去讨论闭包，但只需知道，由于React/hooks的实现，在我们的间隔函数中，count变量总是会是0。这是一个旧的参考。
&emsp;&emsp;事实证明，像上面这样的简单例子有一个解决方案，正如John Tucker所指出的（谢谢John！）。和基于类的组件中的setState一样，useState也可以接受一个回调函数，接收之前的状态作为一个参数。React文档也注意到了这一点。
&emsp;&emsp;下面是一个快速修复的例子。
```javascript
function Timer() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      //let's pass a function instead
      //the argument is the current state
      setCount(count => count + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>The count is: {count}</div>
  )
}
```
&emsp;&emsp;不过，这仍然不能解决我们所有的问题。如果你需要在useEffect中访问最新的状态，但不更新它，你将不得不开始用setState回调来包装你的useEffect代码，然后在最后返回未改变的状态。这很快就会变成一个绝对的混乱，特别是当你在处理多个状态值的时候。
&emsp;&emsp;另一个可能的解决方案是只使用useReducer，因为它可以接收之前的状态，但是用副作用填充你的reducer也显得非常混乱，而且我不建议任何人完全停止使用useState。
&emsp;&emsp;无论如何，在写钩子的时候，我已经陷入了陈旧的闭包陷阱很多很多次。我甚至不知道它有个名字，直到我在Svelte背后的人Rich Harris的演讲中看到它
&emsp;&emsp;显然，我也不是唯一一个在钩子上被它们绊倒的人。
![Rich Harris的](https://leewarrick.com/blog/static/5a5dbcc6667a5da9eeabc5cbe90a1427/ed46b/staleclosures.png)
&emsp;&emsp; **React甚至在他们的文档中提到了这一点。**
> “Any function inside a component, including event handlers and effects, “sees” the props and state from the render it was created in.”
  译：组件内的任何功能，包括事件处理程序和效果，都能 "看到 "它所创建的渲染中的道具和状态。
&emsp;&emsp;我之前读过这个，在真正深入了解这个问题之前，我觉得没什么意义。我想象这可能是React的一个不好的点，所以也许他们不希望太大声地叫出来。
&emsp;&emsp;然而，Dan Abramov在他的博客中更好地描述了这个问题，甚至提供了一个解决方案。
>“Effects always “see” props and state from the render they were defined in. That helps prevent bugs but in some cases can be annoying. For those cases, you can explicitly maintain some value in a mutable ref.”
  译：效果总是 "看到 "它们所定义的渲染中的道具和状态。这有助于防止bug，但在某些情况下会很烦人。对于这些情况，你可以明确地在一个可变的上下文中保存一些值。

&emsp;&emsp;这很有帮助，因为它以useRef的形式提供了一个解决方案（感谢Dan！），但它让我对如何帮助避免这个问题一无所知（主要是因为我不了解useRef）。

##### 什么是“ref”，你会怎么使用它
&emsp;&emsp;传统上，引用的目的是让你直接访问一个html元素。例如，假设你需要关注一个输入字段。你必须跳出React，使用常规的JavaScript来调用.focus()。钩子实际上让这一切变得相当简单。
```javascript
function InputField() {
  const inputRef = React.useRef()
  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Click to Focus the input
      </button>
    </div>
  )
}
```
&emsp;&emsp;很好! 当我们需要的时候，Refs是访问本地DOM APIs的一个简单的逃生通道。
&emsp;&emsp;...但这如何帮助我们解决我们陈旧的关闭计数器的例子呢？

##### 使用“Refs”来避免陈旧的闭包
&emsp;&emsp;React文档将“Refs”比作 "实例变量"。我不知道那是什么意思（谢谢维基百科），所以我觉得那没什么用。
&emsp;&emsp;我设法通过这样思考来理解Refs的含义。
&emsp;&emsp;**Refs存在于重新渲染周期之外。**
&emsp;&emsp;**把Refs看作是你设置在一边的一个变量。当你的组件重新运行时，它会很高兴地跳过这个反射，直到你用`.current`调用它。**
&emsp;&emsp;让我们看看对我们的定时器例子的修正。
```javascript
function Timer() {
  const [count, setCount] = React.useState(0)
  const countRef = React.useRef(0)

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      countRef.current = countRef.current + 1
      setCount(countRef.current)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>The count is: {count}</div>
  )
}
```
&emsp;&emsp;如果我们想把计时器停在比如说10的位置，我们可以很容易地用refs来做。
```javascript
function Timer() {
  const [count, setCount] = React.useState(0)
  const countRef = React.useRef(0)

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (countRef.current === 10)
        return clearInterval(intervalId)
      countRef.current = countRef.current + 1
      setCount(countRef.current)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>The count is: {count}</div>
  )
}
```
&emsp;&emsp;为了便于比较，这里是使用setState回调方法的替代方案。
```javascript
function Timer() {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const intervalId = setInterval(() => {
        setCount(count => {
          if (count === 10) {
            clearInterval(intervalId)
            return count
          }
          else return count + 1
        })
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>The count is: {count}</div>
  )
}
```
&emsp;&emsp;可以看到这很快就会接近回调地狱，所以如果你在做更复杂的事情，我会提醒你不要使用回调方法。

##### State Versus Refs
&emsp;&emsp;是否有可能完全抛弃状态而只使用refs？
&emsp;&emsp;你可能倾向于认为你可以用 refs 来代替你的组件的状态，从而避开所有这些奇怪的行为。
&emsp;&emsp;你不能这样做。refs不是反应性的。当你改变一个 ref 时，它不会导致重新渲染。记住，**它们存在于重新渲染周期之外**。
&emsp;&emsp;以下是不可能的:
```javascript
function Timer() {
  const count = React.useRef(0)

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      count.current = count.current + 1
      //console.log('Ref example count: ' + count.current)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>The count is: {count.current}</div>
  )
}
```
&emsp;&emsp;那个组件实际上是在内部进行计数，但它并没有导致HTML的更新。你需要useState来实现这一点。如果你不相信我的话，请继续取消对console.log的注释）。
&emsp;&emsp;这里有一个例子来证明Refs与state。
```javascript
function Counter() {
  const [count, setCount] = React.useState(0)
  const countRef = React.useRef(0)

  return (
    <div>
      <p>State Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment State Count
      </button>
      <p>Ref Count: {countRef.current}</p>
      <button onClick={() => countRef.current = countRef.current + 1}>
        Increment Ref Count
      </button>
    </div>
  )
}

render(<Counter/>)
```
&emsp;&emsp;在你通过设置状态触发重新渲染之前，你不会看到Ref计数的变化。

##### 离别感言
&emsp;&emsp;我喜欢React中的钩子和功能组件，但我所概述的怪异现象让我暂停了。我不喜欢被要求对React的内部工作了解这么多才能使用它。我认为这给学习React的人带来了障碍，我希望将来React团队能想出一些更好的方法来处理这些问题。


#### 翻译结束
很棒的文章。