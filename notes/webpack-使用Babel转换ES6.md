# Babel 转换 ES6

1. 如果想使用 ES6 语法，为了保证浏览器能够顺利执行，最好使用 Babel 进行编译，将其转换为 ES5。这样浏览器能够完全识别并运行。

2. 安装
   - `npm install --save-dev babel-loader @babel/core`

3. 配置
   - 在 webpack.config.js 中进行如下配置：
     ```javascript
        webpack.config.js
        module.exports = {
        	module: {
            	// 规则。可以是多个
            	rules: [
                	// 配置babel插件
                  {
                      test: /\.js$/,
                      // node_modules中的文件不会被编译
                      // 除去node_modules目录下的文件都会被编译
                      exclude: /node_modules/,
                      // 加载loader
                       loader: 'babel-loader',
                      //
                       options: {
                        // 只有使用了@babel/preset-env这个插件，才能将ES6转换为ES5
                        // 配置presets
                        presets: ['@babel/preset-env']
                     }
                 }
             ]
          },
        
        }
     ```

4. 配置项
   - `exclude` 表示不予要编译哪些文件夹中的js文件。

5. babel-loader 只是用来打包 js 文件，打通 webpack 和babel之间的关系。但并不对 ES6 代码进行编译。实际起作用的是 `@babel/preset-env` 这个插件，只有使用了这个插件，才能将 ES6 语法转换为 ES5 语法。所以还要安装这个插件：
`npm install @babel/preset-env --save-dev`
6. 在 `options` 中，添加 `presets` 属性，将`@babel/preset-env` 这个插件添加进去。如上面所示。这样才能实现在 Webpack 中转换 ES6 语法。

7. 上面的配置，使得 ES6 的语法转换为 ES5，但是对于新增的 Promise、map 等新的特性，却没有进行转换。
所以我们还需要使用另一个插件：`@babel/polyfill`
   - 安装：
`npm install --save @babel/polyfill`
   - 配置  
   还要在webpack.config.js中进行配置：
   ```javascript
      webpack.config.js
      module.exports = {
      	module: {
          	// 规则。可以是多个
          	rules: [
              	// 配置babel插件
                {
                    test: /\.js$/,
                    // node_modules中的文件不会被编译
                    // 除去node_modules目录下的文件都会被编译
                    exclude: /node_modules/,
                    // 加载loader
                     loader: 'babel-loader',
                    //
                     options: {
          		// 只有使用了@babel/preset-env这个插件，才能将ES6转换为ES5
          		// 配置presets
          		presets: [['@babel/preset-env', {
      	// 这个配置项用于@babel/polyfill这个插件
      // 设置为usage,只会编译我们项目中出现的ES6新特性，如Promise等，没有用到的不会打包进文件中
      // 如果不配置，会将所有的ES6新特性打包，会导致我们的文件很臃肿
      
                       useBuiltIns: 'usage'
      
                     }]]
                  }
               }
           ]
        },
      
      }
   ```
   - 配置项
     - `useBuiltIns`  主要决定 `@babel/preset-env` 这个插件如何处理 polyfills。  
       设置为 `usage`，表示只会编译我们项目中出现的 ES6 新特性，如 Promise 等，没有用到的不会打包进文件中。  
       默认是 `false`。  
       还可以设置为 `entry`。然后在使用 ES6 的js文件中，添加：`import '@babel/polyfill';`
引入`@babel/polyfill`，然后就可以愉快的使用 ES6，不用担心兼容性了。
   - 注：`@babel/polyfill` 使用 ES5 的方式实现了 ES6 的新特性。保证了兼容性。

8. 在 `presets` 属性中，还可以配置其他选项：
   ```javascript
      webpack.config.js
      presets: [['@babel/preset-env', {
          // 这个target属性的作用是：设置目标浏览器的版本
          // 打包后的js文件要运行在什么版本的浏览器上面
          // babel会根据浏览器版本决定是否对ES6语法进行编译
          // 如果浏览器原生支持，就不需要编译
          targets: {
              firefox: '60',
              chrome: '67',
      
          },
          // 这个配置项用于@babel/polyfill这个插件
          // 只会编译我们项目中出现的ES6新特性，如Promise等，没有用到的不会打包进文件中
          // 如果不配置，会将所有的ES6新特性打包，会导致我们的文件很臃肿
          useBuiltIns: 'usage'
      }]]
   
   ```
  
   - 配置项
     - `target`  用来设置目标浏览器的版本。babel 会根据浏览器版本决定是否对 ES6 语法进行编译，如果浏览器原生支持，就不需要编译。

9. 如果觉得 `options` 中的配置项过多，我们可以将配置项拿出来。新建一个 `.babelrc` 文件，以 json 格式填入 `options` 中的内容：
   ```javascript
      .babelrc
      {
        "presets": [["@babel/preset-env", {
      
          "targets": {
            "firefox": "60",
            "chrome": "67"
          },
      
          "useBuiltIns": "usage"
        }]]
      }
   ```
   然后将webpack.config.js中的内容注释掉。

10. 2020.12.05 新增：现在的babel 配置文件，已经更名为：babel.config.json，内容和.babelrc 一样，都是 json格式的内容。配置说明：[configuration](https://babeljs.io/docs/en/usage/#configuration)

11. 如果我们写的是业务代码，可以使用 polyfill，同时配置 `preset` 属性和 `useBuildIns` 属性，将polyfill 打包进入输出的 js 文件中。但是，如果我们写的是框架或者是第三方服务，我们就不能将 polyfill 打包到最终的 js 文件中，因为会污染全局环境，此时，就需要进行另外的配置。
    - 首先在我们写的 js 代码中，不导入 `@babel/polyfill` 这个包，
然后安装 `@babel/plugin-transform-runtime` 、`@babel/runtime`，安装命令如下：  
      - `npm install --save-dev @babel/plugin-transform-runtime`  
      - `npm install --save @babel/runtime`
    - 然后在 webpack.config.js 或者 `.babelrc` 或者 `babel.config.json` 中进行配置：
      ```javascript
         "plugins": [
             [
                 "@babel/plugin-transform-runtime", {
                 "absoluteRuntime": false,
                 "corejs": false,
                 "helpers": true,
                 "regenerator": true,
                 "useESModules": false
             }
             ]
         ]
      ```

    - 注意，配置 `plugins` 与配置 `preset` 类似，值为数组，数组的元素还是数组，第一个参数是插件名，第二个参数是插件配置项。  
我们要将 `corejs` 由 `false` 改为 `2` 或者 `3`，改写的目的是重新从 `core-js` 中引用 polyfill api，`2` 表示支持全局变量（如 Promise）或者是静态属性（如 Array.from），`3` 表示支持实例属性（如 [].includes）。
    - 设置 `corejs` 为 `2` 或者 `3`，需要安装新的插件：  
`corejs` 为 `2`：
`npm install --save @babel/runtime-corejs2`  
`corejs` 为 `3`：    `npm install --save @babel/runtime-corejs3`

12. 详细的参考资料：[babel-plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
