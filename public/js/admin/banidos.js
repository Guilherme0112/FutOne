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
            console.log(resposta)
        })
        .catch(err => {
            console.log(err)
        })
    })
})