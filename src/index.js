// import favImg from './09.jpg'
// import './index.css'
// import './style.css'

// import createImg from './create_img'

import '@babel/polyfill' ;
import React, {Component} from 'react' ;
import ReactDOM from 'react-dom' ;


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

// let arr = [
//     new Promise(() => {}),
//     new Promise(() => {}),
//     new Promise(() => {}),
// ] ;
//
// arr.map((item) => {
//     console.log(item) ;
// })

// 实例化一个Image对象
// 浏览器会将其识别为一个img元素
// var img = new Image() ;
// 给img元素添加src属性，即引入图片
// img.src = favImg ;

// createImg() ;

// var img = document.createElement('img') ;
// img.src = favImg ;
// // img.classList.add(style.favImage) ;
//
// img.classList.add('favImage') ;
// // img.setAttribute('src', favImg) ;
//
// var divElement = document.querySelector('.root') ;
// // divElement.appendChild(img) ;
//
// // 输出的打包之后图片的文件名
// console.log(favImg) ;
//
// new Content() ;
// new Header() ;
// new Sidebar() ;

// console.log('hello world 你好，世界！！') ;

// var contentHTML = `
//     <div class="buttonContainer">
//         <button id="btn">点击</button>
//     </div>
// ` ;
//
// var body = document.querySelector('body') ;
//
// body.insertAdjacentHTML('beforeend', contentHTML) ;
//
// var button = document.querySelector("#btn") ;
//
// button.addEventListener('click', function(e) {
//
//     var div = document.querySelector('.buttonContainer') ;
//     console.log(div) ;
//     div.insertAdjacentHTML('beforeend', `<div>ITEM</div>`) ;
// })

// import counter from './counter'
// import number from './numbers'
//
//
//
// counter() ;
// number() ;

// 启用了HMR
// if (module.hot) {
//     // 第一个参数是依赖项，也就是要监视哪个文件
//     // 第二个参数是回调函数，表示监视的文件一旦发生变化，就执行回调函数
//     module.hot.accept('./numbers', () => {
//         number() ;
//     })
// }