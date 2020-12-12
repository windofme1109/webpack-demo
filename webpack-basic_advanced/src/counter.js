export default function counter() {
    var html = `<div id="counter">1</div>` ;
    document.body.insertAdjacentHTML('beforeend', html) ;

    var div = document.querySelector('#counter') ;

    div.addEventListener('click', function () {
        var num = div.innerHTML ;
        div.innerHTML = parseInt(num, 10) + 1 ;
    })
}