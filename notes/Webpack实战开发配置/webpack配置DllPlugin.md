# webpack 配置 DllPlugin

## 1. 背景

1. 我们在代码中，经常要引入第三方模块，如下所示：
   ```javascript
      // index.js
      import React, {Component} from 'react';
      import ReactDOM from 'react-dom';
      import _ from 'lodash';
   
      class App extends Component {
          render() {
              return (
                  <div>
                   hello world
                  </div>
              )
          }
      }
   ```
2. 我们修改依次代码，就要重新打包一次，那么这些第三方模块也要重新打包，实际上，我们根本没有必要每一次都打包第三方模块，只需要打包一次，将打包后的文件引入即可，这样可以提高打包效率。

3. 所以，需要使用 `DllPlugin`、`DllReferencePlugin`、`add-asset-html-webpack-plugin` 这几个插件配合，实现对第三方模块一次打包、处处使用的目的。

4. 参考资料：
   - AddAssetHtmlPlugin 插件：[add-asset-html-webpack-plugin](https://github.com/SimenB/add-asset-html-webpack-plugin#readme)
   - DllPlugin 和 DllReferencePlugin 的说明 [dll-plugin](https://v4.webpack.js.org/plugins/dll-plugin/)
   
   
   
## 2. `add-asset-html-webpack-plugin` 的使用

1. 新建一个 webpack.dll.js，这个文件用于打包第三方模块的配置文件：
   ```javascript
      // 打包第三方模块使用
      const path = require('path');
      
      module.exports = {
          entry: {
              // 设置入口文件为 react 等第三方模块
              vendor: ['react', 'react-dom', 'lodash']
          },
      
          output: {
              filename: '[name].dll.js',
              // 将第三方模块打包后的文件的输出的路径为 dll 目录
              path: path.resolve(__dirname, './dll'),
              // 设置将打包后的文件作为一个模块，设置其为一个全局变量，名为 vendor
              // 名称就是 entry 中的文件名 vendor
              library: '[name]'
          }
      }
   ```

2. 在 `index.html` 中引入打包后的第三方模块文件。这里我们要借助 `add-asset-html-webpack-plugin` 这个插件来实现我们的目的，这个插件可以向 `index.html` 插入一些静态资源，如 css，js 文件等。参考文档：[add-asset-html-webpack-plugin](https://github.com/SimenB/add-asset-html-webpack-plugin#readme)
   - 安装
     `npm install add-asset-html-webpack-plugin -D`
   - 使用  
     - 注意，在 webpack 4.0 以上的版本，AddAssetHtmlPlugin 插件要在  HtmlWebpackPlugin 插件的后面使用。
     - 示例：
       ```javascript
          // 打包第三方模块使用
          const path = require('path');
          const HtmlWebpackPlugin = require('html-webpack-plugin');
          const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
          
          module.exports = {
              entry: {
                  // 设置入口文件为 react 等第三方模块
                  vendor: ['react', 'react-dom', 'lodash']
              },
          
              output: {
                  filename: '[name].dll.js',
                  path: path.resolve(__dirname, './dll'),
                  library: '[name]'
              },
          
              plugins: [
                  new HtmlWebpackPlugin(),
                  new AddAssetHtmlPlugin({
                      filepath: path.resolve(__dirname, './dll/vendor.dll.js'),
                  })
              ]
          }
       ```
       `AddAssetHtmlPlugin` 这个插件可以接收多个配置参数，最常用的就是 `filepath`，作用是指定要插入 `index.html` 中的资源的路径。必须指定绝对路径。支持字符串路径或者是 `glob` 模式的路径。

## 3. 配置 pakcage.json 

1. 在 `script` 中，新添加一条打包命令：
   ```json
      {
          "scripts": {
              "build:dll": "webpack --config webpack.dll.js"
            }
      }
   ```

2. 这样就实现对第三方模块的打包，并引入到 `index.html` 文件中。

## 4. 对生成的 dll 文件进行映射

1. dll 是 Dynamic-link library 的缩写，即动态链接文件。也就是打包后的的第三方模块文件，现在我们要将这个文件映射到我们的项目中。因此要使用 `DllPlugin` 和 `DllReferencePlugin`，这两个插件提供了拆分包的方法，可以极大地提高构建时性能。

2. `DllPlugin` 和 `DllReferencePlugin` 在不同的 webpack 配置文件中使用。

2. `DllPlugin` 这个插件在单独的 webpack 配置文件中使用，仅仅应用于 dll 文件，它创建了一个 `manifest.json` 文件，`DllReferencePlugin` 使用该文件映射依赖项。
   > The DllPlugin and DllReferencePlugin provide means to split bundles in a way that can drastically improve build time performance. 
3. `DllPlugin` 是 webpack 内置的插件，无需单独安装。配置方法如下：
   ```javascript
      // webpack.dll.js
      const path = require('path');
      const webpack = require('webpack');
      module.exports = {
           
                
          plugins: [
              new webpack.DllPlugin({
                          // 这个 name 属性是对外暴露的全局变量，就是 output 中，library字段指定的值
                          name: '[name]',
                          // 
                          // DllPlugin 会生成一个 manifest.json 文件，用来指定导入的模块到全局变量的映射关系
                          // 因为我们把第三方模块打包为一个文件，并导出一个全局变量，那么这个全局变量和导入的第三方模块是什么关系
                          // DllPlugin 就负责生成这种映射关系
                          // path 参数指定 manifest.json 的存放路径
                          path: path.resolve(__dirname, './dll/[name].manifest.json'),
                      })  
          ]
          
      }
   ```
4. `DllPlugin` 会生成一个 manifest.json 文件，用来指定导入的模块到全局变量的映射关系，因为我们把第三方模块打包为一个文件，并导出一个全局变量，那么这个全局变量和导入的第三方模块是什么关系，怎么对应起来，`DllPlugin` 就负责生成这种映射关系。这样，我们使用第三方模块时，就直接从打包后的 vendor.dll.js 文件中引入，而不是 从 node_modules 中引入。

5. 在 webpack.common.js 中使用 `DllReferencePlugin` 这个插件，目的时解析 manifest.json 中的映射关系。示例如下：
   ```javascript
      // webpack.common.js
      const webpack = require('webpack');
      module.exports = {
          plugins: [
              new webpack.DllReferencePlugin({
                      // 指定了 manifest.json 的路径
                      // 负责引用 第三方模块与 vendor.dll.js （全局变量 vendor）的映射关系
                      // 引用第三方插件时，这个插件去 manifest.json 去寻找上述的映射关系
                      // 找到了，就直接从 vendor.dll.js 中引用，就没有必要重新打包了
                      // 如果没有找到这个映射关系，就去 node_modules 中查找，并重新打包
                      manifest: path.resolve(__dirname, './dll/vendor.manifest.json')
              })
          ]   
      }
   ```
   负责引用 第三方模块与 vendor.dll.js （全局变量 vendor）的映射关系,引用第三方插件时，这个插件去 manifest.json 去寻找上述的映射关系。找到了，就直接从 vendor.dll.js 中引用，就没有必要重新打包了。如果没有找到这个映射关系，就去 node_modules 中查找，并重新打包。
   
6. 无论是生产环境下的构建，还是开发环境的构建，两种情况下的配置文件的底层都是 webpack.common.js，这样就会使用 `DllReferencePlugin` 去分析映射关系，避免了重复打包。

7. 配置多个第三方模块的入口文件
   - 如果我们在 `entry` 配置多个第三方入口文件，如下所示：
     ```javascript
        module.exports = {
            entry: {
              vendor: ['lodash'],
              react: ['react', 'react-dom']
            },
        }
     ```
   - 那么会生成多个打包文件（ dll 文件），同样会生成多个 manifest.json 文件。
   - 由于都是第三方模块，我们需要在 index.html 中引入，同时需要 `DllReferencePlugin` 去分析映射关系。因此需要对 `AddAssetHtmlPlugin` 和 `DllReferencePlugin` 进行配置。
   - 配置 `AddAssetHtmlPlugin`
     - `AddAssetHtmlPlugin` 的配置项可以是一个数组，数组的元素是配置对象，这样就可以传入多个需要加入 index.html 的静态资源。如下所示：
      ```javascript
         // webpack.common.js
         module.exports = {
              plugins: [
                  new AddAssetHtmlPlugin([
                      {filepath: path.resolve(__dirname, './dll/vendor.dll.js')},
                      {filepath: path.resolve(__dirname, './dll/react.dll.js')},
                  ])
              ]
         }
      ```
   - 配置 `DllReferencePlugin` 
     - 好像 `DllReferencePlugin` 这个插件不能配置批量的解析 manifest.json，所以如果有多个 manifest.json，所以需要引入多个 `DllReferencePlugin` 插件进行单独配置。
       ```javascript
          // webpack.common.js
          module.exports = {
              plugins: [
                  new webpack.DllReferencePlugin({
                      manifest: path.resolve(__dirname, './dll/vendor.manifest.json')
                  }),
                  
                  new webpack.DllReferencePlugin({
                      manifest: path.resolve(__dirname, './dll/react.manifest.json')
                  })
              ]
       
          }
       ```
   - 如果每添加一个第三方入口文件，我们就去添加一个 `DllReferencePlugin`，这样比较麻烦。所以我们写一个函数，自动读取 dll 目录下的 manifest.json 文件，然后生成一个 `DllReferencePlugin` 的配置，并添加到 `plugins` 数组中：
     ```javascript
        // webpack.common.js
        const fs = require('fs');
        const path = require('path');
        const files = fs.readdirSync(path.resolve(__dirname, './dll'));
        let plugins = [
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new AddAssetHtmlPlugin([
                {filepath: path.resolve(__dirname, './dll/vendor.dll.js')},
                {filepath: path.resolve(__dirname, './dll/react.dll.js')},
            ]),
        ];
        files.forEach(file => {
            if (/.*\.manifest.json/.test(file)) {
                plugins.push(
                    new webpack.DllReferencePlugin({
                       manifest: path.resolve(__dirname, './dll', file)
                    }) 
                )
            }
        });
     
        module.exports = {
            plugins: plugins
        }
     ```
     我们在外面定义 plugins，然后获取 dll 目录下的所有文件名，使用正则表达式，获取 manifest.json 文件，然后根据这个文件名，生成 `DllReferencePlugin` 的配置项，并向 plugins 数组中添加新的 `DllReferencePlugin` 实例化对象。
     

## 5. 总结

1. 对于第三方模块，使用 dllPlugin 进行打包配置后，实现了一次打包，多次使用的效果。

2. 主要配置项
   - `entry` 配置第三方模块的入口文件
   - `output` 配置 `library` 字段
   - `plugins` 新增 `AddAssetHtmlPlugin` 、`DllPlugin` 和 `DllReferencePlugin` 这个三个插件

3. 新增 webpack.dll.js 配置文件，这个文件用于配置打包第三方模块的，主要的配置项就是 `entry`、`output` 和 `plugins`，`plugins` 只添加 `DllPlugin` 这个插件。

4. 插件的作用
   - `AddAssetHtmlPlugin`
     - 向 index.html 中添加静态资源。这个插件要配置在 `HtmlWebpackPlugin` 的后面。
   - `DllPlugin`
     - 生成 manifest.json 文件。主要配置 `name` 和 `path` 属性。
   - `DllReferencePlugin`
     - 分析 manifest.json 文件，得到第三方模块与打包生成的文件的映射关系

