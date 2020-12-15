
const path = require('path') ;

const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 在打包之前删除打包文件的存放目录
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

/**
 * 公共的 webpack 配置文件
 * @type {{output: {path: string, filename: string}, entry: {main: string}, plugins: [HtmlWebpackPlugin, CleanWebpackPlugin], module: {rules: [{test: RegExp, use: {loader: string, options: {outputPath: string, name: string, limit: number}}}, {test: RegExp, use: [string, {loader: string, options: {importLoaders: number}}, string]}, {test: RegExp, loader: string, options: {plugins: [[string, {helpers: boolean, corejs: number, useESModules: boolean, regenerator: boolean, absoluteRuntime: boolean}]]}, exclude: RegExp}]}}}
 */
module.exports = {
    entry: {
        // lodash: './src/lodash.js',
        main: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 添加模板html
            // 指定HtmlWebpackPlugin插件使用的模板是src目录下的index.html
            template: 'src/index.html'
        }),
        // 在最新版的 webpack 中  CleanWebpackPlugin 插件中不需要写里面的目标路径，会自动清除生成的文件夹，比如是 build 文件夹
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            _join: ['lodash', 'join']
        }),

        // 入口中配置了几个第三方模块，这里就要使用 AddAssetHtmlPlugin 引入向 index.html 几次
        // 所以我们可以使用一个数组。配置多个 filepath，向 index.html 中引入 js 文件
        new AddAssetHtmlPlugin([
            {filepath: path.resolve(__dirname, './dll/vendor.dll.js')},
            {filepath: path.resolve(__dirname, './dll/react.dll.js')},
        ]),
        new webpack.DllReferencePlugin({
            // 指定了 manifest.json 的路径
            // 负责引用第三方模块与 vendor.dll.js （全局变量 vendor）的映射关系
            // 引用第三方插件时，这个插件去 manifest.json 去寻找上述的映射关系
            // 找到了，就直接从 vendor.dll.js 中引用，就没有必要重新打包了
            // 如果没有找到这个映射关系，就去 node_modules 中查找，并重新打包
            manifest: path.resolve(__dirname, './dll/vendor.manifest.json')
        }),

        // 入口中配置了几个第三方模块，这里就要使用 DllReferencePlugin 分析几次 manifest.json
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, './dll/react.manifest.json')
        })
    ],
    // 忽略打包时的性能提示
    performance: false,
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
                    // 'style-loader',

                    // MiniCssExtractPlugin.loader,
                    // 使用 mini-css-extract-plugin 对 css 代码进行分割，我们就不能使用 style-loader 进行打包
                    // 而是使用 mini-css-extract-plugin 提供的 loader
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            // publicPath: '../',
                            // hmr: process.env.NODE_ENV === 'development',
                        },
                    },
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
                // 既能解析 js，也能解析 jsx
                test: /\.jsx?$/,
                exclude: /node_modules/,
                // 加载loader
                use: [
                    {
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
                    },

                        // 将模块的 this 指向 window
                    // {loader: 'imports-loader?this=>window'}


                ]

            }
        ]
    },

    optimization: {
        // 给老版本的 webpack 用的
        // 老版本的 webpack 在打包的过程中，可能入口文件内容没有变化，但是文件的 hash 值发生变化的情况
        // 这是由于 业务逻辑代码和第三方模块的代码的关系变化导致的
        // 设置了下面的 runtimeChunk 属性，并配置 name 为 runtime，可以分离这种关系
        // 使得只有入口文件内容变化时，文件的 hash 值才跟着发生变化
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            chunks: 'all',
            // minSize: 30,
            // maxSize: 500,
            // maxAsyncRequests: 30,
            // maxInitialRequests: 30,
            // automaticNameDelimiter: '~',
            // enforceSizeThreshold: 50000,
            // cacheGroups: {
            //     defaultVendors: {
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10,
            //         filename: 'vendor.js',
            //         reuseExistingChunk: true
            //     },
            //     default: {
            //         priority: -20,
            //         filename: 'common.js',
            //         reuseExistingChunk: true
            //     }
            // }
        },

    },
    // output: {
    //     filename: '[name].js',
    //     chunkFilename: '[name].chunk.js',
    //     path: path.join(__dirname, 'dist'),
    // }
}