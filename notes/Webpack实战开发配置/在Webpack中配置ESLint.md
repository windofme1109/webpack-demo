<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [在 Webpack 中配置 ESLint](#%E5%9C%A8-webpack-%E4%B8%AD%E9%85%8D%E7%BD%AE-eslint)
  - [1. 基本概念](#1-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2. 安装与初始化](#2-%E5%AE%89%E8%A3%85%E4%B8%8E%E5%88%9D%E5%A7%8B%E5%8C%96)
  - [3. 使用](#3-%E4%BD%BF%E7%94%A8)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 在 Webpack 中配置 ESLint

## 1. 基本概念

1. ESLint 用来对 js 代码进行质量检测。

2. ESLint 提供编码规范。

3. 提供自动检验代码的程序，并打印检验结果：告诉你哪一个文件哪一行代码不符合哪一条编码规范，方便你去修改代码。

4. 参考资料
   - 官方网站：[ESLint](http://eslint.org/)
   - [Eslint 超简单入门教程](https://www.jianshu.com/p/ad1e46faaea2)
   - [ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)

## 2. 安装与初始化

1. 安装
   - `npm install eslint --save-dev`
   
2. 初始化配置文件
   - `npx eslint --init`
   - 执行完这条命令以后，在命令行中会提供一系列的配置让我们去选择，我们根据项目需要去选择即可。

3. 最后在项目的根目录中，会生成一个 `eslintrc.js` 的配置文件。

4. 由于项目中使用了 React，为了使得 ESLint 对 React 的解析更好，我们要更换 ESLint 的 parser，使用新的 parser：`@babel/eslint-parser`。
   - 安装 `@babel/eslint-parser`
     - `npm install @babel/eslint-parser --save-dev`
     - 注意，`@babel/eslint-parser` 要和 `@babel/core` 一起使用，所以要确保已经安装了 `@babel/core`。
     - 在 `eslintrc.js` 中进行配置：
       ```javascript
          // eslintrc.js
          module.exports = {
              parser: '@babel/eslint-parser',
          }
       ```
       
## 3. 使用

1. 方式 1 -- 直接使用
   - 使用 ESLint 的命令对项目内的代码进行检查：
     `npx eslint yourfile.js`
   - `yourfile.js` 可以是一个具体的 js 文件，也可以是一个路径。
   - 配置插件对项目内的 js 代码进行检查，而不是使用命令。
   - 还可以自定义 `rules` 设置具体的代码检测规则。
   
2. 方式 2 -- 在 webpack 中配置
   
   - **注意**：`eslint-loader` 在 4.0.2 (2020-04-24) 版本后，被弃用了，也就是现在 webpack 使用的是 `eslint-webpack-plugin` 这个插件来实现 `eslint-loader` 的功能。新的插件解决了 `eslint-loader` 的一些问题，功能更加强大，配置起来更加简便，推荐使用 `eslint-webpack-plugin` 插件实现 webpack 与 ESLint 的集成。
   - `eslint-webpack-plugin` 的文档说明（github 仓库）：[eslint-webpack-plugin](https://github.com/webpack-contrib/eslint-webpack-plugin)
   - `eslint-webpack-plugin` 配置（webpack 官网）[EslintWebpackPlugin](https://webpack.js.org/plugins/eslint-webpack-plugin/#about-plugin)
   - 以下的内容就不推荐看了。
   - 安装 `loader`：`eslint-loader`  
     `npm install exlint-loader --save-dev`
   
   - 在 webpack 中配置
     ```javascript
        // webpack.dev.js
        module.exports = {
         devServer: {
                overlay: true
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        // 加载loader
                        use: [
                                 {
                                     loader: 'babel-loader',
                                 },
                                 {
                                     loader: 'eslint-loader',
                                 }
                             ]
                    } 
                ]
            }
        }
     ```
     由于我们主要是对 js 代码进行检测，所以我们需要在 js 的规则下配置 `loader`，要将 `eslint-loader` 放在 `babel-loader` 后面，也就是先进行 ESLint 的检测，后进行代码的转换。  
     配置了 `devServer` 中的 `overlay` 字段为 `true`，则我们执行打包命令后，启用 ESLint 对代码进行检测，然后将检查结果（error 和 warning）以浮层的形式显示在浏览器上，这样就可以根据结果去修改代码，使其符合规范的要求。还可以配置显示 error 还是 warning，如下所示：
     - `errors` 默认为 `false`，设置为 `true` 表示只显示编译错误。
     - `warnings` 默认为 `false`，设置为 `true` 表示只显示编译警告。
     > Shows a full-screen overlay in the browser when there are compiler errors or warnings.
     
3. `eslint-loader` 的其他配置项
   - 参考文档地址：[eslint-loader](https://v4.webpack.js.org/loaders/eslint-loader/)
   - 示例：
     ```javascript
        module.exports = {
            devServer: {
                overlay: true
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        // 加载loader
                        use: [
                             {
                                 loader: 'babel-loader',
                             },
                             {
                                 loader: 'eslint-loader',
                                 options: {
                                     fix: true,
                                     cache: true 
                                 }
                             }
                        ]
                    } 
                ]
            }
        }
     ```
   
   - `fix` 布尔值，默认为 `false`，是否启用 ESLint 的自动修复功能。就是说，设置为 true，就会根据 ESLint 的检测结果，自动修复代码。**注意**：这个操作会改变源代码。
   - `cache` 布尔值，默认为 `false`。是否启用缓存。如果设置为 true，则将检测结果缓存到一个一个文件中，在我们进行完整的项目构建的时候，配置 `cache` 可以减少检测时间。  
      还可以设置其为字符串，值为缓存文件的路径，例如`'./.eslint-loader-cache'`，默认路径为：`./node_modules/.cache`，推荐使用默认路径。

4. 在项目中，一般不会在 webpack 中配置 `eslint-loader`，因为会降低打包效率，想要使用 ESLint，使用 git 提供的钩子，在代码提交前，使用 `eslint` 命令检测，检测不通过，不允许提交。