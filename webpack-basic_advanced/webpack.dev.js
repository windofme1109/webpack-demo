// webpack.dev.js 是开发环境下的打包配置文件
const webpack = require('webpack') ;
const {merge} = require('webpack-merge');
const path = require('path') ;
const commonConfig = require('./webpack.common');


const devConfig = {
    mode: 'development',
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true,
        hotOnly: true,

        // 默认情况下，devServer 不会对根路径进行转发
        // 如果想对根路径进行代理，则必须配置 index 字段为空字符串或者 false
        // index: '',
        // 使用webpack devServer 实现代理转发
        proxy: {

            // 在进行代理转发的时候，代理会将原始的请求头带上
            // 设置了 changeOrigin 为 true，则不会携带原始的请求头，一般情况下，都会设置上这个字段
            changeOrigin: true,
            // 配置代理的请求头，代理会带着这个请求头发送到服务器端
            headers: {
                host: 'www.dell-lee.com',
                cookies: ''
            },

            //
            // 配置是否对 https 生效
            secure: false,
            // 因为我们写的路径是相对路径，所以任何以 /react/api 开头的接口，都会被代理到 http://www.dell-lee.com/react/api/ 下
            // /react/api/header.json ---> http://www.dell-lee.com/react/api/header.json
            // '/react/api': 'http://www.dell-lee.com',

            // 如果我又多个接口，都想代理到 http://localhost:3000 下
            // 那么将这多个接口放到一个数组中，并将数组赋给 context
            // context: ['/auth', '/api'],
            // target: 'http://localhost:3000',
            // 对接口做高级配置
            '/react/api': {
                // 配置代理的目标地址
                target: 'http://www.dell-lee.com',

                // pathRewrite 这个字段，用来改写我们我们接口的一些内容
                // 比如说，我们真正想请求的接口地址是：/react/api/header.json，但是这个接口目前不可用
                // 只能使用 /react/api/demo.json 这个接口，但是我们又不能直接改动接口
                // 所以使用 pathRewrite 这个字段，将 header.json 重写为 demo.json
                // 表面上发送的请求是 /react/api/demo.json，实际上请求的是 /react/api/demo.json

                // 对代理做一些精细的控制
                // 拦截请求或者响应
                // 可以访问 request、response、proxyOption
                // 返回值有下面三种情况：
                // 返回 null 或 undefined，使用原来的代理处理请求
                // 返回 false，给这次请求返回一个 404 错误
                // 返回一个 path，作为新的代理路径
                bypass: function(req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {

                        // 如果检测这次请求的是 html，那么就将代理地址指向 /index.html
                        console.log('Skipping proxy for browser request.');
                        return '/index.html';
                    }
                },

                pathRewrite: {
                    'header.json': 'demo.json'
                }
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    optimization: {
        usedExports: true
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        path: path.join(__dirname, 'dist'),
    }
}

module.exports = merge(devConfig, commonConfig);

// const path = require('path') ;
//
// var HtmlWebpackPlugin = require('html-webpack-plugin') ;
//
// // 在打包之前删除打包文件的存放目录
// var {CleanWebpackPlugin} = require('clean-webpack-plugin') ;
//
// var webpack = require('webpack') ;
//
// module.exports = {
//     // mode属性表示打包的环境，默认是production（生产环境），此时打包后的文件会被压缩
//     // 还可以设置成development（开发环境），此时打包后的文件不会被压缩
//     mode: 'development',
//
//     // 建立映射关系
//     devtool: 'cheap-module-eval-source-map',
//
//     // 入口文件，告诉webpack，从哪个文件开始打包
//     entry: {
//         // 指定打包的入口文件
//         // 如果没有指定打包完成后的文件名，默认使用key，也就是main
//         main: './src/index.js',
//         // 如果我想把index.js打包两次，第一次打包叫做main.js，第二次打包叫做sub.js
//         // 在output的配置中，filename就不能是bundle.js，会报错，此时应该采用占位符：[name].js
//         // 这样第一次打包，打包后的文件被存为 main.js
//         // 第二次打包，打包后的文件存为 sub.js
//         // sub: './src/index.js'
//     },
//     // 配置webpack-dev-server
//     // webpack提供的一个http服务
//     devServer: {
//         // 设置服务器的根路径
//         // 所有的文件以及目录都必须放在这个根路径下，服务器才可以访问到
//         contentBase: './dist',
//         // 第一次启动时，自动打开浏览器
//         open: true,
//         // 配置端口，默认是8080
//         port: 8080,
//         // hot属性设置为true，表示开启Hot Module Replacement(HMR)
//         hot: true,
//         // hotOnly设置为true，表示即使HMR功能失效，浏览器也不会自动刷新
//         hotOnly: true
//     },
//
//     // 增加新的module属性，打包一个模块时应用的规则
//     module: {
//         // 规则。可以是多个
//         rules: [
//             {
//                 // test属性用来说明是什么文件
//                 // 属性值是一个正则表达式，检测是什么后缀（扩展名）
//                 // 这里是检测是否为jpg、png、gif
//                 test: /\.(jpg|png|gif)$/,
//                 // use属性用来指定使用什么样的loader
//                 // 这个根据官方文档来配置（不同的loader写法不一样）
//                 use: {
//                     // url-loader的作用类似于file-loader
//                     // 只不过通过url-loader将图片转换为base64编码，然后放入bundle.js中
//                     // 不会生成图片文件
//                     loader: 'url-loader',
//
//                     // loader: 'file-loader',
//                     // options用来配置file-loader的一些其他内容
//                     options: {
//                         // name属性指定打包之后的文件名
//                         // [name]这种写法称为placeholder，占位符
//                         // [name]表示源文件的名称，[ext]表示源文件的扩展名
//                         name: '[name].[ext]',
//                         // 设置打包后的图片的存放目录
//                         outputPath: 'images/',
//                         // limit用来限制被打包的图片的大小，单位是字节
//                         // 小于等limit，使用url-loader打包成base64编码
//                         // 大于limit，url-loader将其打包为图片（类似于file-loader）
//                         limit: 4096
//                     }
//                 }
//             },
//             {
//                 // 检测css文件
//                 test: /\.css$/,
//                 // 使用style-loader和css-loader这两个loader对css文件进行打包
//                 // css-loader分析css文件之间的相互依赖关系，最终经这些css内容合并到一起
//                 // style-loader则是将css-loader合并后的css内容挂载的html文件中的header部分
//                 // loader加载顺序：从下到上，从右到左
//                 use: [
//                     'style-loader',
//                     // 配置css-loader
//                     {
//                         loader: 'css-loader',
//                         options: {
//                             // importLoaders这个属性的作用是：如果其他的css文件也使用import语法引入了其他css文件
//                             // 那么在使用css-loader处理前，还会经历一个loader的处理，也就是css-loader之前的postcss-loader
//                             // 保证所有的css文件都会被这三个loader处理
//                             importLoaders: 1,
//                             // modules属性为true，表示引入的css样式只作用域当前的模块，而不是作用于所有符合的元素
//                             // modules: true
//                         }
//                     },
//                     'postcss-loader'
//                 ]
//             },
//             // 配置babel插件
//             {
//                 test: /\.js$/,
//                 // node_modules中的文件不会被编译
//                 // 除去node_modules目录下的文件都会被编译
//                 exclude: /node_modules/,
//                 // 加载loader
//                 loader: 'babel-loader',
//                 //
//                 options: {
//                     // 只有使用了@babel/preset-env这个插件，才能将ES6转换为ES5
//                     // 配置presets
//                     // 如果配置项太多，我们可以新建.babellrc文件，以json的形式，将presets配置放进去
//                     // presets: [['@babel/preset-env', {
//                     //     // 这个target属性的作用是：设置目标浏览器的版本
//                     //     // 打包后的js文件要运行在什么版本的浏览器上面
//                     //     // babel会根据浏览器版本决定是否对ES6语法进行编译
//                     //     // 如果浏览器原生支持，就不需要编译
//                     //     targets: {
//                     //         firefox: '60',
//                     //         chrome: '67',
//                     //
//                     //     },
//                     //     // 这个配置项用于@babel/polyfill这个插件
//                     //     // 只会编译我们项目中出现的ES6新特性，如Promise等，没有用到的不会打包进文件中
//                     //     // 如果不配置，会将所有的ES6新特性打包，会导致我们的文件很臃肿
//                     //     useBuiltIns: 'usage'
//                     // }]]
//
//                     "plugins": [
//                         [
//                             "@babel/plugin-transform-runtime",
//                             {
//                                 "absoluteRuntime": false,
//                                 "corejs": 2,
//                                 "helpers": true,
//                                 "regenerator": true,
//                                 "useESModules": false
//                             }
//                         ]
//                     ]
//                 }
//             }
//         ]
//     },
//
//     // 添加插件
//     plugins: [
//         new HtmlWebpackPlugin({
//             // 添加模板html
//             // 指定HtmlWebpackPlugin插件使用的模板是src目录下的index.html
//             template: 'src/index.html'
//         }),
//         new CleanWebpackPlugin(),
//         new webpack.HotModuleReplacementPlugin()
//     ],
//
//     optimization: {
//         // 仅仅打包那些被使用的导出的内容，默认为 false
//         usedExports: true
//     },
//     // 打包完成后的文件的配置
//     output: {
//
//         // 这个属性的作用是给打包生成的js文件添加路径
//         // 比如我们把js文件放到了cdn服务器上，在引用这些js文件时需要加上cdn的地址
//         // 所以配置publicPath选项，可以为我们自动添加路径
//         // 最终结果就是 src="https://www.cdn.com.cn/main.js"，从而放在入口的html文件中
//         // publicPath: 'https://www.cdn.com.cn',
//
//         // 打包完成后的文件名
//         // filename: 'bundle.js',
//         // 使用占位符，这样打包出来的文件的文件名是entry对象中，指定入口文件的key
//         // main: './src/index.js'，则打包后的文件名就是main.js
//         filename: '[name].js',
//         // 存放路径，必须是绝对路径
//         // 使用join()方法，拼接处一个绝对路径
//         path: path.join(__dirname, 'dist'),
//     }
// }

