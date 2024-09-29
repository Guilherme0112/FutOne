document.addEventListener('DOMContentLoaded', function(){
    const btn = document.querySelector('#search');
    btn.addEventListener('click', function(){
        var userId = document.querySelector('#id-conta').value;

        fetch('/admin/deletar/show', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: userId
            })
        })
        .then(response => response.json())
        .then(resposta => {

            if(resposta.verifyUser){

                // Remove as buscas anteriores da tela
                if(document.querySelector('.box-user')){
                    document.querySelectorAll('.box-user').forEach(box => {
                        box.remove();
                    })
                }
                
                // Cria a caixa de resposta
                const divPaiBox = document.querySelector('#res');

                const divPai = document.createElement('div');
                divPai.classList.add('box-user');
                divPai.dataset.id = resposta.verifyUser[0].id
                
                const name = document.createElement('p');
                name.textContent = resposta.verifyUser[0].nome;
                name.classList.add('name-user')
                
                const img = document.createElement('img');
                img.src = '../../' + resposta.verifyUser[0].foto;
                img.classList.add('img-user');

                const btn = document.createElement('button');
                btn.id = "del-user";
                btn.title = "Banir";

                divPaiBox.appendChild(divPai);
                divPai.appendChild(img);
                divPai.appendChild(name);
                divPai.appendChild(btn);

                document.querySelector('.erro').textContent = "";
            } else {
                document.querySelector('.erro').textContent = resposta.status;
            }
        })
        .catch(err => {
            console.log(err);
        })
    })

    // Evento que dispara requisição de deletar conta
    document.querySelector('#res').addEventListener('click', function(event) {
        if (event.target.id === 'del-user') {
            var divPai = event.target.parentElement;
            var idUser = divPai.getAttribute('data-id');

            document.querySelector('.modal').showModal();

            document.querySelector('#yes').addEventListener('click', function(){

                var motivo = document.querySelector('#causa').value;
                
                fetch('/admin/conta/deletar', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: idUser,
                        causa: motivo
                    })
                })
                .then(response => response.json())
                .then(resposta => {
                    if(resposta.status == 200){
                        divPai.remove();
                    }
                    console.log(resposta);
                    document.querySelector('.modal').close();
                })
                .catch(err => {
                    console.log(err);
                    document.querySelector('.modal').close();
                })
            })
        }
    });
})