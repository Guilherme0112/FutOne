document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('#send');

    // Exibir postagem
    btn.addEventListener('click', function () {
        var postId = document.querySelector('#post').value;

        fetch('/admin/postagem/deletar', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId
            })
        })
            .then(response => response.json())
            .then(resposta => {
                if (resposta.status != 200) {
                    document.querySelector(".erro").textContent = resposta.status;
                    return false;
                }
                if (document.querySelector('.box-admin-post')) {
                    document.querySelector('.box-admin.post').remove();
                }

                const divPai = document.querySelector('.banidos');

                const divFilho = document.createElement('div');
                divFilho.classList.add('box-admin-post')
                divFilho.dataset.id = resposta.sql[0].id;

                const img = document.createElement('img');
                img.src = "../../" + resposta.sql[0].foto;
                img.classList.add('img')

                const link = document.createElement('a');
                link.href = `/post/${resposta.sql[[0]].id}`;
                link.textContent = resposta.sql[0].titulo;
                link.classList.add('link')

                const button = document.createElement('button');
                button.classList.add('button')
                button.id = "button"

                divPai.appendChild(divFilho);
                divFilho.appendChild(img);
                divFilho.appendChild(link);
                divFilho.appendChild(button);

                document.querySelector(".erro").textContent = "";
            })
            .catch(err => {
                console.log(err)
            })
    })

    // Requisição para deletar postagem
    document.querySelector('.banidos').addEventListener('click', function (event) {
        if(event.target.id != 'button') {
            return false;
        }

        const button = event.target;
        const divPaiButton = button.parentElement;
        const idPost = divPaiButton.getAttribute('data-id');

        const dialog = document.querySelector('dialog');
        dialog.showModal();

        
        // Requisição para enviar os dados
        document.querySelector('#yes').addEventListener('click', function () {

            // Pega o valor da input
            const motivo = document.getElementById('motivo').value;
            document.querySelector('#load').style.display = "block";

            // Requisição
            fetch('/admin/postagem/deletar', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    delPost: idPost,
                    motivo
                })
            })
                .then(response => response.json())
                .then(resposta => {

                    // Remove a postagem da tela
                    console.log(resposta);
                    dialog.close();
                    divPaiButton.remove();
                })
                .catch(err => {
                    console.log(err);
                    document.querySelector(".erro").textContent = "Erro ao deletar postagem. Se persistir, comunique a equipe de suporte";
                });
                document.querySelector('#load').style.display = "none";
        });
    });
})