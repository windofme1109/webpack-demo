/**
 * 自定义的 plugin 是一个类
 */
class CopyrightWebpackPlugin {
    // 我们传入的 plugin 的配置项可以从构造方法中接收
    // constructor(options) {
    //     // console.log(options);
    // }

    /**
     * 自定的插件，必须覆写 apply() 方法
     * apply() 接收 compiler 作为参数
     *
     * @param compiler compiler 可以理解为 webpack 实例，包含了 webpack.config.js 中的配置项
     * compiler 模块是使用所有通过 CLI 或Node API 传递的 options 创建编译实例（compilation instance）
     * 扩展了 Tapable 类，目的是注册和调用 plugin。
     */
    apply(compiler) {


        /**
         * compile
         *
         * 同步 hook
         * 在一个新的 compilation 创建之前，在 beforeCompiler 调用之后触发
         * SyncHook
         *
         * Called right after beforeCompile, before a new compilation is created.
         */

        /**
         * 同步 hook 调用的是 tap()
         * tap() 方法接收两个参数，第一个参数是插件名称，第二个参数是回调函数
         * 回调函数只接收一个参数：
         * compilation：本次打包的一些配置，包含很多方法和 hook
         *
         *
         */

        compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
            console.log('compiler');
        })
        /**
         * compiler 有很多 hook，每个 hook 调用的时机不同
         * 通过这个 hook，我们就可以在不同的webpack 运行时刻做一些事
         *
         * hook 示例
         * emit
         * 异步调用
         * 触发时机是在将打包后的资源写入到输出目录之前
         * AsyncSeriesHook
         *
         * Executed right before emitting assets to output dir.
         *
         * Callback Parameters: compilation
         *
         */
        /**
         * 所有的 hook 都可以调用 tapAsync() 或者是 tap()
         * 异步 hook 调用 tapAsync()，同步 hook 调用 tap()
         *
         * tapAsync() 接收两个参数，第一个参数是插件名称，第二个参数是回调函数
         * 回调函数接收两个参数：
         * compilation：本次打包的一些配置，包含很多方法和 hook
         * callback：回调，在回调函数最后执行
         */
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, callback) => {
            debugger
            // assets 对象存放的是本次打包生成的资源的相关信息
            // 因此我们可以向其中添加一些额外的文件
            compilation.assets['copyright.txt'] = {

                // 本次写入文件的内容
                // 值为函数，函数的返回值就是要写入文件的内容
                source: function() {
                     return 'copyright by qin';
                },
                // 指定文件的大小
                // 值为函数，函数的返回值就是文件的大小
                size: function() {
                    return 21;
                }
            }
            // 回调的最后一定要调用 callback()
            callback();
        });
    }
}

module.exports = CopyrightWebpackPlugin;