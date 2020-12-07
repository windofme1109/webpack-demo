# 使用 Babel 打包 React

1. 使用 Webpack 打包 React 代码，需要使用 Babel 的一些插件。前面我们使用了`@babel/preset-env`和`@babel/polyfill`。可以将ES6的语法转换为ES5。但是还不能将React的JSX语法进行转换。

2. 参考资料：[babel-preset-react](https://babeljs.io/docs/en/babel-preset-react)

3. 所以我们还需要另外一个插件：`@babel/preset-react`。

4. 安装
   - `npm install --save-dev @babel/preset-react`

5. 使用
我们需要在`.babelrc`（或`babel.config.json`）文件中进行配置：
   ```javascript
      // .babelrc
      {
        "presets": [
          [
            "@babel/preset-env", {
      
              "targets": {
                "firefox": "60",
                "chrome": "67"
              },
      
              "useBuiltIns": "usage"
            }
          ],
          ["@babel/preset-react"]
        ]
      }
   ```

6. 在 `presets` 属性中，添加一条：`@babel/preset-react`。这条内容必须在 `@babel/preset-env` 的后面。因为执行顺序是从下到上的。也就是先通过`@babel/preset-react`插件将 jsx 语法转换为 ES6，在通过 `@babel/preset-env` 插件将 ES6 转换为 ES5。

7. 所以我们在 index.js 中就可以写 jsx 代码了。注意，我们要在 jsx 文件中导入 `@babel/polyfill` 这个插件。

8. 示例如下：
   ```javascript
      // index.js
      import '@babel/polyfill';
      import React, {Component} from 'react';
      import ReactDOM from 'react-dom';   
   
      class App extends Component {   
          render() {  
              return (  
                  <div>
                      <h1>Hello World</h1>
                  </div>
              )
          }
      }   
      ReactDOM.render(<App />, document.querySelector('.root')) ;
   ```


