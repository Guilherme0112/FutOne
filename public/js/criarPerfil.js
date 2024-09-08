// Máscara do CPF

document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.querySelector('#cpf');
  
    cpfInput.addEventListener('input', function(event) {
      let cpf = event.target.value; 

      cpf = cpf.replace(/\D/g, '');
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

      cpfInput.value = cpf; 
    });

  });

