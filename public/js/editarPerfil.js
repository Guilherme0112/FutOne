document.addEventListener('DOMContentLoaded', function(){
    const delConta = document.querySelector('#delConta');
    const delContaCriador = document.querySelector('#delContaCriador');
    const dialog = document.querySelector('dialog');
    const dialogSim = document.querySelector('#sim');
    const dialogNao = document.querySelector('#nao');

    // Requisição para deletar conta

    delConta.addEventListener('click', function(){
            dialog.showModal();

            // Se o usuário confirmar que desejar apagar a conta

            dialogSim.addEventListener('click', function(){
                var confirmPass = document.getElementById('senha').value;

                fetch('/perfil/editar',{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        conta: true,
                        senha: confirmPass
                    })
                })
                .then(response => response.json())
                .then(resposta => {
                    if(resposta.status === 200){
                        window.location = resposta.redirect;
                    } else if(resposta.status === 250){
                        document.querySelector('#erro').textContent = "A senha está incorreta";
                    }
                })
            })

            // Se ele cancelar

            dialogNao.addEventListener('click', function(){
                dialog.close();
            })
 
    })
})