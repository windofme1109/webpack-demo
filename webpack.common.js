
const path = require('path') ;

const HtmlWebpackPlugin = require('html-webpack-plugin');

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
            chunkFilename: '[name].chunk.js'
        })
    ],
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

    optimization: {
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
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        path: path.join(__dirname, 'dist'),
    }
}