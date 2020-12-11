<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [SplitChunksPlugin 配置项详解](#splitchunksplugin-%E9%85%8D%E7%BD%AE%E9%A1%B9%E8%AF%A6%E8%A7%A3)
  - [1. 基本概念](#1-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2. 参考资料](#2-%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)
  - [3. 基本配置](#3-%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# SplitChunksPlugin 配置项详解

## 1. 基本概念

1. 在 `optimization` 中，配置 `splitChunks` 字段，可以用来进行代码分割。

## 2. 参考资料

1. 参考资料：[split-chunks-plugin](https://webpack.js.org/plugins/split-chunks-plugin/)

## 3. 基本配置

1. `splitChunks` 的配置项：
   - `chunks` 值为字符串，表示哪种模块需要被分割。
     - `async` 表示异步方式引入的模块会被分割，如使用 `import()` 函数引入的模块。同步方式引入的模块不会被打包。
     - `all` 表示同步或者异步方式引入的模块都会被分割。如果想对同步引入的代码进行打包，还需要设置 `cacheGroups` 字段。
     - `initial` 表示对只同步代码做分割。
   - `minSize` 值为数字，单位为字节（Byte）。表示引入的第三方模块体积如果小于 `minSize`，就不分割打包了，只有大于 `minSize` 才会打包。
   - `maxSize` 值为数字，单位为字节（Byte）。这个配置项使用的比较少。作用是进行代码分割后的模块，如果体积大于 `maxSize`，则 webpack 会继续尝试进行打包，看看能不能分割成更小的体积。
   - `minChunks` 默认为 1。表示一个第三方模块，在打包生成的 chunks 中被引用的次数，如果大于 `minChunks`，则对这个第三方进行代码分割，否则不进行代码分割。
     > Minimum number of chunks that must share a module before splitting.
   - `maxAsyncRequests` 同时请求的文件的最大数量。这个参数用来限制代码分割的模块的数量。比如分割打包成 10 个文件，那么浏览器在请求这些文件的时候，要发送 10 次请求。当我设置了 `maxAsyncRequests` 这个参数后，代码分割数量后的模块的数量就被限定为 `maxAsyncRequests` 指定的数量。这样就间接的限定了浏览器发送请求的数量。如果我们引用的模块数量超过了 `maxAsyncRequests` 指定的数量，假设 `maxAsyncRequests` 设定为 5，我们引入的模块数量是 10，那么 webpack 会打包前 5 个模块，后面的 5 个就不进行分割打包了。
     > Maximum number of parallel requests when on-demand loading.
   - `maxInitialRequests` 加载首页时，同时请求的文件的最大数量，这个参数用来限定入口文件中引用的模块分割打包后的数量。间接限定了加载首页时的请求数量。
     > Maximum number of parallel requests at an entry point.
   - `automaticNameDelimiter` 在没有指定的 filename 的情况下，打包后生成的文件名中间的分隔符。默认值为：`~`，如 `vonders~lodash.js`。
     > By default webpack will generate names using origin and name of the chunk (e.g. vendors~main.js). This option lets you specify the delimiter to use for the generated names.
   - `name` 值为布尔值，默认为 false，这个配置项用来控制 `cacheGroups` 中指定 `fileName` 是否生效。
2. `splitChunks.cacheGroups` 配置项 
    - 配置同步加载的模块的代码分割方式。值为对象。
    - 为什么叫 cache groups，实际上，如果是同步加载的模块的打包，比如说同时引入 `lodash` 和 `jquery`，如果没有 `cacheGroups` 配置项，就会分别进行打包。如果我们想把这两个模块打包到一起，那么就需要这个配置项，也就是分析模块是否符合 `cacheGroups` 中的配置项的要求，比如说 `vendors` 的配置，如果 `lodash` 符合，那么就缓存到 `vendors` 这个组中，同样的，如果 `jquery` 符合 `vendors` 的配置，也会被缓存到 `vendors` 这个组中。最后分析完所有的模块，将同一组的模块统一打包进一个文件中。这就是 cache groups —— 缓存组的意义。  
    - `cacheGroups` 这个配置项能够继承或者是覆盖 `splitChunks` 字段下的任何配置项。但是 `test`、`priority`、`reuseExistingChunk` 这三个字段只能在 `cacheGroups` 中配置。如果想禁用默认的 cache groups，例如 `vendor`，设置它的值为 false。
       > Cache groups can inherit and/or override any options from splitChunks.*; but test, priority and reuseExistingChunk can only be configured on cache group level. To disable any of the default cache groups, set them to false
    - 如果我们配置了 `cacheGroups`，如下所示：
       ```javascript
          cacheGroups: {
              vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  fileName: 'vendor.js',
                  reuseExistingChunk: true
              },
              default: {
                  priority: -20,
                  fileName: 'common.js',
                  reuseExistingChunk: true
              }
          }
       ```
       那么什么情况下才会用到里面的配置项呢，实际上是这样：首先检测引用的模块 是否符合下列的配置项要求：`minSize`、`maxSize`、`minChunks`、`maxAsyncRequests`、`maxInitialRequests`，如果符合，则启用 `cacheGroups` 里面的配置项。`vendors` 和 `default` 实际上是对不同类型、不同来源的模块进行代码分割使用的。  
       首先进入 `vendors` 里面，检查我们引入的模块是否是来自 node_modules，`test` 字段就是检查模块的来源。如果是来自 node_modules，就使用 `vendors` 里面的配置。如果模块不是来自 node_modules，那么就使用 `default` 里面的配置。具体的字段值说明如下：
    - `test` 字段就是检查模块的来源。
    - `filename` 用来设置打包后的模块的名字。
    - `priority` 用来设代码分割的优先级，也就是如果一个模块同时符合 vendors 和 default 的要求，那么按照哪个配置进行打包呢，答案是根据 `priority` 决定，`priority` 值越小，打包的优先级越高。
    - `reuseExistingChunk` 的作用是，如果一个模块中引用了其他模块，而被引用的模块已经被分割打包。那么将不会重复打包这个被引用的模块，而是重复使用这个已经被打包的模块。
       > If the current chunk contains modules already split out from the main bundle, it will be reused instead of a new one being generated. This can impact the resulting file name of the chunk.

## 4.一个小的知识点 -- `chunkFilename`  配置项

- `chunkFilename` 这个配置项用来生成非入口文件的打包后的文件名。比如举个例子：在 `entry` 中，配置的入口文件为：`main: './src/index.js'`，那么这个入口文件，打包后，走的配置是 `output` 中的 `fileName: '[name].js'`，而 index.js 文件中引用了其他模块，比如说 `lodash`，这个lodash 并不是入口文件，而是 index.js 引用的一个模块，这个模块会被单独打包，生成一个 chunk，所有会走 `output` 中的 `chunkFilename: '[name].chunk.js'` 这个配置。
   > This option determines the name of non-entry chunk files. See output.filename option for details on the possible values.