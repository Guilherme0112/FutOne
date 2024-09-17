document.addEventListener('DOMContentLoaded', function(){
    const delConta = document.querySelector('#delConta');
    const delContaCriador = document.querySelector('#delContaCriador');

    // Requisição para deletar conta
    delConta.addEventListener('click', function(){
        fetch('/perfil/editar',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                conta: true
            })
        })
        .then(response => response.json())
        .then(resposta => {
            if(resposta.status === 200){
                window.location = resposta.redirect;
            }
        })
    })
})