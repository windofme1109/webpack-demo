import favImg from "./09.jpg";

// 配置了css-loader的options中的modules为true
// 表示引入的css只作用于当前模块
// 因此引入的方式也要改变，如下所示
// import style from './index.css' ;

export default function createImg() {

    var img = document.createElement('img') ;

    img.src = favImg ;

    // 使用style.favImg添加class，这样可以保证css只作用于当前模块
    img.classList.add('favImage') ;

    var divElement = document.querySelector('.root') ;

    divElement.appendChild(img) ;
}

