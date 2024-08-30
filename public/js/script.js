fetch('/')
    .then(response => response.json())
    .then(dados => {
        const html = document.querySelector('#main');
        dados.forEach(dado => {
            
        });
    });