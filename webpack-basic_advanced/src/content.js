function Content() {
    var divElement = document.querySelector('.root') ;
    var htmlContent = `<div>Content</div>` ;
    divElement.insertAdjacentHTML('afterbegin', htmlContent)
}

module.exports = Content ;