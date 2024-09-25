document.addEventListener('DOMContentLoaded', function() {
    const dialog = document.querySelector('dialog');
    const dialogConfirm = document.querySelector('#yes');
    const dialogNao = document.querySelector('#nao');
    const buttonsDelete = document.querySelectorAll('#delBtn');
    const buttonsEdit = document.querySelectorAll('#editBtn');
    const dialogEditar = document.querySelector('#editar');
    const dialogEditarClose = document.querySelector('#close');

    // Redirecionar para editar postagem com js
    buttonsEdit.forEach(buttonEdit => {
        buttonEdit.addEventListener('click', function(){   

            // Pega as informações da postagem onde o botão foi clicado
            const divPaiEdit = buttonEdit.parentElement;

            const img = divPaiEdit.querySelector('.img-not-perfil').src;
            var titulo = divPaiEdit.querySelector('.box-desc-perfil').textContent;
            const assunto = divPaiEdit.querySelector('#box-assunto').value;
            const postId = divPaiEdit.getAttribute('data-id');
            
            // Coloca os valores nos campos de edição
            // Inputs
            titulo = titulo.replace(/\s{3,}/g, ' ');
            document.querySelector('#titulo').value = titulo;
            document.querySelector('#assunto').value = assunto;

            // Preview
            document.querySelector('#imgPreview').src = img;
            document.querySelector('#h1-preview').textContent = titulo;
            document.querySelector('#p-preview').textContent = assunto;
            
            // Abre a dialog com os dados da postagem 
            dialogEditar.showModal();

            // Requisição para atualizar postagem
            var form2 = document.querySelector('#form2');
            form2.addEventListener('submit', function(event){
                event.preventDefault();

                // Dados do formulário
                var formData = new FormData(form2);
                formData.append('id', postId);

                // Enviando requisição
                fetch('/post/editar',{
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(resposta => { 
                    if(resposta.status != 200){

                        document.querySelector('.erro-dialog').textContent = resposta.status;
                    } else {

                        dialogEditar.close();
                        location.reload();
                    }

                })
                .catch(err => {
                    console.log(err)
                })
            })
        })

        // Fechar dialog
        dialogEditarClose.addEventListener('click', function(){
            dialogEditar.close();
        })
    })

    // Botão para deletar postagem
    buttonsDelete.forEach(buttonDelete => {

        // Abre modal e pergunta se o usuário quer apagar o post
        buttonDelete.addEventListener('click', function(event){
            dialog.showModal();
            dialogConfirm.addEventListener('click', function() {

                // Pega o id do post
                const divPaiDel = buttonDelete.parentElement;
                const dataId = divPaiDel.getAttribute('data-id');
    
                // Faz a requisição para deletar a postagem
                fetch('/post/deletar', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: dataId
                    })
                })

                // Resposta do servidor
                .then(response => response.json())
                .then(resposta => {
                    if(resposta.status === 200){         
                        divPaiDel.style.animation = "delete 2s ease-in-out";
                        setTimeout(() => {
                            divPaiDel.remove();
                        }, 2000);
                       
                    } else {
                        console.log(resposta)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                dialog.close();
            })

            // Fecha a dialog caso clique no X da dialog
            dialogNao.addEventListener('click', function() {
                dialog.close();
            })
        });
    });
});