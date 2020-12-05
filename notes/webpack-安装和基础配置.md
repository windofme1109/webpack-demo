<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Webpack 安装和基本配置](#webpack-%E5%AE%89%E8%A3%85%E5%92%8C%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)
  - [1. Webpack 是什么](#1-webpack-%E6%98%AF%E4%BB%80%E4%B9%88)
  - [2. Webpack 安装](#2-webpack-%E5%AE%89%E8%A3%85)
  - [3. Webpack 配置文件](#3-webpack-%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Webpack 安装和基本配置

## 1. Webpack 是什么

1. Webpack 是一款模块打包工具。所谓打包，将相互依赖的前端模块组织起来，理顺依赖关系，并将这种依赖关系编译为浏览器能识别的内容（现代浏览器不支持模块）。JavaScript 文件、CSS 文件、png 格式的图片等都可以使用Webpack进行打包。
2. 对于前端模块化编程而言，存在着 CommonJS、AMD、ES6 等不同的规范，而 Webpack 均可以进行打包。

## 2. Webpack 安装

1. 全局安装 
   - 安装命令 `npm install webpack webpack-cli -g`  
   但是不推荐全局安装 webpack 和 webpack-cli。因为全局安装，所有项目依赖的都是同一个 webpack 版本。但是有时候我们项目依赖的是其他版本，这样在全局安装的情况下，我们的项目根本无法运行。所以不推荐全局安装 webpack。
2. 局部安装
   - 安装命令 `npm install webpack webpack-cli --save-dev`  
   这样就将 webpack 安装到我们的项目中了。  
   注意：此时我们不能直接使用 webpack 命令。因为并没有全局安装。此时要使用 npx 命令。例如，查看 webpack 版本：
`npx webpack -v`  
   输出：`4.37.0`  
   npx 命令可以调用项目内部安装的模块。同时避免全局安装模块。
## 3. Webpack 配置文件

1. Webpack 的配置文件的名称为：`webpack.config.js`。配置信息如下：
     ```javascript
        const path = require('path') ;
        
        module.exports = {
            // 入口文件，告诉webpack，从哪个文件开始打包
            entry: './src/index.js',
            // 打包完成后的文件的配置
            output: {
                // 打包完成后的文件名
                filename: 'bundle.js',
                // 存放路径，必须是绝对路径
                // 使用join()方法，拼接处一个绝对路径
                path: path.join(__dirname, 'dist'),
            }
        }
     ```
2. 在 package.json 中的 script 属性中添加 `"bundle": "webpack"` 这一句，如下所示：
     ```json
        "scripts": {
          "bundle": "webpack"
        }
     ```
   - 目的是使用 `npm run bundle` 命令代替 `npx webpack` 命令。首先去项目找 `webpack` 这个命令，如果找到了，就执行，找不到，就去全局环境下找。执行机制类似于 `npx`。
   - 新命令：`npm run bundle`
   - 旧命令：`npx webpack`
   
3. webpack-cli 的作用  
   - 这个包的作用是能够让我们正确使用 webpack 命令。
   
4. 在配置文件中添加mode属性
   - mode 属性表示打包的环境，默认是 production（生产环境），此时打包后的文件会被压缩。还可以设置成 development（开发环境），此时打包后的文件不会被压缩。
   - 设置了 mode 属性后，执行 `npx webpack` 命令后，就不会出现警告了。
   
5. 完整的配置如下所示：
   ```javascript
      // webpack.config.js
      const path = require('path') ;
      
      module.exports = {
          mode: 'development',
          entry: './src/index.js',
          output: {
             filename: 'bundle.js',
             path: path.join(__dirname, 'dist'),
          }
      }
   ```


