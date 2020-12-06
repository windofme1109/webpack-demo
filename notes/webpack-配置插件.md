# Webpack 配置插件

## 1. 基本概念

1. 插件就是用来扩展Webpack功能的一些第三方模块。在Webpack运行到某个时刻，插件帮助我们做一些事。

2. 插件的使用方法可以参考插件的文档。

## 2. 插件介绍

1. HtmlWebpackPlugin
   - 这个插件会在打包结束后，自动生成一个html文件，并且把打包生成的js文件自动引入到html文件中。
   - 安装  
     `npm install html-webpack-plugin --save-dev`
   - 使用   
     在webpack.config.js文件中，添加下面的代码：
     ```javascript
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const path = require('path');
        module.exports = {
          entry: 'index.js',
          output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'index_bundle.js'
          },
          plugins: [new HtmlWebpackPlugin()]
        };
     ```
   - 配置  
     我们可以给构造函数 HtmlWebpackPlugin() 传入一些配置项：如指定我们可以指定 html 模板：  
     `new HtmlWebpackPlugin({
	    template: “./src/index.html”
     })`  
template 属性指定一个 html 模板，值为模板的绝对或者相对路径，HtmlWebpackPlugin 插件会根据这个模板，在输出目录下生成一个 index.html，同时将打包后的 js 文件注入到这个 html 文件中。

2. CleanWebpackPlugin
   - 这个插件可以帮助我们在打包之前，删除存放打包文件的文件夹。为什么要删除呢，比如在配置文件中更改了打包后的js文件名，原来叫 bundle.js，现在叫 aaa.js。运行打包命令后，会生成新的 aaa.js 文件，而原来的 bundle.js 文件依旧存在于 dist 目录下。但是我们只会引用 aaa.js，而 bundle.js 没有用途，但是还占据空间，因此我们希望在执行打包命令前，删除 dist 文件夹。CleanWebpackPlugin 就是实现这个功能的。
   - 安装  
     `npm install clean-webpack-plugin --save-dev`
   - 使用  
     在 webpack.config.js 中加入下列代码：
     ```javascript
        var {CleanWebpackPlugin} = require('clean-webpack-plugin') ;
        
        module.exports = {
            // 添加插件
            plugins: [
                new HtmlWebpackPlugin({
                    // 添加模板html
                    // 指定HtmlWebpackPlugin插件使用的模板是src目录下的index.html
                    template: 'src/index.html'
                }),
                new CleanWebpackPlugin()
            ]
            
        }
     ```

     CleanWebpackPlugin() 在不传入任何配置项的情况下，我们在output 配置的path 路径下的所有文件都会被删除，而目录本身不会被删除。如果使用webpack 4.0 以上的版本，在项目根目录下的dist文件夹内的文件会被移除。  
     官方说明：
     ```javascript
        /**
         * All files inside webpack's output.path directory will be removed once, but the
         * directory itself will not be. If using webpack 4+'s default configuration,
         * everything under <PROJECT_DIR>/dist/ will be removed.
         * Use cleanOnceBeforeBuildPatterns to override this behavior.
         *
         * During rebuilds, all webpack assets that are not used anymore
        * will be removed automatically.
        */
     ```
     这样，就可以在执行打包命令后，优先删除 dist 文件夹，然后在重新生成里面的东西。