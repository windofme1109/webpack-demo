# 懒加载（lazy-loading）与 配置 preloading 和 prefetching

## 1. 背景

1. 懒加载是前端页面优化的一种方式。懒加载指的是不会提前加载 js 代码或者某种资源，等到需要的时候再加载。初始化页面时，不需要的资源可以不用加载，等需要的时候再动态加载，这样可以提高页面的加载速度。

2. preloading 或者 prefetching ，指的是预加载，也就是提前请求一些资源，这样等需要的时候，就能直接使用，无需请求，节约了时间，提高了效率。

## 1. 懒加载（lazy-loading）

1. 在 index.js 中添加如下的代码：
   ```javascript
      function getComponent() {
          // 添加 magic comment
          // magic comment 实际上是用来配动态导入的，也就是使用块级注释：/**/ 设置配置项
          // 在导入的模块前面添加 magic comment，然后配置项就会生效
          // 将打包后的 lodash 模块命名为 lodash，而不是 0.js
          return import(/*webpackChunkName:"lodash"*/ 'lodash').then(({default: _}) => {
              const element = document.createElement('div');
              element.innerHTML = _.join([1, 2, 3, 4, 5], '*');
              return element;
          })
      }
      document.addEventListener('click', function (e) {
          getComponent().then(element => {
              document.body.appendChild(element);
          })
      })
   ```
   页面刚刚加载的时候，不加载 `lodash`，当我们点击页面的时候，调用 import() 函数动态导入 `lodash`。这样就实现了懒加载。

2. 动态导入函数 import() 的说明：
   - 标准用法的import导入的模块是静态的，会使所有被导入的模块，在加载时就被编译（无法做到按需编译，降低首页加载速度）。有些场景中，你可能希望根据条件导入模块或者按需导入模块，这时你可以使用动态导入代替静态导入。下面的是你可能会需要动态导入的场景：
     - 当静态导入的模块很明显的降低了代码的加载速度且被使用的可能性很低，或者并不需要马上使用它。
     - 当静态导入的模块很明显的占用了大量系统内存且被使用的可能性很低。
     - 当被导入的模块，在加载时并不存在，需要异步获取。
     - 当导入模块的说明符，需要动态构建。（静态导入只能使用静态说明符）
     - 当被导入的模块有副作用（这里说的副作用，可以理解为模块中会直接运行的代码），这些副作用只有在触发了某些条件才被需要时。（原则上来说，模块不能有副作用，但是很多时候，你无法控制你所依赖的模块的内容）
   - 请不要滥用动态导入（只有在必要情况下采用）。静态框架能更好的初始化依赖，而且更有利于静态分析工具和tree shaking发挥作用。
   - import() 函数返回一个 Promise 结果，因此可以使用 then() 链式调用。
   - import() 属于较新的语法，因此，我们在使用的时候，需要引入 `@babel/polyfill`，以保证兼容性。
   - 由于 import() 函数返回一个 Promise 结果，所以我们可以使用 async/await，将其改写为同步代码的形式。
   
## 2. preloading 和 prefetching（预加载）

1. 当我们引入第三方模块的时候，webpack 会将其打包。在加载页面的时候，浏览器会去请求这些打包后的第三方模块。当浏览器第二次或者第三次请求时，由于第三方模块没有发生变化，那么不用请求这些文件，直接使用缓存即可。

2. 通过上面的描述，我们可以得知，只有第二次即以后的请求才会使用缓存。实际上，我们希望的时尽量提搞第一次加载的速度。

3. 打开浏览器的调试窗口，在 console 下，按下快捷键：ctrl + shift + p，在弹出的界面输入：coverage。