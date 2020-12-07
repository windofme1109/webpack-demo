<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [配置 source-map](#%E9%85%8D%E7%BD%AE-source-map)
  - [1. source-map 概念](#1-source-map-%E6%A6%82%E5%BF%B5)
  - [2. 基本用法](#2-%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)
  - [3. Devtool 其他值](#3-devtool-%E5%85%B6%E4%BB%96%E5%80%BC)
  - [4. 总结](#4-%E6%80%BB%E7%BB%93)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 配置 source-map

## 1. source-map 概念

1. source-map用来建立源文件同打包后的文件的对应代码的映射关系。

2. 参考文档：[Devtool](https://v4.webpack.js.org/configuration/devtool/#devtool)

## 2. 基本用法

1. 举个栗子：
   - 在index.js中写入这么一行代码：`consele.log('hello world') ;` 显然会报错。
   - 然后在webpack.config.js中，进行下面配置：
     ```javascript
        module.exports = {
            // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
            // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
            mode: 'development',
        
            //
            devtool: 'none'
        }
     ```

   - `devtool` 这个属性可以指定一种源码的映射方式，降低调试的难度。
   
3. html 文件引入的是打包后的 js 文件。但实际出问题的代码并不在 js 文件中。我们需要定位到源文件中。这个 devtool 就是建立这种映射关系的。帮助我们定位出错的代码的具体位置。

4. 参考说明地址：[devtool](https://v4.webpack.js.org/configuration/devtool/#devtool)

5. `devtool` 如果设置为 `none`，则没有建立任何映射关系。此时打包并在浏览器端执行后，报错，提示：
   ```javascript
      Uncaught ReferenceError: consele is not defined
          at Object../src/index.js (main.js:129)
          at __webpack_require__ (main.js:20)
          at main.js:84
      at main.js:87
   ```
6. 提示我们出错的地方是 main.js 的第129行。但是，我们实际上出错的地方应该是 index.js 中的那一行代码：
`consele.log('hello world') ;`
这样没有建立映射关系，对于我们调试代码很不友好。

7. 现在将 `devtool` 设置为`source-map`，如下所示：
   ```javascript
      module.exports = {
          // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
          // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
          mode: 'development',
      
          //
          devtool: 'source-map'
      }
   ```

8. 然后打包，并在浏览器端执行，依旧报错，但显示的信息为：
   ```javascript
      index.js:34 Uncaught ReferenceError: consele is not defined
          at Object../src/index.js (index.js:34)
          at __webpack_require__ (bootstrap:19)
          at bootstrap:83
      at bootstrap:83
   ```

9. 这里就提示我们出错的地方在 index.js 的第34行代码。这样的提示信息就对了。有助于我们快速定位到所在的出错代码的真实位置。
10. 在 dist 目录下，会生成一个 `main.js.map` 的文件，这个文件记录了代码的映射关系。

## 3. Devtool 其他值

1. `inline-source-map` 如下所示：
    ```javascript
       module.exports = {
           // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
           // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
           mode: 'development',
       
           //
           devtool: 'inline-source-map'
       }
    ```

    作用同 source-map 相同。区别是不会生成main.js.map文件，而是以base64编码的字符串置于main.js文件中。
    
2. `cheap-inline-source-map` 配置如下：
    ```javascript
       module.exports = {
           // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
           // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
           mode: 'development',
       
           //
           devtool: 'cheap-inline-source-map'
       }
    ```
    cheap 表示定位代码只定位到行，不会定位到列。而且，只管业务代码（index.js），而第三方模块，各种loader，均不会建立映射关系。这样可以提高打包性能。

3. `cheap-module-inline-source-map` 配置如下：
    ```javascript
       module.exports = {
           // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
           // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
           mode: 'development',
       
           //
           devtool: 'cheap-module-inline-source-map'
       }
    ```
    module 表示还会和各种模块建立映射关系。

4. `eval` 配置如下：
    ```javascript
       module.exports = {
           // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
           // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
           mode: 'development',
           //
           devtool: 'eval'
       }
    ```
    这是打包速度最快的一种方式。同时也会建立映射关系。

## 4. 总结

1. 推荐使用 `cheap-module-eval-source-map`，映射关系建立的比较全面，而且打包速度很快。

2. 如果是在生产环境下，也就是 `mode` 设置为 `production` 的情况下，`devtool` 设置为 `cheap-module-source-map`。

3. eval 模式打包最快，性能最好，但是在复杂代码的条件下，映射关系可能不是很详细，提示的内容不是很全面。
    ```javascript
       module.exports = {
              mode: 'production',
             devtool: 'eval'
       }
    ```
4. devtool 的配置项的总结：
   - 带 `source-map`（没有inline）的，一般会生成 `.map` 文件。
   - 带 `inline`（包括source-map）的，会将 `.map` 的内容打包进 main.js 文件里面。
   - 带 `cheap` （没有 module）的，表示只定位到行，不会定位到列。而且只管业务代码的错误，各种第三方模块和 loader 的错误不管。
   - 带 `module` 的，会将第三方模块和 loader 的错误也提示出来。
