const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    // 加载 loader 时的一些配置
    resolveLoader: {
        // 指定去哪些目录下加载 loader
        modules: ['node_modules', './loaders']
    },
    module: {
      rules: [
          {
              test: /\.js$/,
              // 使用自定义 loader，需要我们使用自定义 loader 的绝对路径
              use: [
                  {
                      // loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
                      // 配置了 resolveLoader，就可以不用指定自定 loader 的绝对路径了
                      loader: 'replaceLoader',
                      // 给 loaders 提供一些额外的配置项
                      // 这个配置项可以通过 this.query 拿到 option 中的配置项
                      // options: {
                      //     name: 'china'
                      // }
                  },
                  {
                      loader: 'replaceLoaderAsync',
                      options: {
                          name: 'qinney'
                      }
                  }

              ]
          }
      ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    }
}