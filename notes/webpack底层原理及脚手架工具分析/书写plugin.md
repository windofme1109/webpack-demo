# 书写自定义 plugin

package.json
```json
   {
       "scripts": {
           "debug": "node --inspect --inspect-brk node_modules/webpack/lib/webpack.js",
           "build": "webpack"
       }
   }
```

`--inspect` 开启 node 的调试工具
`--inspect-brk` 在被 node 执行的这个文件的第一行打一个断点