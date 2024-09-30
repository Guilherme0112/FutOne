// Lógica de inserção de comentários com AJAX, é no arquivo post.js

document.addEventListener("DOMContentLoaded", function(){

    // Pega o id da url

    const url = window.location.pathname;
    const regex = /\d+$/;
    const match = url.match(regex);
    const postId = match[0];

    var like = document.querySelector('#like');

    // Sistema de likes

    if(like){    
        like.addEventListener('click', function(){
            fetch('/like', {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    idPost: postId
                })
            })
            .then(response => response.json())
            .then(resposta => {
                if(resposta.status == 200 || resposta.status == 201){
                    if(like.classList.contains('fa-regular')){
                        like.classList.add('fa-solid');
                        like.classList.remove('fa-regular');
                    } else if (like.classList.contains('fa-solid')){
                        like.classList.add('fa-regular');
                        like.classList.remove('fa-solid');

                    }
                }
                   
            })
            .catch(error => {
                console.log(error)
            })
        }) 
    } 
});