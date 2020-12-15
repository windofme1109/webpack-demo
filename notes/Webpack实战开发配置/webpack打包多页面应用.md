# webpack 打包多页面应用

## 1. 背景

1. 之前我们都是打包单页面应用，只有一个 index.html，只有一个入口 js 文件，而且 index.html 引入了这个入口文件。

2. 现在是打包多页面应用，即有多个 html 文件，每个 html 都引入一个 js 文件，那么这样的多页应用怎么打包呢？答案是配置 `entry` 字段和使用 `html-webpack-plugin` 插件。

## 2. 基本配置

1. 有两个 html 页面：index.html 和 list.html。每个页面都会引入一个 js 文件，用于渲染内容，内容如下：
   - `index.js`
     ```javascript
        import React, {Component} from 'react';
        import ReactDOM from 'react-dom';
        class App extends Component {
        
             render() {
        
                 return (
        
                     <div>
                         <h1>This is HomePage</h1>
                     </div>
                 )
             }
        }
        
        ReactDOM.render(<App />, document.querySelector('.root'));
     ```
   - `list.js`
     ```javascript
        import React, {Component} from 'react';
        import ReactDOM from 'react-dom';
        class List extends Component {
                
              render() {
                
                    return (
                
                         <div>
                                 <h1>This is ListPage</h1>
                         </div>
                    )
              }
        }
                
        ReactDOM.render(<List />, document.querySelector('.root'));
     ```

2. 在 webpack.common.js 中配置 `entry` 字段：
   ```javascript
      module.exports = {
          entry: {
              main: './src/index.js',
              list: './src/list.js'
          }
      }
   ```
   这样会分别对 `index.js` 和 `list.js` 进行打包。但是这样，会将 `main.js` 和 `list.js` 都引入 index.html 中，还是没有实现前面的打包多页应用的目标。
   
3. 配置 `html-webpack-plugin`
   - 这个 `html-webpack-plugin` 用于生成 html 模板，因此，我们可以通过配置这个插件，来生成多个 html 模板。
   - 我们生成几个 html 页面，就配置几个 `html-webpack-plugin` 插件。配置如下：
     ```javascript
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        module.exports = {
            plugins: [
                new HtmlWebpackPlugin({
                    // 添加模板html
                    // 指定HtmlWebpackPlugin插件使用的模板是src目录下的index.html
                    template: 'src/index.html',
                    filename: 'index.html',
                    chunk: ['runtime', 'vendor', 'main']
                    
                }),
                new HtmlWebpackPlugin({
                    template: 'src/index.html',
                    filename: 'list.html',
                    chunks: ['runtime', 'vendor', 'list']
                }),
            ]
        }
     ```
   - `html-webpack-plugin` 配置项说明：
      - `template` 指定的模板文件的路径，绝对路径或者是相对路径。根据这个 html 模板生成指定的 html 文件。
      - `filename` 要生成的 html 文件名
      - `chunks` 指定哪些打包后的 js 文件被引入到当前的 html 文件中。我们只写文件名即可，文件名后面的 hash 值不用写。
   - `html-webpack-plugin` 参考文档（github）：[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
   
## 3. 批量生成 `html-webpack-plugin` 配置

1. 如果我们现在新增一个页面，那么就得手动配置 `entry` 和 `html-webpack-plugin`，这样比较麻烦，我们可以写一个函数，实现自动化配置。
   ```javascript
      // webpack.common.js
      const fs = require('fs');
      const path = require('path');
      
      const entry = {
          main: './src/index.js',
          list: './src/list.js'
      }
   
      const makePlugins = (entry) => {
           let plugins = [];
           
           // 从 entry 中获得 key，这个 key 就是打包生成的 js 文件
           // 生成的 html 也和这个 key 有关
           Object.keys(entry).forEach(key => {
               plugins.push(new new HtmlWebpackPlugin({
                    template: 'src/index.html',
                    filename: `${key}.html`,
                    chunks: ['runtime', 'vendor', key]
               }))
           });
   
           plugins.push(new AddAssetHtmlPlugin([
               {filepath: path.resolve(__dirname, './dll/vendor.dll.js')},
               {filepath: path.resolve(__dirname, './dll/react.dll.js')},
           ]));
           
           const files = fs.readdirSync(path.resolve(__dirname, './dll'));
           files.forEach(file => {
               if (/.*\.manifest.json/.test(file)) {
                   plugins.push(
                       new webpack.DllReferencePlugin({
                           manifest: path.resolve(__dirname, './dll', file)
                       }) 
                   )
               }
           })
   
           return plugins;
      }
   
      module.exports = {
          entry,
          plugins: makePlugins(entry),
          // 其他配置
      }
   ```
   以后我们在新增 html 页面，只需要配置入口文件即可。

## 4. 总结

1. 打包多页应用，本质上还是配置多个入口文件，然后使用多个 `html-webpack-plugin` 插件，并进行配置，生成多个 html 文件。

2. 主要配置 `html-webpack-plugin` 的 `template`、`filename`、`chunks` 这三个字段。   