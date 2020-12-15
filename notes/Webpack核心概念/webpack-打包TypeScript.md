<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Webpack 打包 TypeScript](#webpack-%E6%89%93%E5%8C%85-typescript)
  - [1. 基本概念](#1-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2. 基本配置](#2-%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)
  - [3. loader](#3-loader)
  - [4. 启用 source-map](#4-%E5%90%AF%E7%94%A8-source-map)
  - [5. 使用第三方库](#5-%E4%BD%BF%E7%94%A8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93)
  - [6. 导入其他资源](#6-%E5%AF%BC%E5%85%A5%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Webpack 打包 TypeScript

## 1. 基本概念

1. TypeScript 是带有类型限制的 JavaScript 超集，并且能编译为纯 JavaScript 代码。

2. 在 Webpack 中集成 TypeScript，需要借助 `ts-loader` 的帮助。

3. 参考文档：
   - v5 版本：[TypeScript-v5](https://webpack.js.org/guides/typescript/#basic-setup)
   - v4 版本：[TypeScript-v4](https://v4.webpack.js.org/guides/typescript/#loader)

## 2. 基本配置

1. 安装
   - 需要在项目中安装 `TypeScript` 和 `ts-loader`。安装命令如下：`npm install --save-dev typescript ts-loader`

2. 项目配置
   - 在项目的根目录下添加 `tsconfig.json`。
   
3. 配置 `tsconfig.json`
   - 配置 `tsconfig.json` 中的 `compilerOptions` 字段，内容如下：
     ```json
        {
           "compilerOptions": {
               "outDir": "./dist/",
               "noImplicitAny": true,
               "module": "es6",
               "target": "es5",
               "jsx": "react",
               "allowJs": true
             }
        }
     ```

4. 配置 `webpack.config.js`
   - 在 `rules` 字段中配置：
     ```javascript
        const path = require('path');
        
        module.exports = {
          entry: './src/index.ts',
          module: {
            rules: [
              {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
              },
            ],
          },
          resolve: {
            extensions: [ '.tsx', '.ts', '.js' ],
          },
          output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
          },
        };
     ```
   - 配置说明：  
     - 指定了入口文件为 src 目录下的 index.ts 文件  
     - 通过 `ts-loader` 加载所有的 `.tsx`、`.ts`、`.js` 文件。  
     - 输出文件为 bundle.js。
   - 新的字段
     - `resolve` 该字段用来配置 Webpack 如何寻找模块所对应的文件。Webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你也可以根据自己的需要修改默认的规则。参考资料：[webpack学习笔记--配置resolve](https://www.cnblogs.com/joyco773/p/9049760.html)
     - `resolve.extension` 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。  resolve.extensions 用于配置在尝试过程中用到的后缀列表。值为数组。默认是：`extensions: ['.js', '.json']`，例如：这样导入一个模块：`require(./data)`，webpack 首先去寻找 data.js，如果找不到，就去寻找 data.json。如果还是找不到就报错。  
       配置 `extension` 这个字段时，需要注意的是，不是所有后缀都能加到里面，因为每匹配一次，都会调用底层的文件模块去查找对应类型的文件，这样对打包的性能有损耗。所以，一般情况下我们只配置 js、jsx 等同 js 相关的文件。
     - `resolve.mainFiles` 当我们导入一个模块时，只指定了路径，没有指定具体的文件，那么 webpack 怎么知道我要导入的是哪个文件呢，答案就是根据 `mainFiles` 的值去查找。`mainFiles` 接收一个数组，数组的的值为文件名，例如：`mainFiles: ['index', 'child']`webpack 会按照 `mainFiles` 提供的文件名，依次去目标目录中去查找指定的 index.js 文件 或 child.js 文件。一般来说，我们不会使用这个配置项，因为对打包的性能有影响。
     - `resolve.alias` 通过别名来把原导入路径映射成一个新的导入路径，值为对象，例如：`alias: {dell: './src/child'}`，当你通过  `import Button from 'dell';` 导入时，实际上被 `alias` 等价替换成了  `import Button from './src/child`'
 
## 3. loader

1. 使用 `ts-loader` 完成对 ts 文件的加载。`ts-loader` 使用 tsc 编译，并且依赖于 `tsconfig.json` 中的配置项。

2. 如果使用的是 webpack 5.0 以上的版本，想要启用 `tree-shake`，则在 tsconfig.json 中，不要将`module`设置为 `CommonJS`。

3. 请注意，如果我们已经在使用 `babel-loader` 来传输代码，那么可以使用 `@babel/preset typescript`，让 babel 处理 JavaScript 和typescript 文件，而不是使用额外的 loader。请记住，与 `ts-loader` 相反，底层的`@babel/plugin-transform-typescript` 插件不执行任何类型检查。

## 4. 启用 source-map

1. 为了启用 source-map，我们首先配置 TypeScript 在编译为 JavaScript 后，能输出 `inline source map`。所所以，在 tsconfig.json 中，配置 `sourceMap` 字段，设置为 `true`：
   ```json
       {
          "compilerOptions": {
            "outDir": "./dist/",
            "sourceMap": true,
            "noImplicitAny": true,
            "module": "commonjs",
            "target": "es5",
            "jsx": "react",
            "allowJs": true
          }
        }
   ```
   
2. 接下来配置 webpack，使得能够导出最终的 source maps 到到打包的文件中，即配置 `devtool` 字段，设置其为 `inline-source-map`：
   ```javascript
      const path = require('path');
      
        module.exports = {
          entry: './src/index.ts',
          devtool: 'inline-source-map',
          module: {
            rules: [
              {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
              },
            ],
          },
          resolve: {
            extensions: [ '.tsx', '.ts', '.js' ],
          },
          output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
          },
        };
   ```
   
## 5. 使用第三方库

1. 在使用第三方库的过程中，要想充分发挥 TypeScript 的类型提示的功能，我们还要安装与第三方库相匹配的类型定义文件。

2. 寻找某个第三方库是否具有类型定义文件：[TypeSearch](https://www.typescriptlang.org/dt/search?search=)

## 6. 导入其他资源

1. 要在 TypeScript 中使用非代码类的资源，我们需要“延迟”（defer）这些导入的类型。也就是在项目中定义一个 `custom.d.ts` 文件，用于用户自定资源类型，例如，我们可以为 `.svg` 创建一个声明文件：
   ```typescript
      // custom.d.ts
      declare module "*.svg" {
        const content: any;
        export default content;
      }
   ```
2. 我们为 svg 文件声明一个新模块，该模块指定以 `.svg` 结尾的任何导入并将模块的内容定义为 `any`，我们可以通过将类型定义为 `string` 来更明确地表示它是一个 url。同样的概念也适用于其他资源，包括 `CSS`、`SCSS`、`JSON`等等。