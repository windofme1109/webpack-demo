const path = require('path');
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    // 加载 loader 时的一些配置
    // resolveLoader: {
    //     // 指定去哪些目录下加载 loader
    //     modules: ['node_modules', './loaders']
    // },
    plugins: [
        new CopyrightWebpackPlugin()
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    }
}