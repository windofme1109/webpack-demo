<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [webpack 打包 —— production 与 development 区别](#webpack-%E6%89%93%E5%8C%85--production-%E4%B8%8E-development-%E5%8C%BA%E5%88%AB)
  - [1. development](#1-development)
  - [2. production](#2-production)
  - [3. 抽出公共的配置文件](#3-%E6%8A%BD%E5%87%BA%E5%85%AC%E5%85%B1%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# webpack 打包 —— production 与 development 区别

## 1. development

1. development 指的是开发模式，在开发模式下，我们需要启用 devServer，热模块替换、sourceMap 这些功能，能够快速帮助我们进行开发，定位问题。

2. 我们新建一个 webpack 配置文件，在开发模式下使用，名称为：`webpack.dev.js`，配置如下：
   ```javascript
      const path = require('path');
   
      module.exports = {
           mode: 'development',
           devtool: 'cheap-module-eval-source-map',
           devServer: {
               contentBase: './dist',
               open: true,
               port: 8080,
               hot: true,
               hotOnly: true
           },
           
           entry: {
               main: './src/index.js',
           },
   
           module: {
                   // 规则。可以是多个
               rules: [
                   {
                      test: /\.(jpg|png|gif)$/,
                      use: {
                          loader: 'url-loader',
                          options: {
                              name: '[name].[ext]',
                              outputPath: 'images/',
                              limit: 4096
                          }
                      }
                   },
                   {
                      // 检测css文件
                      test: /\.css$/,
                      use: [
                          {
                         loader: 'css-loader',
                         options: {
        
                         importLoaders: 1,
                         
                         }
                      },
                         'postcss-loader'
                      ]
                   },
                   // 配置babel插件
                   {
                      test: /\.js$/,
                      exclude: /node_modules/,
                      // 加载loader
                      loader: 'babel-loader',
                      options: {
                          "plugins": [
                               [
                                   "@babel/plugin-transform-runtime",
                                   {
                                      "absoluteRuntime": false,
                                      "corejs": 2,
                                      "helpers": true,
                                      "regenerator": true,
                                      "useESModules": false
                                   }
                               ]
                          ]
                      }     
                   }
               ]
           },
           
           // 添加插件
           plugins: [
               new HtmlWebpackPlugin({
                   template: 'src/index.html'
               }),
               new CleanWebpackPlugin(),
               new webpack.HotModuleReplacementPlugin()
           ],
           
           optimization: {
               usedExports: true
           },
           output: {
               filename: '[name].js',
               path: path.join(__dirname, 'dist'),
           }
   
      }
   ```

3. 开发模式（development）下需要的字段有：
   - `mode`  配置为 `development`
   - `devtool`  配置为 `cheap-module-eval-source-map`
   - `devServer` 配置 `contentBase`、`port`、`open` `hot`、`htoOnly`
   - `optimization` 配置 `usedExported`
   - `plugins`  配置 `HtmlWebpackPlugin`、`CleanWebpackPlugin`、`webpack.HotModuleReplacementPlugin`
   
4. 在 package.json 文件中，修改 `script` 字段：
   ```json
      "scripts": {
          "dev": "webpack-dev-server --config webpack.dev.js",
          "bundle": "webpack"
        },
   ```   
   - 在开发环境下，我们的打包命令就是：`npm run dev`，表示我们启动的是 webpack-dev-server，执行的配置文件是 webpack.dev.js。
   
## 2. production

1. 在生产模式下，不需要 devServer、热模块替换（HMR）这些功能。

2. 我们新建一个 webpack 配置文件，在生产模式下使用，名称为：`webpack.prod.js`，配置如下：
   ```javascript
      const path = require('path');
      module.exports = {
          mode: '',
          entry: {
              main: './src/index.js'
          },
          module: {
              rules: [
                  {
                     test: /\.(jpg|png|gif)$/,
                     use: {
                         loader: 'url-loader',
                         options: {
                             name: '[name].[ext]',
                             outputPath: 'images/',
                             limit: 4096
                         }
                     }
                  },
                  {
                               
                      test: /\.css$/,
                      use: [
                           'style-loader',
                           {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                }
                           },
                           'postcss-loader'
                      ]
                  },
                  // 配置babel插件
                  {
                      test: /\.js$/,
                      exclude: /node_modules/,
                      // 加载loader
                      loader: 'babel-loader',
                      options: {
                          "plugins": [
                               [
                                  "@babel/plugin-transform-runtime", 
                                  {
                                     "absoluteRuntime": false,
                                     "corejs": 2,
                                     "helpers": true,
                                     "regenerator": true,
                                     "useESModules": false
                                  }
                               ]
                          ]
                      }
                  }
              ]
          },
          plugins: [
              new HtmlWebpackPlugin({
                  template: 'src/index.html'
              }),
              new CleanWebpackPlugin(),
          ],
          output: {
               path: path.resolve(__dirname, 'dist'),
               filename: '[name].js',
          },
      }
   ```
   
3. 生产模式（development）下需要的字段有：
      - `mode`  配置为 `production`
      - `devtool`  配置为 `cheap-module-source-map`
      - `plugins`  配置 `HtmlWebpackPlugin`、`CleanWebpackPlugin`

4. 在 package.json 文件中，修改 `script` 字段：
      ```json
         "scripts": {
             "build": "webpack --config webpack.prod.js",
             "bundle": "webpack"
           },
      ```   
      - 在生产环境下，我们的打包命令就是：`npm run build`，表示我们执行的就是 `webpack` 命令，执行的配置文件是 webpack.prod.js。

## 3. 抽出公共的配置文件

1. 由于生产环境和开发环境下的 webpack 配置文件有很多相同的内容，因此我们可以将相同的内容抽出，放到公共的配置文件中。

2. 新建  `webpack.common.js`，里面的内容是公共的配置项：
   ```javascript
      
      const path = require('path');
      
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      
      // 在打包之前删除打包文件的存放目录
      const {CleanWebpackPlugin} = require('clean-webpack-plugin');
      
      module.exports = {
          entry: {
              main: './src/index.js',
          },
          module: {
              // 规则。可以是多个
              rules: [
                  {
                      test: /\.(jpg|png|gif)$/,
                      use: {
                          loader: 'url-loader',
                          options: {
                              name: '[name].[ext]',
                              outputPath: 'images/',
                              limit: 4096
                          }
                      }
                  },
                  {
                      // 检测css文件
                      test: /\.css$/,
                      use: [
                          'style-loader',
                          // 配置css-loader
                          {
                              loader: 'css-loader',
                              options: {
                                  importLoaders: 1,
                              }
                          },
                          'postcss-loader'
                      ]
                  },
                  // 配置babel插件
                  {
                      test: /\.js$/,
                      exclude: /node_modules/,
                      // 加载loader
                      loader: 'babel-loader',
                      options: {
                          "plugins": [
                              [
                                  "@babel/plugin-transform-runtime",
                                  {
                                      "absoluteRuntime": false,
                                      "corejs": 2,
                                      "helpers": true,
                                      "regenerator": true,
                                      "useESModules": false
                                  }
                              ]
                          ]
                      }
                  }
              ]
          },
          plugins: [
              new HtmlWebpackPlugin({
                  // 添加模板html
                  // 指定HtmlWebpackPlugin插件使用的模板是src目录下的index.html
                  template: 'src/index.html'
              }),
              new CleanWebpackPlugin(),
          ],
          output: {
              filename: '[name].js',
              path: path.join(__dirname, 'dist'),
          }
      }
   ```
3. `webpack.dev.js` 和 `webpack.prod.js` 只保留同相关环境有关的配置即可。

4. 将 `webpack.common.js` 的内容导入到 `webpack.dev.js` 和 `webpack.prod.js` 这两个配置文件中，然后将配置项合并。为了能顺利合并配置项，我们这里引入一个新的模块：`webpack-merge`，这个模块可用来连接数组并合并对象，而不是覆盖组合。例如：
   ```javascript
      const {merge} = require('webpack-merge');
      const a = {
           num: [1, 2],
           name: 'jack'
      }
      const b = {
          num: [4, 5],
          age: 25
      }
      // { num: [ 1, 2, 4, 5 ], name: 'jack', age: 25 }
      merge(a, b);
   ```
   可以很方便的用来合并配置项。webpack 的很多配置项是数组或者是对象，那么在合并的时候，不要覆盖，而是合并这些配置项。  参考资料：[webpack-merge](https://www.cnblogs.com/cczlovexw/p/11765571.html)
   - 安装：`npm install webpack-merge -D`
   - 在 `webpack.prod.js` 中使用：
     ```javascript
        const {merge} = require('webpack-merge');
        const commonConfig = require('./webpack.common');
        
        const prodConfig = {
            mode: 'production',
            devtool: 'cheap-module-source-map',
        }
        
        module.exports = merge(commonConfig, prodConfig);
     ```
   - 在 `webpack.dev.js` 中的配置类似，这里不再详述。