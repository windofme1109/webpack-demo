const loaderUtils = require('loader-utils');


// 注意，loader 不能使用 箭头函数，因为箭头函数没有 this 指向
// 而 loader 需要 this 做一些事，webpack 会改变函数的 this 指向，调用挂载到 this 上的一些方法
/**
 * loader 接收入口文件的源代码，然后我们对源代码进行一些操作，最后返回操作后的源代码
 * @param source 入口文件的源代码
 */
module.exports = function(source) {


    // 如果在 loader 配置了 options，我们需要拿到这个 options
    // 原生方式是通过 this.query 拿到，即 options 指向了 this.query
    // options 的配置是：{ name: 'china' }
    // this.query 的输出是：{ name: 'china' }
    // console.log(this.query);
    // webpack 推荐使用 loader-utils 中的 getOptions() 方法拿到
    // const options = loaderUtils.getOptions(this);
    // console.log(options);

    const result = source.replace('qinney', 'china');

    // 异步操作
    // this.async() 是一个函数，返回的结果是 this.callback()
    //调用这个函数，表示我们的 loader 中有异步操作
    // 我们在异步操作中 调用 this.async() 的返回值——this.callback()
    // 则 webpack 会等到异步操作结束，再继续进行打包
    // const callback = this.async();
    // setTimeout(() => {
    //     // return source.replace('world', 'qinney');
    //     callback(null, result);
    // }, 5000);
    // this.callback() 可以接收四个参数
    // 第一个必须是 Error 对象 或者是 null
    // 第二个是字符串或者为 buffer
    // 第三个参数可选，如果传递，则必须是 sourceMap
    // 第四个参数，会被 webpack 忽略，可以是任何内容
    // this.callback(null, result);
    return result;
}

// 默认情况下，我们只能对源代码进行处理，返回值也只能是源代码
// 如果是有一些 sourceMap 之类的内容，就无法传递到外面给 webpack 使用
// 所以需要使用 this.callback() 进行处理
// this.callback() 可以同步的或者异步的被调用，并返回多个结果

// 1. The first argument must be an Error or null
// 2. The second argument is a string or a Buffer.
// 3. Optional: The third argument must be a source map that is parsable by this module.
// 4. Optional: The fourth option, ignored by webpack, can be anything (e.g. some metadata).
// this.callback(
//     err: Error | null,
//     content: string | Buffer,
//     sourceMap?: SourceMap,
//     meta?: any
// );