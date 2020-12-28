/**
 *
 * 自己实现对模块的打包
 *
 */

const fs = require('fs');

const parser = require('@babel/parser');

const traverse = require('@babel/traverse').default;

const moduleAnalyzer = (module) => {
    // 读取文件内容， 获取源码
    const sourceCode = fs.readFileSync(module, 'utf-8');
    // 将源码转换为 ast
    const ast = parser.parse(sourceCode, {
        sourceType: 'module'
    });
    console.log(ast);
    // 遍历 ast，从中拿到导入信息
    traverse(ast, {

    });
}


const makeDependeciesGraph = (entry) => {}

const generateCode = (entry) => {}

moduleAnalyzer('./src/index.js');