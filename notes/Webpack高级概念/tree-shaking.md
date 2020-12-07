<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Tree-Shaking](#tree-shaking)
  - [1. 基本概念](#1-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2. webpack 配置 - development](#2-webpack-%E9%85%8D%E7%BD%AE---development)
  - [3. webpack 配置 - production](#3-webpack-%E9%85%8D%E7%BD%AE---production)
  - [4. 注意事项](#4-%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Tree-Shaking

## 1. 基本概念

1. tree-shaking 指的是，从一个模块中导入几个变量，但不是全部导入，这样 webpack 在打包的过程中，只将用到的内容打包到输出的文件中，其余未用到的内容不打包到输出的文件中。

2. tree-shaking 只支持 ES Module。即 `import`、`export` 方式导入、导出的变量。不支持 commonJS。

3. 参考资料：[Tree Shaking](https://webpack.js.org/guides/tree-shaking/)

## 2. webpack 配置 - development

1. 在 webpack.config.js 中配置两个字段：
   - `mode` 设置为 `development`
   - `optimization` 值为对象，我们设置其中的 `usedExports` 为 `true`。
   - 具体如下：
     ```javascript
        module.exports = {
            mode: 'development',
            devtool: 'cheap-module-eval-source-map',
            optimization: {
                usedExports: true
            } 
        }
     ```
2. 在 package.json 中，添加 `sideEffects` 字段：
   ```json
      {
         "name": "webpack-demo",
         "sideEffects": false
      }
   ```
   - [Mark the file as side-effect-free](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)
   - side effect（副作用）定义为在导入时执行特殊行为的代码，而不是公开一个或多个导出。这方面的一个例子是 `polyfill`，它影响全局范围，通常不提供导出。
   > A "side effect" is defined as code that performs a special behavior when imported, other than exposing one or more exports. An example of this are polyfills, which affect the global scope and usually do not provide an export.
    - 上面意思就是，有一些模块，比如说 `@babel/polyfill`，我们不会单独导入某些变量，而是直接导入：`import '@babel/polyfill';`，或者是 css 文件，也是直接导入：`import './style.css';`。对于 webpack 而言，这样的导入方式没有使用的变量，所以使用 tree shaking 的情况下，`@babel/polyfill` 或者 css 文件更本不会被打包进最终的输出文件中，会被忽略。
    - 当我们使用类似于 `@babel/polyfill` 或者 css 文件时，我们不希望这样的情况发生，因此我们要在 package.json 中配置：
      ```json
         {
              "sideEffects": ["@babel/polyfill", "*.css"]
         }
      ```
      设置 `sideEffects` 值为数组，数组中的元素为模块名称。在 `sideEffects` 中的模块，不会被 tree shaking 忽略。  
      这个数组接收相关文件的glob模式，使用 glob-to-regex 来匹配文件，支持 `*`、`**`、`{a,b}`、`[a-z]`，像 `*.css`，不包括 `/`，会被解析为： `**/*.css`。
    - 如果我们希望全部忽略具有副作用的模块，就将 `sideEffects` 设置为 `false`。
    
    

## 3. webpack 配置 - production

1. `mode` 设置为 `production`，则默认启用了 tree shaking，不用单独配置 `optimization`。
 
## 4. 注意事项

1. 在 development 模式下，启用 tree shaking，仍然会将没有用到的代码打包到输出文件中，但是会给出提示：
   ```js
      /*! exports provided: add, minus */
      /*! exports used: add */
   ```
   而在 production 模式下，不会将没有用到的代码打包到输出文件中。