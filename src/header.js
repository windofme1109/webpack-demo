function Header() {
    var divElement = document.querySelector('.root') ;
    var htmlContent = `<div>Header</div>` ;
    divElement.insertAdjacentHTML('afterbegin', htmlContent)
}

module.exports = Header ;