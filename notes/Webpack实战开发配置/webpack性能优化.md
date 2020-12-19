<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [webpack 打包的性能优化](#webpack-%E6%89%93%E5%8C%85%E7%9A%84%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)
  - [1. 跟上技术的迭代（Node、Npm、Yarn）](#1-%E8%B7%9F%E4%B8%8A%E6%8A%80%E6%9C%AF%E7%9A%84%E8%BF%AD%E4%BB%A3nodenpmyarn)
  - [2. 在尽可能少的模块上使用 loader](#2-%E5%9C%A8%E5%B0%BD%E5%8F%AF%E8%83%BD%E5%B0%91%E7%9A%84%E6%A8%A1%E5%9D%97%E4%B8%8A%E4%BD%BF%E7%94%A8-loader)
  - [3. Plugin 尽可能精简并确保可靠](#3-plugin-%E5%B0%BD%E5%8F%AF%E8%83%BD%E7%B2%BE%E7%AE%80%E5%B9%B6%E7%A1%AE%E4%BF%9D%E5%8F%AF%E9%9D%A0)
  - [4. 合理使用 `resolve` 字段的配置](#4-%E5%90%88%E7%90%86%E4%BD%BF%E7%94%A8-resolve-%E5%AD%97%E6%AE%B5%E7%9A%84%E9%85%8D%E7%BD%AE)
  - [5. 配置 DllPlugin 和 DllReferencePlugin，减少第三方模块的重复打包](#5-%E9%85%8D%E7%BD%AE-dllplugin-%E5%92%8C-dllreferenceplugin%E5%87%8F%E5%B0%91%E7%AC%AC%E4%B8%89%E6%96%B9%E6%A8%A1%E5%9D%97%E7%9A%84%E9%87%8D%E5%A4%8D%E6%89%93%E5%8C%85)
  - [6. 控制包文件的大小](#6-%E6%8E%A7%E5%88%B6%E5%8C%85%E6%96%87%E4%BB%B6%E7%9A%84%E5%A4%A7%E5%B0%8F)
  - [7. `thread-loader`、`parallel-webpack`、`happypack` 启用多进程进行打包。](#7-thread-loaderparallel-webpackhappypack-%E5%90%AF%E7%94%A8%E5%A4%9A%E8%BF%9B%E7%A8%8B%E8%BF%9B%E8%A1%8C%E6%89%93%E5%8C%85)
  - [8. 合理使用 sourceMap](#8-%E5%90%88%E7%90%86%E4%BD%BF%E7%94%A8-sourcemap)
  - [9. 结合 stats 分析打包结果](#9-%E7%BB%93%E5%90%88-stats-%E5%88%86%E6%9E%90%E6%89%93%E5%8C%85%E7%BB%93%E6%9E%9C)
  - [10. 开发环境内存编译](#10-%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%86%85%E5%AD%98%E7%BC%96%E8%AF%91)
  - [11. 开发环境无用插件剔除](#11-%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%97%A0%E7%94%A8%E6%8F%92%E4%BB%B6%E5%89%94%E9%99%A4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

## 7. `thread-loader`、`parallel-webpack`、`happypack` 启用多进程进行打包。

## 8. 合理使用 sourceMap

## 9. 结合 stats 分析打包结果

## 10. 开发环境内存编译

## 11. 开发环境无用插件剔除