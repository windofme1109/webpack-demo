# shimming - 垫片

## 1. 什么是 shimming

1. webpack 编译器能够理解 ES Moudle、CommonJS 和 AMD 这几种模块化方案。以 CommonJS 为例，每个 js 文件都是一个模块，必须通过 module.exports 方式导出。模块之间是隔离的，不会相互影响，想要使用另外一个模块的变量，必须使用 `require()` 函数引入。

2. 但是一些比较老的第三方库，比如说，jQuery，期望的是全局依赖，它希望导出的是全局变量，这样在每个模块都可以直接引用，这样就违背了上面所提到的模块化的原则。shimming 就可以解决这种情况。

3. 还有另外一种情况是：浏览器不支持 ES6 的新特性，需要引入 polyfill，这也属于 shimming 的作用范围。

4. shimming 参考资料（包括 shimming 使用案例）：[Shimming](https://v4.webpack.js.org/guides/shimming/#shimming-globals)

## 2. shiming 的用法 -- 引入全局变量

1. 在 src 下新建 `jquery.ui.js` 文件，内容如下：
   ```javascript
      export function ui() {
          $('body').css('background', 'hotpink');
      }
   ```
2. 在 index.js 中，引入 `jQuery`，`jquery.ui.js`，如下所示：
   ```javascript
      import $ from 'jquery';
      import _ from 'lodash';
      import {ui} from './jquery.ui';
      
      ui();
      const dom = $('div');
      dom.html(_.join(['hello', 'world'], ', '));
      $.append(dom);
   ```
   打包后，执行，发现报错，提示 `$` 不是函数。这是什么原因呢？
    
3. 我们假设这是一个第三方模块，它的运行依赖于全局 jQuery，在浏览器环境下，我们只要在这个模块加载前，加载了 jQuery，这个 `jquery.ui` 是可以正常运行的。但是在模块化机制下，如果我们没有在 `jquery.ui.js` 中引入 jQuery，那么 即使在 index.js 中引入了 jQuery，`jquery.ui` 也拿不到 `$`，我们又不可能去第三方模块中添加引入 jQuery 的语句。

4. 针对上面的情况，使用 webpack 提供的 `ProvidePlugin` 插件，即可解决依赖全局变量的问题。
   - 安装  
     这个插件是 webpack 自带的，所以不用安装。
   - 配置
     ```javascript
        // webpack.common.js
        const webpack = require('webpack');
        module.exports = {
            plugins: [
                new webpack.ProvidePlugin({
                    $: 'jquery'
                }),
            ],
        }
     ```
     配置了以后，webpack 会进行检测，在需要 jQuery 但是还没有导入的模块内，会自动帮助我们导入 jQuery。要求我们使用 jQuery 的形式是使用 `$` 这个全局变量。

5. 这样再次打包后，这个 `jquery.ui` 就能引用到 `$` 这个全局变量了。

6. 使用 `ProvidePlugin` 还可以给函数起别名，或者是只使用模块的某个方法，配置如下：
   ```javascript
      module.exports = {
          plugins: [
              new webpack.ProvidePlugin({
                   $: 'jquery',
                   _join: ['lodash', 'join']
              }),
          ],
      }
   ```
   我们就可以在模块中使用 `_join()` 来代替 `_.join()`。如下所示：
   ```javascript
      export function ui() {
          $('body').css('background', _join(['hot', 'pink'], ''));
      }
   ```
## 3. shiming 的用法 -- 改变模块的 this 指向

1. 对于模块而言，模块的 `this` 指向的是模块本身，而不是`window` 对象。在有一些情况下，我们需要将模块的 this 指向 window 对象，这个需要借助一个 loader 才能实现。

2. 安装 `imports-loader` 
   - `npm install --save imports-loader@0.8.0`

3. 配置
   - 修改 js 模块中的 this 指向，所以要配置 js 文件的 loader。
     ```javascript
        module.exports = {
            module: {
                rules: [
                    {
                       test: /\.js$/,
                       exclude: /node_modules/,
                       use: [
                           {loader: 'babel-loader'}, 
                           {loader: 'imports-loader?this=>window'}
                       ]
                    }
                ]
            }
        }
     ```
4. 这样就可以将 js 模块的 this 指向了 window。

5. 注意，我们这里使用的版本是 0.8.0，这个版本可以使用上面的配置方式。如果是最新版的，如 1.2.0，就不能使用上面的配置方式了，需要使用其他形式的配置方式，参考资料：[github-imports-loader](https://github.com/webpack-contrib/imports-loader)

6. 使用了 `imports-loader`，在index.js 中，就不能使用 `import`、`export` 等模块化语法，否则会报错。

7. `imports-loader` 这个模块给那些依赖于全局变量，如 jQuery 或者是 window 对象的模块的导入准备的。
> This is useful for third-party modules that rely on global variables like $ or this being the window object. The imports loader can add the necessary require('whatever') calls, so those modules work with webpack.