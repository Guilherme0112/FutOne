document.addEventListener('DOMContentLoaded', function () {
    const btns = document.querySelectorAll('#marcar');

    btns.forEach(btn => {

        btn.addEventListener('click', function () {

            var divPai = btn.parentElement;
            var postId = divPai.getAttribute('data-denuncia');
            var userId = divPai.getAttribute('data-idUser');

            fetch('/admin/denuncias', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postId,
                    userId
                })
            })
            .then(response => response.json())
            .then(resposta => {
                console.log(resposta);
                if(resposta.status == 200){
                    btn.textContent = "Visto";
                    return false;
                }

                alert(resposta.status);
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
})