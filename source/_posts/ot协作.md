---
title: OT在线协作
date: 2021-08-05 09:57:07
tags: 
- 设计模式
- OT
categories: 设计模式
---
#### OT协作思想
**解决冲突**

A, B两个用户在协作同一段初始文本：'aaab'。
冲突操作：
  A在第3个字符后面插入了一个`c`('aaacb')。
  B在第3个字符后面插入了一个`d`('aaadb')。

若A先提交，ot后正确结果：'aaacdb'。
？为什么不是按顺序的'aaadcb'。因为不是顺序执行，产生冲突时，为保证双方操作最大程度得到保存，ot协作后，B的操作实际变为在第4个子都后插入。
A视角：A的结果'aaacb'被B拿去操作，结果'aaadcb'。
B视角：B的结果'aaadb'被A拿去操作，结果'aaacdb'。可见这个结果是正确结果。

后台聪明的ot转发功能就是把每个人提交的行为转变一下再告诉别人，两方的结果就一致了。其实这个技术就是 OT 算法：
A接收到的B操作：'在第3个字符后面插入了一个`d`'  ==ot==> 'aaacb在第4个字符后面插入了一个`d`'(aaacdb)
B接收到的A操作：'在第3个字符后面插入了一个`c`'  ==ot==> 'aaadb在第3个字符后面插入了一个`c`'(aaacdb)

OT 算法全名叫 Operation Transformation，你看从名字就对应了上面我说的转变算法。
假设我们的 OT 算法的转换功能叫 transform，那 transform（A，B）= A',B'。
也就是说你输入两个先后执行的行为，它会告诉你两个转换过后的行为，然后把 A'行为告诉 B，把 B'行为告诉 A，这样大家再应用就相安无事了。

核心公式：apply(apply(S,A),B) = apply(apply(S,B),A)
S:开始状态
A：A的操作A
B：B的操作B
冲突时，A执行完自己的操作后，再执行经OT转换的B操作。与B执行完自己的操作，再执行经OT转换的A操作，双方的结果是一致的。
图示：
![ot](http://www.alloyteam.com/wp-content/uploads/2019/07/0973dffd-399c-48e9-8fcf-77ff3a6809e6-272x300.png)

