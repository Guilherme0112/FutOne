document.addEventListener('DOMContentLoaded', function(){

    // Preview da imagem da postagem

    const imagemInput = document.querySelector('#foto');
    const imagemPreview = document.querySelector('#imgPreview');
    imagemInput.addEventListener('change', function() {
        
        const imagemInput = this.files[0];
        if (imagemInput) {
            const tiposDeImagem = ['image/jpeg', 'image/png', 'image/jpg'];
            const tipoImagem = imagemInput.type;
        
            if (!tiposDeImagem.includes(tipoImagem)){
                document.querySelector('#erro').textContent = "Somente imagens do tipo: PNG, JPEG e JPG são aceitas";
            } else {
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagemPreview.src = event.target.result;
                };
                document.querySelector('#erro').textContent = "";
                reader.readAsDataURL(imagemInput);
            }
        }   
    })

    // Preview do título da postagem

    const h1Input = document.querySelector('#titulo');
    const h1Preview = document.querySelector('#h1-preview');
    h1Input.addEventListener('input', function(){
        var h1Input = this.value;
        h1Preview.textContent = h1Input;
    })

    // Preview da postagem 

    const pInput = document.querySelector('#assunto');
    const pPreview = document.querySelector('#p-preview');
    pInput.addEventListener('input', function(){
        var pInput = this.value;
        pPreview.textContent = pInput;
    })
})