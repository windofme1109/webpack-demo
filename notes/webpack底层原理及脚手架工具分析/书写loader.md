# 自己书写一个 loader

## 1. 基本的自定义 loader

1. loader 实际上就是一个函数，在打包前对源码进行处理，处理后webpack 才能对其进行打包以及后续的操作。
   > Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph.

2. 在项目的根目录下，新建一个目录：`loaders`，在这个目录下，新建一个文件：`replaceLoader.js`，内容如下：
   ```javascript
      /**
       * loader 接收入口文件的源代码，然后我们对源代码进行一些操作，最后返回操作后的源代码
       * @param source 入口文件的源代码
       */
      module.exports = function(source) {
          const result = source.replace('qinney', 'china');
          return result;
      }
   ```
   这样我们就完成了一个最基本的 loader，这个 loader 的作用将源代码中的 `qinney` 替换为 `china`，然后将替换的源代码返回。

3. 使用 loader。新建 `webpack.config.js`，配置如下：
   ```javascript
      // webpack.config.js
      const path = require('path');
      module.exports = {
          mode: 'development',
              entry: {
                  main: './src/index.js'
              },
              module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                // 使用自定义 loader，需要我们使用自定义 loader 的绝对路径
                                loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
                            }
          
                        ]
                    }
                ]
              },
              output: {
                  path: path.resolve(__dirname, './dist'),
                  filename: '[name].js'
              }
      }
   ```
   配置方式基本没有变化，需要注意的是，因为是我们自定义的 loader，而 webpack 默认是去 node_modules 中去查找的，所以我们需要指定 loader 的绝对路径，这样 webpack 才能找到这个 loader。

4. 书写 loader 的注意事项：
   - loader **不能使用箭头函数**，因为箭头函数没有 `this` 指向，而 loader 需要 `this` 做一些事，webpack 会改变函数的 `this` 指向，调用挂载到 `this` 上的一些方法。
   - loader 接收的是入口文件的源码，输出的是处理后的源码，因此，loader 必须有返回值，且为处理后的源码。

## 2. 基本的自定义 loader -- 使用 `options`

1. 我们在 `webpack.config.js` 配置 loader 时，经常配置 `options` 这项，用来控制 loader 的一些行为。

2. 在自定义 loader 中，有两种方式获得 `options` 中的配置项：
   - 原生方式 -- 通过 `this.query` 拿到，即 `options` 对象指向了 `this.query`
   - 第三方工具 -- `loader-utils`，webpack 推荐的方式获取 `options`。
   
3. `this.query`
   - 我们假设在 `webpack.config.js` 中自定义 loader 的 `options` 的配置如下：
     ```javascript
        // webpack.config.js
        module.exports = {
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
                                options: {
                                    name: 'china'
                                }
                            }
                        ]
                    }
                ]
            }
        }
     ```
   - 在自定义 loader 中，就可以通过 `this.query` 拿到 `options`。
     ```javascript
        module.exports = function(source) {
           // options 的配置是：{ name: 'china' }
           // this.query 的输出是：{ name: 'china' }
           console.log(this.query);
     
           const result = source.replace('qinney', 'china');
           return result;
        }
     ```
   - webpack 不推荐使用 `this.query`，因为我们配置 `options` 的时候，不一定是对象，有可能是字符串或者其他形式，所以使用 `this.query` 获取 `options` 就比较麻烦了。
   
4. `loader-utils`
   - webpack 推荐的方式获取 `options`。
   - 安装：`npm install loader-utils --save`
   - 使用
     ```javascript
        // replaceLoader.js
        const loaderUtils = require('loader-utils');
        module.exports = function(source) {
            // { name: 'china' }
            const options = loaderUtils.getOptions(this);
            console.log(options);
        
        }
     ```
     使用 getOptions()，并传入 `this` 对象，返回值就是我们配置的 `options`。
     
## 3. 基本的自定义 loader -- 使用 `this.callback()`

1. 前面我们写的 loader 都是直接对源码进行处理，返回值也只能是源码，进行不了更多的操作。如果是有一些 sourceMap 之类的内容，就无法传递到外面给 webpack 使用。因此我们需要使用 `this.callback()` 返回更多的内容。

