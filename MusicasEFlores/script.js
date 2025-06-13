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

// Adiciona um "ouvinte" de evento ao link do coração
document.getElementById('draw-heart-button').addEventListener('click', (event) => {
    event.preventDefault(); // Impede que o link navegue para "#"
    drawHeart();
});

function drawHeart() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');

    // Ajusta o tamanho do canvas para preencher a tela
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Funções matemáticas (tradução direta do Python)
    function hearta(k) {
        return 15 * Math.sin(k) ** 3;
    }

    function heartb(k) {
        return 12 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k);
    }

    // Centraliza o desenho
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    // Configurações do desenho
    ctx.strokeStyle = "#f73487"; // Cor da linha
    ctx.lineWidth = 2; // Espessura da linha
    ctx.beginPath();

    // Loop para desenhar o coração
    // Usamos requestAnimationFrame para uma animação mais suave
    let i = 0;
    function animate() {
        if (i >= 628) { // 2 * PI * 100, um ciclo completo
            // Opcional: fazer o coração desaparecer após um tempo
            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 2000);
            return;
        };

        const x = hearta(i / 100) * 20;
        const y = heartb(i / 100) * 20;

        // O moveTo vai para o ponto inicial, o lineTo desenha a partir dele
        if (i === 0) {
            ctx.moveTo(offsetX + x, offsetY - y); // O eixo Y do canvas é invertido
        } else {
            ctx.lineTo(offsetX + x, offsetY - y);
        }

        ctx.stroke(); // Desenha a linha
        i++;
        requestAnimationFrame(animate); // Chama a função novamente no próximo frame
    }
    
    animate(); // Inicia a animação
}


// Função para o botão de tema (já que estava no seu HTML original)
function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")
}