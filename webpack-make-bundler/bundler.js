/**
 *
 * 自定义一个模块打包库
 * 安装一个语法高亮工具：cli-highlight
 * 这个工具可以将输出在命令行中的代码高亮显示
 * npm install cli-highlight -g
 * 使用：在命名后面加上：|highlight
 *
 * 安装 babel 插件：@babel/parser
 * 解析 JavaScript 代码，生成 抽象语法树（AST）
 *
 * 安装 babel 插件 @babel/traverse
 * 遍历 AST
 */


const fs = require('fs');

const path = require('path');

const parser = require('@babel/parser');

const traverse = require('@babel/traverse').default;

const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
     const content = fs.readFileSync(filename, 'utf-8');
     const ast = parser.parse(content, {
         sourceType: 'module'
     });

     // 存放导入的模块的路径
     const dependencies = {};
     // 遍历抽象语法树
     traverse(ast, {
         // 取出我们需要的节点
         // 我们需要取出 ImportDeclaration 这个节点
         // 将其写为一个函数，从传入的函数的参数中拿到 node 这个属性
         // 就是我们需要的内容
         ImportDeclaration({node}) {

             const dirname = path.dirname(filename);
             // 引入模块时，使用的是相对路径，为了避免打包过程出现问题
             // 我们这里使用绝对路径
             const newFile = path.join(dirname, node.source.value) ;
             // 以相对路径作为 key，绝对路径作为 value
             dependencies[node.source.value] = newFile;
         }
     })

    // console.log(dependencies);

    return {
         filename,
         dependencies
    }
}

moduleAnalyser('./src/index.js');