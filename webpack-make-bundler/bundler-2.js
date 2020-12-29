/**
 *
 * 自己实现对模块的打包
 *
 */

const fs = require('fs');

const path = require('path');

const parser = require('@babel/parser');

const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
/**
 *
 * @param module
 * @returns {{code: *, module: *, dependence: {}}}
 */
const moduleAnalyzer = (module) => {
    // 读取文件内容， 获取源码
    const sourceCode = fs.readFileSync(module, 'utf-8');
    // 将源码转换为 ast
    const ast = parser.parse(sourceCode, {
        sourceType: 'module'
    });

    // 存放模块的依赖关系
    let dependence = {};

    // 遍历 ast，从中拿到导入信息
    traverse(ast, {
        // ImportDeclaration: function() {
        //
        // }

        // ES6 新语法，在对象中通过下面的方式给一个属性赋值为函数，等同于上面的形式
        ImportDeclaration({node}) {
            // 获取导入的模块的相对路径
            const relativePath = node.source.value;
            // 获取当前模块的所在的目录（directory）
            const filePath = path.dirname(module);
            // 获得导入的模块的绝对路径
            const importModuleAbsolutePath = path.join(filePath, relativePath);

            dependence[relativePath] = importModuleAbsolutePath;
        }
    });

    // 将 ES6 转换为 ES5 代码
    // transform() 用于对代码的转换，返回值是对象，包含 code，map，ast 三个属性
    // 其中 code 就是我们需要的源代码
    const {code} = babel.transform(sourceCode, {
        // 转换过程中的一些配置项
        // @babel/preset-env 是预置插件，辅助我们进行代码转换
        // 根据我们指定的目标环境，来决定将哪些 js 新特性打包进我们生成的代码中
        presets: [
            '@babel/preset-env'
        ]
    });

    return {
        module,
        code,
        dependence
    }
}

/**
 *
 * @param entry
 */
const makeDependenceGraph = (entry) => {
    // 获取入口文件的依赖关系
    const moduleAnalyze = moduleAnalyzer(entry);
    // 生成依赖关系的数组
    let moduleDependence = [moduleAnalyze];

    for (let i = 0; i < moduleDependence.length; i++) {

        // 取出依赖关系
        let {dependence} = moduleDependence[i];
        for (let key in dependence) {
            // key 为相对路径，根据 key，从 dependence 中拿到绝对路径
            const modulePath = dependence[key];
            if (modulePath) {
                // 获取新的模块依赖关系，然后添加到 moduleDependence
                // for 循环就会遍历最新的数组，间接实现了递归的效果
                moduleDependence.push(moduleAnalyzer(modulePath));
            }
        }
    }
    let dependenceGraph = {};
    // 对 moduleDependence 进行改造，以相对路径为 key，值为 code 和 dependence 组成的对象
    // 这样可以
    moduleDependence.forEach(item => {
        dependenceGraph[item.module] = {
            code: item.code,
            dependence: item.dependence
        }
    })

    return dependenceGraph;
}

/**
 *
 * @param entry
 */
const generateCode = (entry) => {
    const dependenceGraph = JSON.stringify(makeDependenceGraph(entry));

    return `(function(dependenceGraph) {
        function require(module) {
        
            function localRequire(relativePath) {
                return require(dependenceGraph[module].dependence[relativePath])
            }
            
            var exports = {};
            
            // 定义立即执行匿名函数，将每个模块的代码封闭在匿名函数的这个作用域内，不会污染其他变量和作用域
            (function(require, exports, code) {
                eval(code);
            })(localRequire, exports, dependenceGraph[module].code)
            
            
            return exports;
        }
        require('${entry}')
    })(${dependenceGraph})`
}
// makeDependenceGraph('./src/index.js');

console.log(generateCode('./src/index.js'));