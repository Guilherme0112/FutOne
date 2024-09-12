document.addEventListener("DOMContentLoaded", function(){
    var form = document.querySelector('#form');
    form.addEventListener('submit', function(e){    
        e.preventDefault();

        // Pega o id da url

        const url = window.location.pathname;
        const regex = /\d+$/;
        const match = url.match(regex);
        const postId = match[0];

        console.log(postId)

        // Envia os dados para o back-end

        var comentario = document.querySelector("#input-text").value;

        console.log(comentario)
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
            console.log("Sucesso ", dado);
        })
        .catch(error => {
            console.log("Erro ", error)
        });
    });
});
