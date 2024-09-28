document.addEventListener('DOMContentLoaded', function(){
    const btn = document.querySelector('#send');

    btn.addEventListener('click', function(){
        var email = document.querySelector('#email').value;

        fetch('/admin/banidos', {
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
            const divPaiBox = document.querySelector('.banidos');

            const divPai = document.createElement('div');
            divPai.classList.add('box-user');
            divPai.dataset.id = resposta.verifyEmail[0].id;
            
            const name = document.createElement('p');
            name.textContent = resposta.verifyEmail[0].email;
            name.classList.add('name-user')
            
            const btn = document.createElement('button');
            btn.id = "del-user";
            btn.title = "Desbanir";

            divPaiBox.appendChild(divPai);
            divPai.appendChild(name);
            divPai.appendChild(btn);

        })
        .catch(err => {
            console.log(err)
        })
    })
})