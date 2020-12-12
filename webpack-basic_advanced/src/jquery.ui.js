export function ui() {
    // 模块的 this 指向的是自身，不是window
    // false
    console.log(this === window);
    $('body').css('background', _join(['hot', 'pink'], ''));
}