const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    module: {
      rules: [
          {
              test: /\.js$/,
              // 使用自定义 loader，需要我们使用自定义 loader 的绝对路径
              use: [
                  path.resolve(__dirname, './loaders/replaceLoader.js'),
              ]
          }
      ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    }
}