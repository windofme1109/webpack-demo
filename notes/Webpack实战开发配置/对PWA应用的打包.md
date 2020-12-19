<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [对 PWA（Progressive Web App） 的打包](#%E5%AF%B9-pwaprogressive-web-app-%E7%9A%84%E6%89%93%E5%8C%85)
  - [1. 什么是 PWA](#1-%E4%BB%80%E4%B9%88%E6%98%AF-pwa)
  - [2. 配置 Webpack](#2-%E9%85%8D%E7%BD%AE-webpack)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 对 PWA（Progressive Web App） 的打包

## 1. 什么是 PWA

## 2. 配置 Webpack

1. 完成 PWA 应用的打包，首先要安装插件：`workbox-webpack-plugin`，这个是谷歌推出的一个 webpack 打包插件。
   - 安装 `npm install workbox-webpack-plugin --save`
   
2. 配置
   - 只需要配置线上环境的 webpack 配置文件即可。因为只有线上环境才考虑服务器挂掉的情况。
   ```javascript
      // webpack.prod.js
      const WorkerboxPlugin = require('workbox-webpack-plugin');
      module.exports = {
          plugins: {
              new WorkboxPlugin.GenerateSW({
                  clientsClaim: true,
                  skipWaiting: true
              })          
          }
      }
   ```
   
3. 在 index.js 添加如下代码，启用 serviceWorker：
   ```javascript
      if ('serviceWorker' in navigator) {
         // service-worker.js 是打包生成 service worker 文件
         // 用来应用 PWA
         navigator.serviceWorker.register('./service-worker.js')
             .then(registration => {
                 console.log('service-worker registed');
              }).catch(err => {
                 console.log('error');
              })  
      }
   ```
4. 官方文档（需要翻墙）：[workbox-webpack-plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)