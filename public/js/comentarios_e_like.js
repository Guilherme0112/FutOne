// Lógica de inserção de comentários com AJAX, é no arquivo post.js

document.addEventListener("DOMContentLoaded", function(){

    // Pega o id da url

    const url = window.location.pathname;
    const regex = /\d+$/;
    const match = url.match(regex);
    const postId = match[0];

    const like = this.querySelector('#like');
    const dislike = this.querySelector('#dislike');

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
                if(resposta.status === 200 || resposta.status === 201){
                    if(like.classList.contains('fa-regular')){
                        like.classList.toggle('fa-solid');
                    } else if (like.classList.contains('fa-solid')){
                        like.classList.toggle('fa-regular');
                    }
                    if(document.querySelector('#dislike').classList.contains('fa-solid')){
                        document.querySelector('#dislike').classList.add('fa-regular');
                        document.querySelector('#dislike').classList.remove('fa-solid');
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })
        }) 
    }

    // Sistema de dislikes


        if(dislike){
            dislike.addEventListener('click', function(){
            fetch('/dislike', {
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
                // console.log(resposta);
                if(resposta.status === 200 || resposta.status === 201){
                    if(dislike.classList.contains('fa-regular')){
                        dislike.classList.toggle('fa-solid');
                    } else if (dislike.classList.contains('fa-solid')){
                        dislike.classList.toggle('fa-regular');
                    }
                    if(document.querySelector('#like').classList.contains('fa-solid')){
                        document.querySelector('#like').classList.add('fa-regular');
                        document.querySelector('#like').classList.remove('fa-solid');
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })
        })
    } 
});