<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Webpack 配置 loader](#webpack-%E9%85%8D%E7%BD%AE-loader)
  - [1. 什么是 loader？](#1-%E4%BB%80%E4%B9%88%E6%98%AF-loader)
  - [2. file-loader](#2-file-loader)
  - [3. url-loader](#3-url-loader)
  - [4. 打包 css 文件](#4-%E6%89%93%E5%8C%85-css-%E6%96%87%E4%BB%B6)
  - [5. css 模块化](#5-css-%E6%A8%A1%E5%9D%97%E5%8C%96)
  - [6. Webpack 打包字体文件](#6-webpack-%E6%89%93%E5%8C%85%E5%AD%97%E4%BD%93%E6%96%87%E4%BB%B6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Webpack 配置 loader

## 1. 什么是 loader？

1. 在一般情况下，webpack 只识别 js 文件，只对 js 文件进行打包。对于图片、样式文件等非 js 文件就无能为力了。所以需要 loader 的帮忙。

2. loader 是用来帮助 webpack 打包非 js 文件的。要使用 loader，我们要去 webpack.config.js 中配置：
    ```javascript
       // 增加新的module属性，打包一个模块时应用的规则
       module: {
           // 规则。可以是多个
           rules: [
               {
                   // test属性用来说明是什么文件
                   // 属性值是一个正则表达式，检测是什么后缀（扩展名）
       // 这里是检测是否为jpg图片
                   test: /\.jpg$/,
                   // use属性用来指定使用什么样的loader
                   // 这个根据官方文档来配置（不同的loader写法不一样）
                   use: {
                       loader: 'file-loader'
                   }
               }
           ]
       }
    ```
3. 也就是说，webpack 遇到不识别的文件，就会根据 module 属性中配置的内容去打包对应类型的文件。

4. 字段基本说明：
   - `rules` 类型为数组，描述模块如何打包。每一个数组项被称为 Rule，用来配置不同类型的文件。
   - `Rule.test` 正则表达式，用来检测文件的类型
   - `Rule.use` 值为数组，这样可以配置多个 loader。数组的元素是对象，对象用来设置使用什么 loader，以及对 loader 的各种配置。当只有一个 loader 时，可以不使用数组，而使用一个对象。
   - `Rule.use.loader` 指定 loader
   - `Rule.use.force` 设置为 `pre`，表示优先使用这个 loader。默认情况下，loader 的使用顺序是从左向右，从后到前。那么如果我配置了一个 loader，例如 `eslint-loader`，它的位置在 `babel-loader` 之前，但是 `eslint-loader` 必须在 `babel-loader` 之前起作用，那么我就可以使用 `force` 这个字段，使得 `eslint-loader` 先于 `babel-loader` 执行。  
     **注意**：没有在 webpack 官网上找到这个字段。
   - `Rule.use.options` loader 的具体配置，这个配置和具体的 loader 有关，需要我们查询具体 loader 的文档。
   
## 2. file-loader

1. file-loader 用来对非 js 文件进行打包。根据 test 属性，使用正则表达式，检测文件的类型。从而进行打包处理。
2. file-loader 还可以进行一些配置，在 use 对象中设置 options 属性。如下所示：
   ```javascript
      use: {
          
          loader: 'file-loader',
          // options用来配置file-loader的一些其他内容
          options: {
              // name属性指定打包之后的文件名
              // [name]这种写法称为placeholder，占位符
              // [name]表示源文件的名称，[ext]表示源文件的扩展名
              name: '[name].[ext]',
              // 设置打包后的图片的存放目录
              outputPath: 'images/',
          }
      }
   ```
3. 配置项说明：
   - `name` 指定打包后的图片的名字，这里使用了 placeholder（占位符）。`[name]` 表示使用原文件名字，`[ext]` 表示使用原文件的后缀。
   - `outputpath` 指定图片文件的输出路径。这个文件夹是在 dist 目录下生成的。
4. File-loader 详细说明：[File-loader](https://v4.webpack.js.org/loaders/file-loader/#options)

## 3. url-loader

1. url-loader 的功能与 file-loader 类似。只不过 url-loader 打包图片文件后，生成的不是图片文件，而是 base64 编码，并放入了 bundle.js 中。
2. 使用 url-loader 进行打包，有一个问题是，如果图片文件比较大，那么打包后的 bundle.js 文件就会非常大，那么浏览器在加载并执行这个 js 脚本的时候，就会比较慢，影响网页性能和用户体验。所以，要使用 limit 属性对图片大小进行限制。
3. url-loader 对于小图片的打包具有优势，直接放入js脚本中，省去了一次 http 请求，提高了加载速度，减小服务器负担。
4. limit 属性用法如下：
    ```javascript
       use: {
           // 不会生成图片文件
           loader: 'url-loader',
           // options用来配置file-loader的一些其他内容
           options: {
               // name属性指定打包之后的文件名
               // [name]这种写法称为placeholder，占位符
               // [name]表示源文件的名称，[ext]表示源文件的扩展名
               name: '[name].[ext]',
               // 设置打包后的图片的存放目录
               outputPath: 'images/',
               // limit用来限制被打包的图片的大小，单位是字节
               // 小于等limit，使用url-loader打包成base64编码
               // 大于limit，url-loader将其打包为图片（类似于file-loader）
               limit: 4096
           }
       }
    ```

5. 配置项说明：
   - `limit` 用来限制被打包的图片的大小，单位是字节（）。  
   小于等于 limit，使用 url-loader 打包成 base64 编码。  
   大于 limit，url-loader 将其打包为图片（类似于file-loader）。
   
6. url-loader 说明：[url-loader](https://v4.webpack.js.org/loaders/url-loader/#getting-started)

## 4. 打包 css 文件

1. 打包 css 文件要使用两个 loader：style-loader、css-loader。

2. css-loader 的作用是分析css文件之间的相互依赖关系，最终经这些css内容合并到一起。

3. style-loader 的作用是将 css-loader 合并后的 css 内容挂载的 html 文件中的 header 部分。
4. 在rules属性中添加：
   ```javascript
      rules: [
           {
               // 检测css文件
               test: /\.css$/,
               // 使用style-loader和css-loader这两个loader对css文件进行打包
               // css-loader分析css文件之间的相互依赖关系，最终经这些css内容合并到一起
               // style-loader则是将css-loader合并后的css内容挂载的html文件中的header部分
               // loader加载顺序：从下到上，从右到左
               use: ['style-loader', 'css-loader']
           }
      ]
   ```
5. 对于一些css3的属性，使用时需要添加浏览器厂商前缀，如 `-webkit-`、`-moz-` 等。但是直接在 css 文件中添加，打包后解析可能会出现问题。因此使用 postcss-loader 来自动帮我们添加前缀。
   - 安装 `npm i -D postcss-loader`
使用
   - 配置
   
     - 新建 postcss.config.js内容如下：
       ```javascript
          module.exports = {
              plugins: [
                  // 引入自动添加前缀的插件，这个插件需要自己手动安装
                 // npm install autoprefixer --save-dev
                  require('autoprefixer')
              ]
          
          }
       ```
     - 使用
       ```javascript
          rules: [{
              // 检测css文件
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader',
                  'postcss-loader'
              ]
          }]
       ```

## 5. css 模块化

1. 有一些情况下，我们希望某个模块引入的css文件只对当前的模块中的元素起作用。所以需要css模块化。

2. 配置
   ```javascript
      module.exports = {
        module: {
          rules: [
            {
              test: /\.css$/i,
              // importLoaders这个属性的作用是：如果其他的css文件也使用import语法引入了其他css文件
              // 那么在使用css-loader处理前，还会经历一个loader的处理，也就是css-loader之前的postcss-loader
              // 保证所以的css文件都会被这三个loader处理
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    // 0 => no loaders (default);
                    // 1 => postcss-loader;
                    // 2 => postcss-loader, sass-loader
                    // modules属性为true，表示引入的css样式只作用域当前的模块，而不是作用于所有符合的元素
                    modules: true
                  },
                },
                'postcss-loader',
                'sass-loader',
              ],
            },
          ],
        },
      };
   ```
3. 配置项说明
   - `ImportLoaders` 在使用 css-loader 前，对于`@import` 引入的资源使用几个loader。确保css文件在使用css-loader处理前，经过几个loader处理。如果其他的css文件也使用import语法引入了其他css文件。那么在使用css-loader处理前，还会经历几个loader的处理，也就是css-loader之前的postcss-loader。保证所有的css文件都会被这三个loader处理。
   > The option importLoaders allows you to configure how many loaders before css-loader should be applied to @imported resources.
   - `modules` 设置为true，表示开启css模块化。使得引入的css样式只作用域当前的模块，而不是作用于所有符合的元素。
4. 配置 css-loader。因此不能单独写一个 css-loader，而是要在一个对象中进行配置。
5. 使用
   - 配置完成后，使用方式也要发生变化。引入方式不能是：`import  './index.css';`
   - 而是这样：`import style from './index.css';`
   - 然后给元素添加 class（或id）的时候，不能直接写，而是通过style导入：`img.classList.add(style.favImage);` 这样就可以保证引入的css样式只作用于当前模块。
   - 完整代码：
     ```javascript
        index.js
        import favImg from './09.jpg'
        import style from './index.css'
        
        import createImg from './create_img'
        
        createImg() ;
        
        var img = document.createElement('img') ;
        img.src = favImg ;
        img.classList.add(style.favImage) ;
        
        var divElement = document.querySelector('.root') ;
        divElement.appendChild(img) ;
     
     
        // create_img.js
        // 表示引入的css只作用于当前模块
        // 因此引入的方式也要改变，如下所示
        import style from './index.css' ;
        
     export default function createImg() {
        
        var img = document.createElement('img') ;
        
        img.src = favImg ;
        
        // 使用style.favImg添加class，这样可以保证css只作用于当前模块
        img.classList.add(style.favImage) ;
        
        var divElement = document.querySelector('.root') ;
        
        divElement.appendChild(img) ;
     }
     ```

## 6. Webpack 打包字体文件

1. 下载一个 icon font，解压以后，我们需要的是四个文件：`.eot`、`.svg`、`.ttf`、`.woff`。将这个四个文件放到项目中的一个文件夹中。如font。其中还有一个 iconfont.css 文件，内容如下：
   ```css
      @font-face {font-family: "iconfont";
        src: url('iconfont.eot?t=1606976648943'); /* IE9 */
        src: url('iconfont.eot?t=1606976648943#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAKUAAsAAAAABlgAAAJJAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcApcgQABNgIkAwgLBgAEIAWEbQc2G6wFyC6wbdiTAAtmw+gQrO8484ETiIf+96PdeW/WRNKejaIZsaQamkdIUDp1O6EQGmTP5L//axuiJe11PF7CLHk+2T/x3bDXSZFMozQiEUKjVzKZ4cEOmLOde4nScDfgcvrfAApkHki5zDFxDcDA0kD3wCiyIom8YewCl/CYQKdZDbmz6XoHVclaFYiXrq1DNReWkuXahdaagyk+a9FePpbwKfx+/LMT7RQtldVw6fHEgv5P2wX1ffPeTZ8QIaDjLajYBpK4Vpu+oCAYo6CTt2gRSBn7qWmwVezVJNhfZ1V3g2kovieJK73V6gIynh4HdkbtpnR3v/qwb3fb4Y+EWQFUHGEj1q3z/Dy3Bb7Qa0oLNGvfClAhFkI5/h04AmioXypyCHZ/5HWnb+9/e1eC7x8fwmBD6ucF7fv0BP9G0nModZllKalKar3F+KiVBZ060Qj7B/3G6kduJB/ajdyOt81MiqrdMpn0bbTosotW7Q7RacvseJchrCCyA5vuAKHfE0Wvr6j6vcmkf9Fi1B+t+qOi040YurDLajyrnzLpQhYaN3TNOFKOTepR7YbsU6BzVhYyD8SZG8Nuq1PMzSginmNLdrZ7IgoVxyFOwXMUBDEmHHtkSssRSbR2W9W9qWXGIdSdYkQniAUZbpDLFIsof7Kolz6/QWwnAR23tNX4DwjLuLOjrpZOD3Kmjnq13csrmTNbjxAKUlgshKZgHgkEYiipn+chJtHijEgmNG17nOqrbq2vDT+giHVhGUrYDVX3Qz26nlzSd9kA') format('woff2'),
        url('iconfont.woff?t=1606976648943') format('woff'),
        url('iconfont.ttf?t=1606976648943') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
        url('iconfont.svg?t=1606976648943#iconfont') format('svg'); /* iOS 4.1- */
      }
      
      .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .icon-danxuankuang:before {
        content: "\e61a";
      }
   ```

2. 然后修改我们某个组件引用的 css 样式文件，将上面的 iconfont.css 的文件的内容放到我们的 css 文件中。并要修改 `@font-face` 下的src 属性中的url，这个 url 实际上就是资源文件的路径，可以使用相对路径的形式：`./font/iconfont.eot?t=1606976648943`。四个 url 全部要修改。

3. 在我们的组件中，将某个标签的 class 设置为 `iconfont` 和 `icon-danxuankuang`。例如：`<div class="iconfont icon-danxuankuang"></div>`。

4. 仅仅这样还不够，webpack 不认识`.eot`、`.svg`、`.ttf`、`.woff` 这样的文件，也不知道如何去处理，所以我们要使用 file-loader 进行打包，配置如下：
   ```javascript
      module.exports = {
          module: {
              rules: [
                  {
                      test: /\.(eot|svg|ttf|woff)$/i,
                      use: 'file-loader'
                  }
              ]
          }
      
      }
   ```

5. 这样就可以打包 svg、ttf 这样的文件。实际上，对于这类文件的打包，就是将 svg、ttf 等文件打包到输出文件夹内，同时获得这个资源的引用路径。

6. 经过上面的一系列操作，我们就能在页面中引入这个字体图标了。
