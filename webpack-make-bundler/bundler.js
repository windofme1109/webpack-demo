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
 * 遍历 AST，找到我们需要的节点
 */


const fs = require('fs');

const path = require('path');

const parser = require('@babel/parser');

const traverse = require('@babel/traverse').default;

const babel = require('@babel/core');

/**
 *
 * @param filename
 * @returns {{filename: *, code: *, dependencies: {}}}
 */
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
             // 引入模块时，使用的是相对路径，相对的是当前引用这个模块的文件的路径
             // 为了避免打包过程出现问题，我们这里使用绝对路径（或者是相对于 bundler.js 的路径）
             // console.log(dirname);
             const newFile = path.join(dirname, node.source.value) ;
             // 以相对路径作为 key，绝对路径作为 value
             dependencies[node.source.value] = newFile;
         }
     })

    // console.log(dependencies);
    /**
     * transformFromAstSync() 给定一个抽象语法树，将其转换为浏览器能识别的代码
     * transformFromAstSync() 第一个参数是 ast，第二个参数是源码，第三个参数是配置项
     * 第二个、第三个参数都是可选的
     * 函数返回值是对象，包含转换后的一些内容
     * 其中 code 属性包含的就是我们需要的代码
     */
    const { code, map, newAst } = babel.transformFromAst(ast, null, {
        // 因为转换的是 ES6 的代码，所以需要使用 @babel/preset-env 这个插件添加额外的特性，保证转换后的代码能在浏览器运行
        presets: ['@babel/preset-env']
    });

    // console.log(code);
    return {
        filename,
        dependencies,
        code
    }
}

/**
 * 分析模块之间的相互依赖关系，并将其存放到一起
 * @param entry 模块的入口
 */
const makeDependeciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry);

    // 存放每个模块的依赖信息
    const graphArray = [entryModule];

    /**
     * 使用队列实现了一个递归的功能
     * for 遍历一个数组期间，可以动态改变数组的长度
     * 依然能遍历这个改变后的数组
     */
    for (let i = 0; i < graphArray.length; i++) {
        let item = graphArray[i];

        // 取出依赖信息
        let {dependencies} = item;

        if (dependencies) {
            // dependencies 是一个对象，使用 for in 对其进行遍历
            for (let key in dependencies) {

                // 拿到依赖的模块的绝对路径，然后使用 moduleAnalyser() 分析出这个路径指定的模块的依赖关系
                //
                let moduleInfo = moduleAnalyser(dependencies[key]);
                // 将最新得到的依赖关系放入 graphArray 中，这样 graphArray 的长度就会加 1
                // 那么在下次遍历的时候，依然能获取到最新的元素，从而分析其依赖关系
                graphArray.push(moduleInfo);
            }
        }
    }

    // 将数组形式的依赖信息转换为对象
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            // 只存模块的依赖信息和code
            dependencies: item.dependencies,
            code: item.code
        }
    });

    return graph;
}

/**
 * 将每个模块的转换后的代码拼接起来，生成一段可执行的 js 代码
 * @param entry 入口文件
 * @returns {string} 字符串形式的 js 代码
 */
const generatedCode = (entry) => {

    // 由于我们最终返回的使用一段字符串形式的可执行的 js 代码，所以我们需要将对象形式的依赖图谱转换为字符串
    const graph = JSON.stringify(makeDependeciesGraph(entry));

    // 为了避免我们的代码污染其他作用域，我们在生成的代码中使用闭包（立即执行匿名函数）来限定作用域
    return `
        (function(graph) {
          // 经过 babel 转换后的 js 代码，里面有一个 require() 函数，用来加载模块
          // 还有一个 exports 对象，用来挂载变量
          // 浏览器环境下，没有这两个内容，因此我们需要手动实现 require() 函数和 exports 变量
          
          // require() 函数接收一个模块作为参数
          function require(module) {
            
            function localRequire(relativePath) {
              return require(graph[module].dependencies[relativePath]);
            }
            
            
            
            
            // 为什么要定义一个 localRequire() 函数呢
            // 这个函数的目的是将相对路径转换为绝对路径
            
            // 我们看一下 index.js 转换后的源码
            // 有这样一句：require("./message.js")
            // 由于是在闭包中执行，require() 指向的是形参 require，而源码中，require() 接收的是：./message.js
            // 这是一个相对路径，我们知道，在 graph 对象中，我们是以模块的绝对路径为 key 的，想要拿到 message.js 的依赖和源码
            // 就必须获得 message.js 的绝对路径，而 dependencies 字段中，恰好是相对路径为 key，绝对路径为 value
            // 这样就根据相对路径 ./message.js，拿到绝对路径 src/message.js
            // 前面说过，源码中的 require() 指向的是形参 require，而实际上，我们传入的实参是 localRequire，这样就将 ./message.js 传入 localRequire() 中
            // 从而拿到了 绝对路径
            // 因此，这是一个递归调用
            // 递归的出口就是 源码内部不再引用 require()
            /**
            * './src/index.js': {
            * dependencies: { './message.js': 'src\\\\message.js' },
            *  code: 
            *    "use strict";
            *   
            *    var _message = _interopRequireDefault(require("./message.js"));
            *    
            *    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
            *    
            *    console.log(_message["default"]);
            * },
            */
            // 定义一个全局的 exports，是因为源码中需要这个对象来存储一些东西
            // 
            var exports = {};
            
            // 这里在定义一个闭包
            // 这个闭包的目的就是执行每个模块的 js 代码
            (function(require, exports, code) {
                eval(code);
            
            })(localRequire, exports, graph[module].code);
            
            // 由于不同的模块的源代码都需要这个 exports，即指向同一个 exports
            // 所以在 require() 函数的最后，我们需要将其返回，相当于在整个递归的过程中
            // 一次又一次往 exports 里面添加东西
            return exports;
          };
          
          // 这里调用这个 require() 函数，并传入 entry，即入口文件
          // 注意，因为我们这里是生成 js 代码，而不是执行，所以要将 entry 转换字符串形式，即加上单引号
          // 如果不加，就会成这样：require(./src/index.js)，显然不是字符串形式的路径，所以这里必须加上单引号
          require('${entry}');
        })(${graph});
    `;
}

const code = makeDependeciesGraph('./src/index.js');
// moduleAnalyser('./src/index.js');
console.log(code);
// console.log(makeDependeciesGraph('./src/index.js'));