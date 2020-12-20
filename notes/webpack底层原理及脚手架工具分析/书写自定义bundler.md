# 自定义 bundler

## 1. 分析依赖

1. 模块打包器的一个作用就是从入口文件开始，分析出每个模块与其他模块的一个依赖关系，得到依赖关系以后，再进行代码的编译。

2. 在 src 目录下，新建 `index.js`、`message.js` 和 `word.js` 这三个文件，内容如下：
   - `index.js`
     ```javascript
        import message from './message.js';
        console.log(message);
     ```
   - `message.js`
      ```javascript
         import {word} from './word.js';
         
         const message = `say ${word}`;
         
         export default message;
      ```
   - `word.js`
     ```javascript
        export const word = 'word';
     ```
3. `index.js` 引入了 `message.js`， `message.js` 引入了 `word.js`，简便起见，我们给每个导入的模块加了后缀。

4. 新建一个 `bundler.js`，这个 js 文件就是用来打包的。我们要在这个文件中完成三件事：
   - 分析依赖
   - 生成依赖图谱
   - 编译为浏览器可执行的代码

5. 首先进行的分析依赖。在 `bundler.js` 中，新建一个函数：`moduleAnalyser()`，内容如下：
   ```javascript
      const fs = require('fs');
      const path = require('path');
      const parser = require('@babel/parser');
   
      const traverse = require('@babel/traverse').default;
      // import traverse from '@babel/traverse';
   
      const babel = require('@babel/core');
   
      const moduleAnalyser = (filename) => {
         const content = fs.readFileSync(filename, 'utf-8');
   
         const ast = parser.parse(content, {
             sourceType: 'module',
         });
         const dependencies = {};
         traverse(ast, {
             ImportDeclaration({node}) {
                 const dirname = path.dirname(filename);
                 
                 const newFile = path.join(dirname, node.source.value);
   
                 dependencies[node.source.value] = newFile;
             }
         });
   
         const {code} = babel.transformFromAst(ast, null, {
             presets: ['@babel/preset-env']
         });
   
         return {
              filename,
              dependencies,
              code
         }
         
      }
   ```

6. 代码解读



## 2. 生成依赖图谱 （dependencies graph）

## 3. 编译为浏览器可执行的代码

## 4. 总结