export default function number() {

    var html = `<div id="number">800</div>` ;
    var div = document.querySelector('#number') ;

    // 保证页面只有一个div#number
    if (div) {
        div.parentElement.removeChild(div) ;
    }

    document.body.insertAdjacentHTML('beforeend', html) ;
}