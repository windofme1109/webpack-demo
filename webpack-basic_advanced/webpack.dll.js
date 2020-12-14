// 打包第三方模块使用
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: {
        // 设置入口文件为 react 等第三方模块
        vendor: ['lodash'],
        // 将不同的模块打包进不同的文件中
        react: ['react', 'react-dom']
    },

    output: {
        filename: '[name].dll.js',
        // 将第三方模块打包后的文件的输出的路径为 dll 目录
        path: path.resolve(__dirname, './dll'),
        // 设置将打包后的文件作为一个模块，设置其为一个全局变量，名为 vendor
        // 名称就是 entry 中的文件名 vendor
        library: '[name]'
    },

    plugins: [
        new webpack.DllPlugin({
            // 这个 name 属性是对外暴露的全局变量，就是 output 中，library字段指定的值
            name: '[name]',
            //
            // DllPlugin 会生成一个 manifest.json 文件，用来指定导入的模块到全局变量的映射关系
            // 因为我们把第三方模块打包为一个文件，并导出一个全局变量，那么这个全局变量和导入的第三方模块是什么关系
            // DllPlugin 就负责生成这种映射关系
            // path 参数指定 manifest.json 的存放路径
            path: path.resolve(__dirname, './dll/[name].manifest.json'),
        })
    ]
}
