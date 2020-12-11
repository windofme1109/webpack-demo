# 利用插件完成 css 代码的分割

## 1. 背景

1. 之前我们在引入 css 文件的时候，webpack 是将这个 css 文件打包到 index.html 中的 `style` 标签里面。如果 css 样式比较多，会导致 index.html 的体积比较大，影响加载性能。所以，我们需要对 css 文件进行分割，根据 在 js 文件中的引用情况，生成不同的 css 分割打包文件。

2. webpack 提供的官方插件：`mini-css-extract-plugin` 可以实现 css 代码的分割。

3. 参考资料：[mini-css-extract-plugin](https://v4.webpack.js.org/plugins/mini-css-extract-plugin/)
## 2. `mini-css-extract-plugin` 的 1.3.3 版本与 webpack 4 的兼容性问题

1. **注意**：目前我使用的 webpack 版本是 4.37.0，webpack-cli 的版本是 3.3.6，似乎和最新版的 `mini-css-extract-plugin` 有兼容性问题，最新的 `mini-css-extract-plugin` 版本是 1.3.3，我在项目中引入最新版的 `mini-css-extract-plugin`，同时按照官网的说明进行配置，执行打包命令报错：`TypeError: compilation.getAssets is not a function or its return value is not iterable`。然后，将版本更换为 1.2.0，就可以正常实现打包。

2. 1.2.0 版本的支持 HMR，所以既可以在开发环境下使用，也可以在生产环境下使用。

## 2. `mini-css-extract-plugin` 插件的基本使用

1. 安装
   - `npm install --save-dev mini-css-extract-plugin`
   
2. 配置
   - 在`webpack.common.js` 中引入 `mini-css-extract-plugin` 插件：
     ```javascript
        const MiniCssExtractPlugin = require('mini-css-extract-plugin');
     ```
   - 在 `plugins` 中引入并进行实例化：
     ```javascript
        module.exports = {
            plugins: [
                new MiniCssExtractPlugin({})
            ]
        }
     ```
   - 配置 `module.rules` 字段，如下所示：
     ```javascript
        module.exports = {
            module:{
                rules: [
                    {
                        test: /\.css$/,
                        use: [
                            // 'style-loader',
                            // 使用 mini-css-extract-plugin 对 css 代码进行分割，我们就不能使用 style-loader 进行打包
                            // 而是使用 mini-css-extract-plugin 提供的 loader
                         {
                             loader: MiniCssExtractPlugin.loader,
                             options: {
                                 // you can specify a publicPath here
                                 // by default it uses publicPath in webpackOptions.output
                                 // publicPath: '../',
                                 // hmr: process.env.NODE_ENV === 'development',
                             },
                         },
                         // 配置css-loader
                         {
                             loader: 'css-loader',
                             options: {
                                 importLoaders: 1,
                             }
                         },
                         'postcss-loader'
                     ]
                    }
                ]
            }   
       }
     ```
     使用 `mini-css-extract-plugin` 提供的 loader 来取代 `style-loader` 对 css 进行打包。

   - `mini-css-extract-plugin` 还可以配置一些参数，在 MiniCssExtractPlugin() 构造函数中，以对象的形式传入。详细说明：[github-mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)  
     示例如下所示：
     ```javascript
        module.exports = {
            plugins: [
                new MiniCssExtractPlugin({
                  // Options similar to the same options in webpackOptions.output
                  // both options are optional
                  filename: '[name].css',
                  chunkFilename: '[name].chunk.css',
                }),
              ],
        }
     ```
     - `filename` 入口的 js 文件中引入的 css 文件的打包后的名称，这个 css 文件会被 index.html 引入。  
     - `chunkFilename` css 文件中引入的其他 css 模块被打包后，就使用 `chunkFilename` 指定的名称。  
     - 这两个配置项与 `output` 中的 `filename` 和 `chunkFilename` 功能类似。
   - `MiniCssExtractPlugin.loader` 也可以使用一些配置项：如下所示：
     ```javascript
        module.exports = {
            rules: [
               {
                   test: /\.css$/,
                   use: [
                       {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './public/path/to/',
                                esModule: true,
                                modules: {
                                    namedExport: true,
                                }
                            }
                       }
                   ]
               }
            ]  
        }
     ```  
     - `publicPath` 给外部的资源，如 图片、文件，包括 css 文件等指定一个自定义的存放路径。工作原理类似于 `output` 字段中的 `publicPath`。output.publicPath 的说明：[output.publicPath](https://webpack.js.org/configuration/output/#outputpublicpath)
     - `esModule`  布尔值，默认为 `true`，`mini-css-extract-plugin` 默认使用 ES Module 语法生产 js 模块。如果想使用 commonJS 语法，设置 `esModule` 为 `false` 即可。
     - `modules`  值为对象，默认为 `undefined`，用来配置 CSS Modules。具体的配置项有：
       - `namedExport` 布尔值，默认为 false，作用是启用或者禁用 ES Modules 形式的命名导出 CSS 样式，这样导出的 css 样式是作用范围是局部样式。
         > Enables/disables ES modules named export for locals.
      
## 3. `mini-css-extract-plugin` 插件的高级用法

1. 压缩 css 代码
   - 在生产环境下，我们要对 css 代码进行压缩。使用 `optimize-css-assets-webpack-plugin` 这个插件可以实现。
   - 安装插件：`npm install -D optimize-css-assets-webpack-plugin`
   - 配置
     ```javascript
        // webpack.prod.js
        const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
        module.exports = {
             optimization: {
                 minimizer: [new OptimizeCSSAssetsPlugin({})],
             }
        }
     ```

2. 将不同的 js 文件中引入的 css 文件打包进一个文件中
   - 通过配置 `optimization.splitChunks.cacheGroups`，可以将不同的的 js 文件中引入的 css 文件打包进一个文件中。
     ```javascript
        const MiniCssExtractPlugin = require('mini-css-extract-plugin');
        module.exports = {
          optimization: {
            splitChunks: {
              cacheGroups: {
                styles: {
                  name: 'styles',
                  test: /\.css$/,
                  chunks: 'all',
                  enforce: true,
                },
              },
            },
          },
          plugins: [
            new MiniCssExtractPlugin({
              filename: '[name].css',
            }),
          ],
          module: {
            rules: [
              {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
              },
            ],
          },
        };
     ```
     配置了 `cacheGroups`，只要是 css 文件（`test` 字段检测），无论是同步加载，还是异步加载（`chunk` 字段决定），都被打包到 styles （`name` 字段指定）这个目录下的同一个 css 文件中。`enforce` 的作用是：是否忽略其他的配置项。
3. 根据入口文件的不同打包输出不同的 css 文件
   - 如果有多个入口文件，每个入口文件引入了不同的 css 文件，想把 css 文件根据入口文件的不同打包到不同的文件中。
   - 这个需求可以通过配置 `cacheGroups` 完成。示例代码如下：
     ```javascript
        const path = require('path');
        const MiniCssExtractPlugin = require('mini-css-extract-plugin');
        
        function recursiveIssuer(m) {
          if (m.issuer) {
            return recursiveIssuer(m.issuer);
          } else if (m.name) {
            return m.name;
          } else {
            return false;
          }
        }
        
        module.exports = {
          entry: {
            foo: path.resolve(__dirname, 'src/foo'),
            bar: path.resolve(__dirname, 'src/bar'),
          },
          optimization: {
            splitChunks: {
              cacheGroups: {
                fooStyles: {
                  name: 'foo',
                  test: (m, c, entry = 'foo') =>
                    m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                  chunks: 'all',
                  enforce: true,
                },
                barStyles: {
                  name: 'bar',
                  test: (m, c, entry = 'bar') =>
                    m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                  chunks: 'all',
                  enforce: true,
                },
              },
            },
          },
          plugins: [
            new MiniCssExtractPlugin({
              filename: '[name].css',
            }),
          ],
          module: {
            rules: [
              {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
              },
            ],
          },
        };
     ```
     `entry` 配置了两个入口文件：`bar` 和 `foo`。指定 `test` 的值为函数，通过检测 `entry` 的值，来判断应用哪个 cache group。