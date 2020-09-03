---
title: ast抽象语法树
date: 2020-08-31 09:59:55
tags: 编译原理
categories: 编译原理
---
尽管通常将 JavaScript 归类为“动态”或“解释执行”语言，但事实上它是一门编译语言。--- 《你不知道的js(上)》

### 代码执行前的步骤-编译
下图是简易的重点流程，实际js的编译要复杂的多
* 词法分析（扫描scanner）
    这个过程将由字符组成的字符串分解为有意义的代码块，这些代码块叫“词法单元”。
    如： `let a = 2;` 将被分析为`[let, a, =, 2]`这些词法单元。空格算不算取决于空格在这门语言中是否有意义
    > [grammars-v4](https://github.com/antlr/grammars-v4)中有所有语言的语法规则，也包括js。
* 语法分析（解析器）
    这个过程是将词法单元流（数组，通俗的讲，处理过程就是个for循环）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为**“抽象语法树”**`Abstract Syntax Tree，AST`。
* 代码生成
    将生成的ast转化为可执行代码的过程。

### AST
[AST Explorer](https://astexplorer.net/)提供了很多不同的ast生成规则可用来学习
例如: 编译javascript时的`var a = 1;`将生成如下抽象语法树
```json
    {
        type: "Program",   // 程序
        start: 0,
        end: 10,
        body: [
            {  // VariableDeclaration
                type: "VariableDeclaration",    // 变量声明
                start: 0,
                end: 10,
                declarations: [
                    { // VariableDeclarator   // 变量声明者
                        type: "VariableDeclarator",
                        start: 4,
                        end: 9,
                        id: { // Identifier     声明a
                            type: "Identifier",
                            start: 4,
                            end: 5,
                            name: "a"
                        },
                        init:{          // 将a的值初始化为 1 
                            type: "Literal",
                            start: 8,
                            end: 9,
                            value: 1,
                            raw: "1"
                        }
                    }
                ],
                kind: "var"
            },
        ],
        sourceType: "module"
    }
```

### 实例：
* bable的编译使用了AST。
* 在vue3的模板语法编译，定义了自己的一套语法规则，使用AST大大提高了性能

### 扩展
[recast](https://www.npmjs.com/package/recast)是一个ast的工具，使用它可以查看ast，更换语法规则等。