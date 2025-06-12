function toggleMode() {
    const html = document.documentElement
        html.classList.toggle('light')
        //pegar a tag img
    //const img = document.querySelector("#profile jpg")

    if(html.classList.contains('light')) {
        //se tiver light mode, adicionar a imagem light
        img.setAttribute("src", ".assets/beijinho.jpg")
        img.setAttribute('alt', '')


    }else {
        //se tiver sem light mode, manter a img normal
        img.setAttribute("src", ".assets/abraco.jpg")
        img.setAttribute('alt', '')
        //pegar a tag img


        //substituir a img
    }

}