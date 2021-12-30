---
title: Javascript-in-V8
date: 2021-12-30 11:05:49
tags: js原理
categories: js原理
---

之前对[js对象你不知道的那些特点](http://www.feidom.com/2021/08/09/js%E5%AF%B9%E8%B1%A1%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84%E9%82%A3%E4%BA%9B%E7%89%B9%E7%82%B9/) 有一些粗浅的认识，这个笔记写的很无理取闹。现在研究清楚以后，重新补一篇笔记来完善知识。之前的这篇就留着吧，也是学习和思考中一个必有的认知阶段。

#### JS Object 中的常规属性和排序属性
  * 常规属性(V8:properties)
    在properties对象中，会按照创建时的顺序保存常规属性。
  * 排序属性(V8:elements)
    当key为数字时，会将这类属性存储在elements对象中，将其作为一块连续的内存以Array的形式进行存储。在elements对象中，会按照数字大小的顺序来存放排序属性。

  ```javascript
    function ClassA() {
      this[100] = '100';
      this[1] = '1';
      this['B1'] = 'B';
      this[50] = '50';
      this[3] = '3';
      this['A2'] = 'A';
      this['C'] = 'C';
    }
    var a = new ClassA();
    for(key in a){
      console.log(`${key}: ${a[key]}`)
    }
    a.qwf = 'qwf';
    console.log(a)

    function ClassB(num){
      for(let i=0; i<num; i++){
        this[i] = `eeeeee_${i}`
        this[`p_${i}`] = `pppppp_${i}`
      }
    }

    var b = new ClassB(20);
    console.log(b)
  ```
  
  作为两个属性，为啥在console的控制台打印的结果中没有发现呢。其实console的控制台打印的没那么深，那怎么能找到他们呢。在Memory控制台录制快照，就能很明显的看到他们。

#### V8引擎对Object做了什么残忍的事
  * Hidden Class 隐藏类
  * Properties pointer 常规属性指针
  * Elements pointer 排序元素指针
  
  为什么要这样分开呢？？？
    首先我们需要聊一下公认最快的C语言，它的快很大程度上归功于它严格的类型约束。也就是说大型的面向对象系统都有严格的数据结构，这对快速的属性查询很关键。
    所以，Js中的Object的定义非常差,因为它太灵活了，没有类型的概念。而且存在可以任性修改的原型链，它没有限制。
    所以在V8对JS Object进行处理时，为了快速的属性查询，有一个内部的类型系统：对具有相同结构的对象进行分组；各个对象之间可以共享；生成的成本很高，但是之后的成本很低。

#### V8对Object做的优化
  属性内联缓存
  在属性查询中检查隐藏类
  1. 在第一次时完全通用查询
  2. 然后记住你在哪个地方找到的这个属性
  生成新的优化代码
  1. 下次使用，直接访问

#### Object 属性的存储
  * 直接在object上，即默认状态，这个很快
  * array形式存储，也很快
  * 哈希表结构（字典模式），这个的交互会慢很多
  字典模式相比于其他模式，运行速度降低。触发字典模式的行为如下：
  * 非常多的属性，他们没有办法被放在默认状态的内存中，这个数字可能是10 ？30？
  * 改变属性
  * 删除属性

#### JS Array 字典模式
  同样对比C，Js中的Array也因为没有类型约束给了用户很大的自由，也挺样带来了不可控的性能问题。
  连续内存的存储和hash表（字典模式）不同的存储方式，不一样的性能体验。
  触发字典模式的行为如下：
  1. 非常多的属性，大于1024？ 10000？
  2. 动态扩容
   
  ```javascript
    // bad
    var a = new Array();
    a[1000] = 8;
    // ok
    var a = new Array(1000);
    a[0] = 'nihao';
    a[100] = 8;
  ```

#### 结合以上特点，我们应该做什么
  Js给我们很高的灵活度让我们随心所欲，但是我们不应该为所欲为，自由度高，带来的就是性能的不友好。
  ```javascript
    function ClassA() {
      this[100] = '100';
    }
    var a = new ClassA();
    a.qwf = 'qwf';  // 这样直接添加属性，改变了隐藏类
  ```
  所以尽量定义好默认属性，不要在构造函数之外做大量的动态属性添加和删除，尽量共享隐藏类。


#### V8
  [V8](https://v8.dev/)

```txt
The first type of attry to talk about in javascript is the TypedArray

So TypedArrays are going to make a lot of aense to you if
you are coming from a C background

They are contiguous blocks of memory that are specified for a particylar data type.

So you have Uint32Array, Float64Array, Unit8Array, and so on, and so forth, which actually, if you are familiar with Javascript,is sort of unusual. Because most things in Javascript have no type. 

So this idea that we are specifying a very specific size for our numbers id actually like pretty unique. And that's because the TypedArray specification grew up alongside the WebGL specification.

And you can inagine how you need that level of specificity if you are doing graphics programming.

So that's sort of where the TypedArray specification came from.

But it's been adopted into other things now that it's there.

So agein, they're memory efficient. You don't have to box them.

They behave as you'd expect.

They're a very nice option for arrays.

But if you can't use TypedArrays for whatever reason, you need to use Javascript Arrays.

SO Javascript Array object --Array with a captital A-- has an API which is going to look a little weird to you if you are used to C-style arrays.

It's going to have operations that are different.

It's going to have like push and pop.

It's going to allow you to index out of bounds.

It's going to have just sort of odd behavior to me as somebody coming from C.

So as you can imagine, because the API allows all these non-C array-like things, the backing storage in V8 is not always somethings that looks like array. There are actually two diffent types of backing storage for arrays. Thewe are sparse arrays and dense arrays, which map to either something tach looks like a C-style array. like you'd expect, or a hash table. And if you array is backed by a V8 hash table, that's called being in dictionary mode, and it's considerably less efficient. It's case that you want to avoid.

There are many factors in V8 that causes you to be kicked into dictionary mode or not. 

So it's kind of complicated to define them all. 

But one of them, for instance, is space efficiency.

So is the codes you wrote will be three times more effcient, use three times less space if it was backed by a hash table than an array, then it'll be a hsah table on back end. So there are criteria like that. 

js allows you to create a new uninitialized array and then just suddenly index into it at whatever index.

This, doesn't make any sense in C. It's not something you'd actually do. And in V8, it will immediately trigger dictionary mode. So this, you will now have a nice, slow array to waok with, not something you want.

So real simple change.

All you have to do is declare how much storage you want up font.Now you have declared to V8 that you actually want an array of a certain size. V8 will back your array by a contigous array of that size, and you can go from there.

Veay sensible, kind of no-brainerish, but again, Javascript allows you to do it in a way that ends up being very inefficient, so it's important to know.

So that is the numeric representation and the immediate representation of objects.


-------------------------------
Object in V8 
-------------------------------

So objects in JavaScript are there very poorly defined things.

They are associative arrays.

They're just bundles of key value pairs of properties.

So you have string balue for key, property value.

And all property values are these undefined whatevers, because Javascript doesn't have a notion of type.

Object have prototype chains. You can add and remove properties anywhere at the prototype chain and on the object inself at any point. 

Javascript doesn't enforce any specificity or structure in your code.

So if you wanted to, you could make every single object in your whole program absolutely a unique set of properties.

Nothing in Javascript will enforce structure or self-similarity.

But just because JavaScript allows you to do that, you really,really shouldn't.

That's actually a terrible thing to do for performance.

And I'll explain why in a minute.

So in V8,the V8 team looked at trying to write a large-scale application in JavaScript and thought, hey, you know what's important in large-scale systems is object-orientenness.

And if you have object-orientenness in your system, then now, property access is one of the key things that you need to make fast. 

So V8 designed its structure to make property access on objects as efficient as it could be.

So the internal representation of an object in V8 is three words.

So first, we have a hidden class pointer, which is an internal notion of type, which I'll explain in a second.

And then we have two pointers to different kinds of properties.

We have properties that have string names and then properties that have int names. 

But really, the only thing that's important is your have a type, and then you have property storage.


So waht's this hidden class thing?

So hidden classes, again, ther're V8's interbal notion of type.

JavaScript itself isn't going to enforce any kind of notionof type on you.

BUt in order to make things effcient, V8itself need to have some sort of structure in whst it things you're doing. 

So it introduces a type system.

And that type system froups objects with the same structure.

So as you're adding properties to objects, which you can do in JavaScript, V8 will be looking at the properties on each object and mapping ta=hat bundle of properties to a hidden class, which defines an object with exactly those properties.

So, dor instance, if I have this constructor in JavaScript where I have a point, and it has an x and y, and the way those values are added by first adding x to the object and then adding y, thay's going to generate a hidden class that backs objects that are created from this function that has exactle the properties x and y.

And that really seems sort of obvious.

But then, the first time this function is run, that hidden class is going to be built for the first time. And then, all subsequent times this dunction is run, those new objects can share the same hidden class.So you only pay the price for building it the very first time.

After that, you can just use the same object.

So we went through all this trouble of building up a notion of type.

So now, we have types that correspond to specifically what exact 
properties are on an object.

We can use taht notion of type to make property access quick using something called inline caching.

So if yoiu want to look up a property on an object in Javascript, you're going to say, I am looking for property with name x on object y.

The first thing you do whrn you're trying to look up a property is check the hidden class of the object.

If you're never tried to look up that property on an object of that type before, then what you're going to have to do is a fully generic search for that property.

So again, we just have a bundle of properties somewhere.

They all have string names.

You have a string of the property you're looking for.

And you're going to have to look through taht list for the property that has a matching name.

That's a pretty slow operation.

But once you found thst property once, you can remember the offset to it. you can remember where you found that property and use it later, which means that you can use that to generate new optimized code which specifies how you look up that particular property on that particular object.

And next time you want to look up property with that name on an object of that type, you can have direct access You know exactly where to go in an object of that type.

And it's much much much faster.

So thst's really what the notion of having hidden class is getting us, is now we can make property access really fast through inline caching.

So this is a classic example of bad idea. 

function Vec2(x,y){
	this.x = x;
	this.y = y;
}
var v0 = new  Vec2(5,8);
v0.z = 34;


So I have another constructor. It's creating a vector object. 

But then, after I go through the trouble of doing that, I decide that I now wanted property z on this object.

The problem with that is that if you add a property z to that object at some future point, if you just dynamically do that, you're going to change the hidden class of the object, which means that all this nice caching you're done and building up a notion of where the properties are, that's just blown away because now you have a new hidden class. 

You have to pay to build the new hidden class, and now you have to deal with a new hidden class.

So one of the best things you can do to make you code efficient is to create a few well-defined types.

Don't do alot of dynamic property adding and removing outside of constructors.

Pretty much set things up once, have them look alike so that they can share the same hidden class, and don't mess with the properties they have.


-------------------------------
Object properties storage
-------------------------------

So now we know an object has properties.

those properties can be in different storage states.

So the first state ,the default, is that they can be stored directly in an array on the object.

that great, that's fast. that's where you want to be. 

A second state they can be in is being stored in array off the objects. still great. No problem.

The third case, which is the one you really have to look out for, is when they're stored in a hash table.

So mush like just the array case in general where arrays can have different types of backing storage, properties can have different types of backing storage too.

So properties can either be in normal mode where they're stored as an array or a dictionary mode where they're stored as a hash table. 

And if you have an object in dictionary mode, it's going to be mush slower to interact with.

So you don't want that.

So what triggers dictionary mode ,and how do you avoid it? Well, one thing that triggers itis toomany properties.

So if you have so many properties that they won't fit into the internal storage for properties, then you have to have a hash table elsewhere. And that number of too many properties is somewhere around 30. It's quite generous, but you mighe hit it in some cases.

The other things you can do to confuse your object and kick it into dictionary mode are to change the properties on the object.

You can change the attribute, you can delete properties, that kind of thing. Those things are all going to kick you straight to dictionary mode.

Again, and now you're going to make your object mush slower to interact with.

```