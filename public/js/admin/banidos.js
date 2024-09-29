document.addEventListener('DOMContentLoaded', function () {

    // Desbanir
    var btns = document.querySelectorAll('#desban');

    btns.forEach(btn => {
        btn.addEventListener('click', function () {

            var divPai = btn.parentElement;
            var emailDesBan = divPai.getAttribute('data-email');

            fetch('/admin/banidos', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailDesBan
                })
            })
                .then(response => response.json())
                .then(resposta => {
                    divPai.remove();
                    console.log(resposta)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    })

    // Buscar e-mail
    document.querySelector('.banidos').addEventListener('click', function (event) {
        if (event.target.id = "banidos") {

            var email = document.querySelector('#email').value;

            fetch('/admin/show/banidos', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
                })
            })
                .then(response => response.json())
                .then(resposta => {

                    if (resposta.status == 200) {

                        // Remove todos os elementos da tela
                        document.querySelectorAll('.box.desbanido').forEach(box => {
                            box.remove();
                        })

                        // Cria elemento na tela
                        var divPai = document.createElement('div');
                        divPai.classList.add('box-desbanido');
                        divPai.setAttribute('data-email', resposta.sqlSearch[0].email);

                        var labelEmail = document.createElement('label');
                        labelEmail.textContent = "Email";

                        var p = document.createElement('p');
                        p.textContent = resposta.sqlSearch[0].email;

                        var labelMotivo = document.createElement('label');
                        labelMotivo.textContent = "Motivo";

                        var pM = document.createElement('p');
                        pM.textContent = resposta.sqlSearch[0].motivo;

                        var button = document.createElement('button');
                        button.id = 'desban';
                        button.textContent = 'Desbanir';

                        document.querySelector('.banidos').appendChild(divPai);
                        divPai.appendChild(labelEmail);
                        divPai.appendChild(p);
                        divPai.appendChild(labelMotivo);
                        divPai.appendChild(pM);
                        divPai.appendChild(button);
                        document.querySelector('.erro').textContent = "";

                    } else {

                        document.querySelector('.erro').textContent = resposta.status;
                    }

                    console.log(resposta)

                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
})