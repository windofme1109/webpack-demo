# 配置 devServer

1. 之前我们如果更改了文件中代码，必须手动的打包文件，然后启动浏览器运行。有没有自动化的方式，检测文件变化，然后自动打包，并刷新浏览器的方法呢？答案是yes。有下面三种方式。
## 1. 使用 `npm run watch` 命令

1. 首先我们要修改package.json文件的内容，将
   ```
    "scripts": {
      "bundle": "webpack"
    }
   ```
   修改为：
   ```json
      "scripts": {
        "watch": "webpack --watch"
      }
   ```

2. 这样，webpack 会自动检索被打包的文件，发现文件有变化，就重新打包。

3. 此时我们使用的命令是：`npm run watch`

## 2. 使用 `webpack-dev-server`

1. webpack-dev-server 是 webpack 提供的一个服务器。我们配置好以后。这个服务器会提供http服务。并指定一个url。服务器监视文件的变化，发现变化就重新打包，并自动刷新浏览器。

2. 安装
   - `npm install webpack-dev-server --save-dev`
   
3. 配置
   ```javascript
      // webpack.config.js
      module.exports = {
          mode: 'development',
      
          // 建立映射关系
          devtool: 'cheap-module-eval-source-map',
          // 配置webpack-dev-server
          // webpack提供的一个http服务
          devServer: {
              // 设置服务器的根路径
              // 所有的文件以及目录都必须放在这个根路径下，服务器才可以访问到
              contentBase: './dist',
      	      // 第一次启动时，自动打开浏览器
              open: true，
              // 配置端口，默认是8080
              port: 8080
          }
      }
   ```
4. 参数说明
   - `devServer`  表示配置 webpack-dev-server。
   - `contentBase` 表示设置服务器的根路径。
   - `open`  属性为true，表示服务器第一次启动时，自动打开浏览器。
   - `port` 用来设置端口号，默认是8080。
   - 还可以配置 proxy 字段实现代理转发，create-react-app 配置代理就是通过 devServer 实现的。
   
5. 还需要配置package.json文件。
   ```javascript
      package.json
      "scripts": {
        "watch": "webpack --watch",
        "start": "webpack-dev-server"
      }
   ```

   在scripts对象中添加了一句：`"start": "webpack-dev-server"`  
这样，我们可以使用 `npm run start` 命令，启动 webpack-dev-server 服务。

6. 使用webpack-dev-server不会生成dist目录，将打包后的文件放入了内存之中。这样可以加快打包速度。

##  3. 使用 express 手动实现一个 http 服务

1. 结合 express 手动实现一个服务器。可以实现自动打包的功能。

2. webpack 可以在 Node 环境下使用，因为 webpack 提供了一系列在 Node 环境下使用的 API。参考文档：[Node Api](https://v4.webpack.js.org/api/node/#installation)
