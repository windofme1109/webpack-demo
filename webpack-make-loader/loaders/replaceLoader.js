// 注意，loader 不能使用 箭头函数，因为箭头函数没有 this 指向
// 而 loader 需要 this 做一些事，webpack 会改变函数的 this 指向，调用挂载到 this 上的一些方法
/**
 * loader 接收入口文件的源代码，然后我们对源代码进行一些操作，最后返回操作后的源代码
 * @param source 入口文件的源代码
 */
module.exports = function (source) {
    return source.replace('world', 'qinney');
}