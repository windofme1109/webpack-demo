
const path = require('path') ;

const HtmlWebpackPlugin = require('html-webpack-plugin');

// 在打包之前删除打包文件的存放目录
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

/**
 * 公共的 webpack 配置文件
 * @type {{output: {path: string, filename: string}, entry: {main: string}, plugins: [HtmlWebpackPlugin, CleanWebpackPlugin], module: {rules: [{test: RegExp, use: {loader: string, options: {outputPath: string, name: string, limit: number}}}, {test: RegExp, use: [string, {loader: string, options: {importLoaders: number}}, string]}, {test: RegExp, loader: string, options: {plugins: [[string, {helpers: boolean, corejs: number, useESModules: boolean, regenerator: boolean, absoluteRuntime: boolean}]]}, exclude: RegExp}]}}}
 */
module.exports = {
    entry: {
        main: './src/index.js',
    },
    module: {
        // 规则。可以是多个
        rules: [
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        limit: 4096
                    }
                }
            },
            {
                // 检测css文件
                test: /\.css$/,
                use: [
                    'style-loader',
                    // 配置css-loader
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    'postcss-loader'
                ]
            },
            // 配置babel插件
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 加载loader
                loader: 'babel-loader',
                options: {
                    "plugins": [
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                "absoluteRuntime": false,
                                "corejs": 2,
                                "helpers": true,
                                "regenerator": true,
                                "useESModules": false
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 添加模板html
            // 指定HtmlWebpackPlugin插件使用的模板是src目录下的index.html
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
    }
}