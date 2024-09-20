document.addEventListener('DOMContentLoaded', function(){
    const delConta = document.querySelector('#delConta');
    const delContaCriador = document.querySelector('#delContaCriador');
    const dialog = document.querySelector('dialog');
    const dialogSim = document.querySelector('#sim');
    const dialogNao = document.querySelector('#nao');

    // Requisição para deletar conta

    delConta.addEventListener('click', function(){
            dialog.showModal();
            document.getElementById('html').style.filter = "brightness(60%)";

            // Se o usuário confirmar que desejar apagar a conta

            dialogSim.addEventListener('click', function(){
                var confirmPass = document.getElementById('senha').value;

                fetch('/perfil/deletarConta',{
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
                    } else {
                        document.querySelector('#erro').textContent = resposta.status;
                    }
                })
            })

            // Se ele cancelar

            dialogNao.addEventListener('click', function(){
                dialog.close();
                document.getElementById('html').style.filter = "none";
            })
 
    });

    // Preview da imagem

    const img = document.querySelector('#img');
    const imgPreview = document.querySelector('#img-preview');

    img.addEventListener('change', function(){
        const img = this.files[0];

        if(img){
            const tiposDeImagem = ['image/jpeg', 'image/png', 'image/jpg'];
            const tipoImagem = img.type;
        
            if (!tiposDeImagem.includes(tipoImagem)){
                document.querySelector('#erro').textContent = "Somente imagens do tipo: PNG, JPEG e JPG são aceitas";
            } else {
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    imgPreview.src = event.target.result;
                };
                document.querySelector('#erro').textContent = "";
                reader.readAsDataURL(img);
                document.getElementById('img-preview').style.display = "block";
                }
        }
    })
})