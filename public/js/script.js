// Função para criar a estrutura da postagem

function criarEstruturaPost(id, foto, titulo, container) {

    const link = document.createElement('a');
    link.href = `/post/${id}`;
    link.classList.add('box-not');

    const imagem = document.createElement('img');
    imagem.src = foto;
    imagem.classList.add('img-not');

    const descricao = document.createElement('p');
    descricao.classList.add('desc-not');
    descricao.textContent = titulo;

    link.appendChild(imagem);
    link.appendChild(descricao);
    container.appendChild(link);
}

// Função que busca os dados para a rolagem infinita

let page = 1
let carregando = false;

function buscarDados() {
    if (carregando) return;
    carregando = true;

    document.getElementById('load').style.display = "block";
    
    fetch(`/load-data/page/${page}`)
        .then(response => response.json())
        .then(dados => {
            if (dados.length === 0) {

                document.getElementById('load').style.display = "none";
                return false;
            }
            
            var container = document.querySelector('#main');
            dados.forEach(dado => {
                criarEstruturaPost(dado.id, dado.foto, dado.titulo, container);
            });
            page++;
            document.getElementById('load').style.display = "none";
            carregando = false;
        });
}

buscarDados();

// Evento que dispara quando o usuário chega ao final da página

window.addEventListener('scroll', function(){

    const alturaViewPort = window.innerHeight;
    const alturaPagina = document.documentElement.scrollHeight;
    const scrollada = window.scrollY; /* Verifica quanto o usuário já scrollou */

    if (alturaViewPort + scrollada >= alturaPagina) {
        buscarDados();
    }
});