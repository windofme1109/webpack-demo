<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [代码分隔 - Code Splitting](#%E4%BB%A3%E7%A0%81%E5%88%86%E9%9A%94---code-splitting)
  - [1. 基本概念](#1-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2. 配置 webpack 实现代码分割 -- 静态引入](#2-%E9%85%8D%E7%BD%AE-webpack-%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2----%E9%9D%99%E6%80%81%E5%BC%95%E5%85%A5)
  - [3. 配置 webpack 实现代码分割 -- 动态引入](#3-%E9%85%8D%E7%BD%AE-webpack-%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2----%E5%8A%A8%E6%80%81%E5%BC%95%E5%85%A5)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 代码分隔 - Code Splitting

## 1. 基本概念

1. 代码分隔，就是指的是我们将业务逻辑和使用的第三方代码分开。在不同的文件书写，这样打包的时候，就会分开打包。这样浏览器加载的时候，也会分开加载，这样能提高加载效率，而且，如果我们改动了业务代码，并重新打包，这样浏览器只加载业务代码即可，而第三方代码由于会被浏览器缓存，不会被重新请求并加载。节约了了请求，提高了加载效率。

2. 示例
   - 引入一个第三方模块：`lodash`，我们要使用其中的方法。执行：  
   `npm install --save lodash`
   - 在 index.js 中，添加下面的代码：
     ```javascript
        import _ from 'lodash';
        console.log(_.join([1, 2, 3, 4], '-'));
        console.log(_.join([1, 2, 3, 4], '***'));
     ```
   - 我们引入了 lodash 这个模块，这样整个模块都会被打包进 main.js 文件中（没有开启 tree shaking）。而且业务逻辑和第三方模块混合在一起，会导致两个问题：
     - 打包后的 main.js 文件体积过大
     - 修改 index.js 文件中的业务逻辑，重新打包后，浏览器会重新请求，影响效率。
   - 现在我们手动实现代码分割。首先我们新建一个文件：lodash.js，内容如下：
     ```javascript
        import _ from 'lodash';
        window._ = _;
     ```
     将 lodash 挂载到 window 对象。
   - 在 index.js 中，去除导入 lodash 的语句。
     ```javascript
        console.log(_.join([1, 2, 3, 4], '-'));
        console.log(_.join([1, 2, 3, 4], '***'));
     ```
   - 修改 webpack.common.js 中打包入口文件：
     ```javascript
        module.exports = {
            entry: {
                lodash: './src/lodash.js',
                main: './src/main.js'
            }
        }
     ```
   - 执行 `npm run dev-build`，在 dist 目录下，就会生成一个 lodash.js 文件，在 index.html 中也会引入这个 lodash.js 文件。
   - 这样我们就将业务逻辑代码和第三方的模块代码分开，我们只需修改我们的业务逻辑代码，浏览器也只需要重新加载业务逻辑代码即可。
   
## 2. 配置 webpack 实现代码分割 -- 静态引入

1. 配置 webpack，可以实现自动的代码分割。

2. 配置 webpack
   ```javascript
      module.exports = {
          optimization: {
              splitChunks: {
                  chunk: 'all'
              }
          }
      }
   ```
   在 webpack.common.js 中，配置 `optimization` 字段中的 `splitChunks` 属性，设置其值为 `all`。
   
3. 在 index.js 中，直接引入 lodash 模块，如下所示：
   ```javascript
      import _ from 'lodash';
      console.log(_.join([1, 2, 3, 4], '-'));
      console.log(_.join([1, 2, 3, 4], '***'));
   ```
4. 执行打包命令：`npm run dev-build`，webpack 会自动将第三方模块打包为一个单独的文件：`vendors~main.js`，部分内容如下所示：
   ```javascript
      (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~main"],{
      
      /***/ "./node_modules/lodash/lodash.js":
      /*!***************************************!*\
        !*** ./node_modules/lodash/lodash.js ***!
        \***************************************/
      /*! no static exports found */
      /*! exports used: default */
      /***/ (function(module, exports, __webpack_require__) {
            }
      }
   ```
   
5. 对静态导入的模块，`import _ from 'lodash';`，配置了 webpack 中的 `splitChunks` 字段后，webpack 会自动进行代码分割。将第三方模块单独打包为一个文件。

## 3. 配置 webpack 实现代码分割 -- 动态引入

1. 动态导入指的是使用 import() 函数，在需要导入模块的地方再导入模块。

2. import() 函数返回值是 Promise，所以可以使用 then() 方法链式调用。

3. 使用 import() 完成动态导入，不需要配置 webpack，即可实现代码分割。

4. import() 还不是正式的 ES 规范，直接使用 webpack 打包可能会报错，所以，我们这里需要引入一个 babel 插件：`babel-plugin-dynamic-import-webpack`，这个插件的作用是将动态导入 `import()` 转换为 webpack 下的 `require.ensure`。这样才能使用动态导入。
   - 安装  
     `npm install babel-plugin-dynamic-import-webpack --save-dev`
   - 配置  
     在 `.babelrc` 或者 `babel.config.json` 中进行配置：
     ```json
        {
            "plugins": ["dynamic-import-webpack"]
        }
     ```
   - `babel-plugin-dynamic-import-webpack` 的说明：[babel-plugin-dynamic-import-webpack](https://github.com/airbnb/babel-plugin-dynamic-import-webpack#readme)

5. import() 动态导入的模块，打包后，会生成一个 `0.js` 的文件。

6. 2020.12.09 新增：更高版本的 node 好像支持 import() 语法，不使用 `babel-plugin-dynamic-import-webpack` 这个插件也能实现打包。

7. 动态导入参考：[dynamic-imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
