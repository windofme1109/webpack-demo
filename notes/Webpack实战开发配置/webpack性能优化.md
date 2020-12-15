# webpack 打包的性能优化

## 1. 跟上技术的迭代（Node、Npm、Yarn）

## 2. 在尽可能少的模块上使用 loader

1. 善于使用 `rules` 中的 `inclue` 和 `exclude` 字段。
   - `inclue` 指定哪个路径下的文件使用 loader
   - `exclude` 指定哪个路径下的文件**不**使用 loader，比如说 `node_modules` 下的 js 文件不需要使用 `babel-loader`，我们就可以设置 `exclude` 为 `node_modules`。
   
## 3. Plugin 尽可能精简并确保可靠

1. 用不到的插件就不用。比如开发模式下。不需要进行 css 代码压缩，那么我们就没有必要使用 `MiniCssExtractPlugin` 插件了。

2. 尽量使用官方提供的插件，性能有保障。

## 4. 合理使用 `resolve` 字段的配置

1. 合理配置 `resolve` 下的 `extensions`、`mainFiles` 等字段，减少文件查找对打包造成的性能的影响。

## 5. 配置 DllPlugin 和 DllReferencePlugin，减少第三方模块的重复打包

## 6. 控制包文件的大小

1. 配置 splitChunksPlugin，拆分多个包进行打包，提高打包速度，减小生成包的体积。

## 8. `thread-loader`、`parallel-webpack`、`happypack` 启用多进程进行打包。

## 9. 合理使用 sourceMap

## 10. 结合 stats 分析打包结果

## 11. 开发环境内存编译

## 12. 开发环境无用插件剔除