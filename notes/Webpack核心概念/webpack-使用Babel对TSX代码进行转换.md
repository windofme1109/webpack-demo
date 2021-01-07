<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [使用 Babel 转换TSX](#%E4%BD%BF%E7%94%A8-babel-%E8%BD%AC%E6%8D%A2tsx)
  - [1. 安装基本的插件](#1-%E5%AE%89%E8%A3%85%E5%9F%BA%E6%9C%AC%E7%9A%84%E6%8F%92%E4%BB%B6)
  - [2. webpack 配置](#2-webpack-%E9%85%8D%E7%BD%AE)
  - [3. babel.config.json 配置](#3-babelconfigjson-%E9%85%8D%E7%BD%AE)
  - [3. 总结](#3-%E6%80%BB%E7%BB%93)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 使用 Babel 转换TSX 

## 1. 安装基本的插件

1. 使用 Babel 转换 TSX，首先需要安装 Babel 以及一系列的 Babel 插件和 Babel-preset。

2. 参考资料：[Webpack配置React支持Typescript的三种方式](https://blog.csdn.net/HatOfDragon/article/details/104043348/)

3. `@babel/core`
   - `npm install --save-dev @babel/core`
   - Babel 的核心模块。
   
4. `babel-loader`
   - `npm install --save-dev babel-loader`
   - 加载 js 代码。
   
5. `@babel/preset-typescript`
   - `npm install --save-dev @babel/preset-typescript`
   - 完成对 TypeScript 的转换。实际上，是将 TS 代码 转换为 ES6 代码。
   
6. `@babel/preset-env`
   - `npm install @babel/preset-env --save-dev`
   - 对 ES6 代码进行转换。
   
7. `@babel/polyfill`
   - `npm install --save @babel/polyfill`
   - 添加新的特性
   
## 2. webpack 配置

1. 在 webpack.config.js 中，主要是配置 `module` 中的 `rules` 字段，增加新的 loader。
   ```javascript
      // webpack.config.js
      module.exports = {
          module: {
              rules: [
                  {
                      test: /\.(js|jsx|ts|tsx)$/,
                      use: ['babel-loader'],
                      exclude: /node_modules/,
                  }
              ]
          }
      }
   ```
2. 需要 babel-loader 加载的文件类型包括 `js` 、`jsx`、`ts` 和 `tsx`。

## 3. babel.config.json 配置

1. 在 babel.config.json 中，我们主要是配置 preset 相关的内容：
   ```json
      {
        "presets": [
          [
            "@babel/preset-env",
            {
              "targets": {
                "firefox": "60",
                "chrome": "67"
              },
              "useBuiltIns": "usage"
            }
          ],
          ["@babel/preset-react"],
          [
            "@babel/preset-typescript",
            {
              "isTSX": true,
              "jsxPragma": "react",
              "allExtensions": true
            }
          ]
        ]
      }
   ```
2. 先将 TSX 代码进行转换为 JSX，然后将 JSX 转换为 ES6，最后对 ES6 代码进行转换。

3. 三个 preset 的顺序不能变。

## 3. 总结

1. 使用 babel-loader 对 `js` 、`jsx`、`ts` 和 `tsx` 加载这几个类型的文件。

2. `@babel/preset-typescript` 完成 TS 或者 TSX 的转换，TS --> ES6，TSX --> JSX。`@babel/preset-react` 完成对 JSX 代码的转换。

