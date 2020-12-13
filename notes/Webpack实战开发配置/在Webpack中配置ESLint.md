# 在 Webpack 中配置 ESLint

## 1. 基本概念

1. ESLint 用来进行代码质量检测。

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

1. 方式一 -- 直接使用
   - 使用 ESLint 的命令对项目内的代码进行检查：
     `npx eslint yourfile.js`
   - `yourfile.js` 可以是一个具体的 js 文件，也可以是一个路径。
   - 配置插件对项目内的 js 代码进行检查，而不是使用命令。
   - 还可以自定义 `rules` 设置具体的代码检测规则。
   
2. 方式二 -- 在 webpack 中配置
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
     配置了 `devServer` 中的 `overlay` 字段为 `true`，则我们执行打包命令后，启用 ESLint 对代码进行检测，然后将检查结果（error 和 warning）以浮层的形式显示在浏览器上，这样就可以根据结果去修改代码，使其符合规范的要求。
     
3. `eslint-loader` 的其他配置项
   - 参考文档地址：[eslint-loader](https://v4.webpack.js.org/loaders/eslint-loader/)