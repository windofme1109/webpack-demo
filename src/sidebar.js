function Sidebar() {
    var divElement = document.querySelector('.root') ;
    var htmlContent = `<div>Sidebar</div>` ;
    divElement.insertAdjacentHTML('afterbegin', htmlContent)

}

module.exports = Sidebar ;