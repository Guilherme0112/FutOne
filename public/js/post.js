document.addEventListener("DOMContentLoaded", function(){
    var form = document.querySelector('#form');
    form.addEventListener('submit', function(e){   
        document.getElementById('load').style.display = "block"; 
        e.preventDefault();
        
        // Pega o id da url

        const url = window.location.pathname;
        const regex = /\d+$/;
        const match = url.match(regex);
        const postId = match[0];

        // Envia os dados para o back-end

        var comentario = document.querySelector("#input-text").value;
        fetch(`/comentarioAdd`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: comentario,
                idPost: postId
            })
          })
        .then(response => response.json())
        .then(dado => {

            // Atualiza adicionando o comentário que o usuário acabou de fazer

            const divPaiComentarios = document.querySelector('#comentarios');

        // console.log(dado.comentarioSQL[0]);

  // Insere o novo elemento antes do segundo elemento
  
            const boxComment = document.createElement('div');
            boxComment.classList.add('box-comment');
            divPaiComentarios.children[1].insertAdjacentElement('afterbegin', boxComment);

            const boxComment2 = document.createElement('div');
            boxComment2.classList.add('box-comment-2');
            boxComment.appendChild(boxComment2);

            const imgComment = document.createElement('img');
            imgComment.src = dado.comentarioSQL[0].foto;
            imgComment.classList.add('img-comment');
            boxComment2.appendChild(imgComment);
            
            const nameUser = document.createElement('p');
            nameUser.textContent = dado.comentarioSQL[0].nome;
            nameUser.classList.add('name-user-comment');
            boxComment2.appendChild(nameUser);
            
            const comment = document.createElement('p');
            comment.textContent = dado.comentarioSQL[0].comentario;
            comment.classList.add('text-comment');
            boxComment2.appendChild(comment);
            
            const timeComment = document.createElement('p');
            const dataFormatada = new Date(dado.comentarioSQL[0].criado).toLocaleDateString('pt-BR');
            timeComment.textContent = dataFormatada;
            timeComment.classList.add('time-comment');
            boxComment.appendChild(timeComment);
            
            document.getElementById('load').style.display = "none"; 
            document.querySelector('#input-text').value = "";
        })
        .catch(error => {
            console.log("Erro ", error)
        });
    });
});
