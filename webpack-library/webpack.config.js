
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/index.js'
    },
    // 值为数组或者对象或者字符串，打包过程中遇到了 lodash 这个模块，就忽略掉，不将其打包进源代码中
    // externals: ['lodash'],
    externals: {
        // 外部的资源是 lodash，那么打包过程中，将其忽略
        // 对引入的方式有要求，相当于限定了 模块的名称
        // 无论是全局变量、commonJS 还是 AMD，引入了 lodash 这个模块，就忽略
        // 下面这种方式，要求 libraryTarget 为 umd
        // lodash: {
        //     // 如果是 script 方式引入，则必须使用 _ 这个全局变量 作为 lodash 的引入
        //     root: '_',
        //     // 如果是 commonJS 方式引入，必须是引入方式必须是：require('lodash')
        //     commonjs: 'lodash',
        //     // AMD 引入时的模块名
        //     amd: 'lodash',
        //
        // }

        // 直接指定各种引入方式的 lodash 模块名为 lodash
        lodash: 'lodash'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'library.js',

        // 有一些情况下，导入模块是通过 script 标签导入，通过全局变量的方式使用
        // 那么就需要将我们的这个模块定义为全局变量，设置 library 字段，值为我们定义的一个名字
        // 如 library，那么就可以使用 library 这个全局变量了
        library: 'library',

        // 这个字段是给打包模块使用的
        // 我们生成的是供别人使用的模块，引入模块的方式可能有 AMD、commonJS、ES Module等方式
        // 设置 libraryTarget 为 umd，表示这是通用模块定义，可以使用多种模块化方案 (AMD、commonJS、ES Module)
        // library 还可以和 libraryTarget 配合使用
        // libraryTarget 设置为 this，library 会被挂载到 this 上
        // libraryTarget 设置为 window，library 会被挂载到 window 上
        libraryTarget: 'umd',
    }

}