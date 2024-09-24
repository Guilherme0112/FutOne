document.addEventListener('DOMContentLoaded', function() {
    const dialog = document.querySelector('dialog');
    const dialogConfirm = document.querySelector('#yes');
    const dialogNao = document.querySelector('#nao');
    const buttonsDelete = document.querySelectorAll('#delBtn');
    const buttonsEdit = document.querySelectorAll('#editBtn');

    // Redirecionar para editar postagem com js
    buttonsEdit.forEach(buttonEdit => {
        buttonEdit.addEventListener('click', function(){
            const divPai = buttonEdit.parentElement;
            const dataId = divPai.getAttribute('data-id');

            window.location = "/post/editar/" + dataId; 
        })
    })

    buttonsDelete.forEach(buttonDelete => {
        buttonDelete.addEventListener('click', function(event){
            dialog.showModal();
            dialogConfirm.addEventListener('click', function() {

                const divPai = buttonDelete.parentElement;
                const dataId = divPai.getAttribute('data-id');
    
                // console.log(dataId);
    
                fetch('/post/deletar', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: dataId
                    })
                })
                .then(response => response.json())
                .then(resposta => {
                    if(resposta.status === 200){         
                        divPai.style.animation = "delete 2s ease-in-out";
                        setTimeout(() => {
                            divPai.remove();
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
            dialogNao.addEventListener('click', function() {
                dialog.close();
            })
        });
    });
});