2. `this.callback()` 定义
   - `this.callback()` 可以同步的或者异步的被调用，并返回多个结果。
      ```javascript
         this.callback(
             err: Error | null,
             content: string | Buffer,
             sourceMap?: SourceMap,
             meta?: any
         );
      ```
   - 参数：
     - 第一个必须是 Error 对象或者是 null
     - 第二个是字符串或者为 buffer
     - 第三个参数可选，如果传递，则必须是 sourceMap
     - 第四个参数，会被 webpack 忽略，可以是任何内容

3. 使用
   ```javascript
      //replaceLoader.js
      module.exports = function(source) {  
          const result = source.replace('qinney', 'china');
          this.callback(null, result);
      }
   ```
   
## 4. 异步的自定义 loader -- `this.async()`

1. 假设在 loader 中，有一个异步操作，如下所示：
   ```javascript
      // replaceLoader.js
      module.exports = function(source) {
          setTimeout(() => {
             return source.replace('world', 'qinney');
          }, 1000)
      }
   ```
   1s 后返回处理结果。显然，此时使用 webpack 打包显然会报错。

2. 为了解决异步操作的我们，我们需要引入 `this.async()`，这个函数的作用就是告诉 webpack()，loader 内部有异步操作，webpack 需要等待异步操作结果的返回，再进行下面的操作。

3. `this.async()` 用法
   - `this.async()` 的返回值是 `this.callback()`。
   - 示例：
     ```javascript
         // replaceLoader.js
         module.exports = function(source) {
         const ret = source.replace('world', 'qinney');
         const callback = this.async();
              setTimeout(() => {
                  callback(null, ret); 
              }, 1000)
         }
     ```
   - 这样就可以在 loader 中引入异步操作了。
   
## 5. 加载多个自定义 loader

1. 我们新建一个 loader，是一个异步 loader，内容如下：
   ```javascript
      // replaceLoaderAsync.js
      const loaderUtils = require('loader-utils');
      module.exports = function (source) {
          // webpack 推荐使用 loader-utils 中的 getOptions() 方法拿到
          const options = loaderUtils.getOptions(this);
          const result = source.replace('world', options.name);  
          // 异步操作
          // this.async() 是一个函数，返回的结果是 this.callback()
          //调用这个函数，表示我们的 loader 中有异步操作
          // 我们在异步操作中 调用 this.async() 的返回值——this.callback()
          // 则 webpack 会等到异步操作结束，再继续进行打包
          const callback = this.async();
          setTimeout(() => {
              callback(null, result);
          }, 1000);
      }
   ```
2. 在 webpack 中，配置两个自定义 loader，内容如下：
   ```javascript
      const path = require('path');
      module.exports = {
          module: {
             rules: [
                 {
                     test: /\.js$/,
                     use: [
                          {
                              loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
                          },
                          {
                              loader: path.resolve(__dirname, './loaders/replaceLoaderAsync.js'),
                              options: {
                                  name: 'apple'
                              }
                          },
                     ]
                 }
             ]
          }
      }
   ```
   根据 loader 的使用顺序，就可以先使用异步的 loader，再使用同步的 loader 了。
   
3. 从上面的配置中，可以看出，每次新加一个自自定义 loader，就要写一个绝对路径，比较麻烦，有没有简便的方式呢？答案是有，就是配置 `resolveLoader` 字段。

4. 在 webpack.config.js 中配置 `resolveLoader` 字段如下：
   ```javascript
      // webpack.config.js
      module.exports = {
          resolveLoader: {
              module: ['node_modules', './loaders']
          }
      }
   ```
   字段解读：
   - `resolveLoader` 用来配置加载 loader 时的一些配置。值为对象。
   - `resolveLoader.module` 值为数组，指定从哪些路径下，寻找 loader。
   - `resolveLoader.extensions` 值为数组，指定文件的扩展名。
   - `resolveLoader.mainFields` 值为数组，这个字段的用法和 `resolve.mainFields` 用法一样，根据 `package.json` 文件中的 `main` 字段的文件名来查找文件。
   
## 6. 自定义 loader 使用场景

1. 国际化

2. 捕获异常

3. 对代码进行包装