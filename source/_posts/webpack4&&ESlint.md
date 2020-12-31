---
title: webpack4&&ESlint
date: 2020-12-15 16:23:27
tags:
- 前端工程化
- webpack
categories: webpack
---

#### ESlint
ESLint是一个用来识别ECMAScript 并且按照规则给出报告的代码检测工具，使用它可以避免低级错误和统一代码的风格。

```javascript
//.eslint.js
// 区分生产环境、开发环境
const _mode = process.env.NODE_ENV || 'production';

module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "globals": {
        "$": true,
        "process": true,
        "dirname": true,
    },
    "parser": "babel-eslint",
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "legacyDecorators": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-console": "off",
        "no-debugger": _mode==='development' ? 0 : 2,
        "no-alert": _mode==='development' ? 0 : 2,
        // "no-multi-spaces": "error",
        "no-unused-vars": "off", // react中不适用
        "no-constant-condition": "off",
        "no-fallthrough": "off",
        // "keyword-spacing": ["error", { "before": true} ], // 不生效，先注释
        // "indent": [
        //  "error",
        //  2
        // ],
        "linebreak-style": [
        "error",
        "unix"
        ],
        // "quotes": [
        //  "error",
        //  "single"
        // ],
        "semi": [0],
        "no-unexpected-multiline": 0,
        "no-class-assign": 0,
    }
};

```

#### 检查eslint

* 方式一: 安装husky，增加npm script，适合老项目

```javascript
"scripts": {
    //"precommit": "eslint --ext .js --ext .jsx src/",
    "precommit": "eslint lint-staged", // 增量检查修改的文件  
},
"lint-staged": {
    //"src/**/*.js": [
    //  "eslint --ext .js --ext .jsx",
    //  "git add"
    //]
    "linters": {
        "*.[js,scss]": ["eslint --fix", "git add"]
    }
}

```

* 方式二：webpack与eslint结合，新项目

```javascript
rules: [
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
    }
]

```

> 其实新项目中，可以将两种方式同时使用