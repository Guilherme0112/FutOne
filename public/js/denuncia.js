document.addEventListener('DOMContentLoaded', function(){

    const url = window.location.pathname;
    const regex = /\d+$/;
    const match = url.match(regex);
    const postId = match[0];

    const modal = document.querySelector('#modal-denuncia');
    const denuncia = document.querySelector('#denuncia');
    
    denuncia.addEventListener('click', function(){
        modal.showModal();
        document.querySelector('#send').addEventListener('click', function(){
            const select = document.querySelector('#motivo').value

            fetch('/post/denuncia', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postId,
                    select
                })
            })
            .then(response => response.json())
            .then(resposta => {
                if(resposta.status != 200){
                    document.querySelector('.erro').textContent = resposta.status;
                    return false;
                }
                modal.close();
            })
            .catch(err => {
                console.log(err)
                modal.close();
            })
        })
        document.querySelector('#fechar').addEventListener('click', function(){
            modal.close();
        })
        
    })
})