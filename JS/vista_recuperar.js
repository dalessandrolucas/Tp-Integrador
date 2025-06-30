const form = document.querySelector('.form_registro');
const emailInput = form.querySelector('input[name="email"]');
const userInput = form.querySelector('input[name="user"]');
const enviarBtn = document.getElementById('btn-login');

// Habilitar/deshabilitar el botón según los campos
function checkInputs() {
  if (emailInput.value.trim() !== '' && userInput.value.trim() !== '') {
    enviarBtn.disabled = false;
  } else {
    enviarBtn.disabled = true;
  }
}

emailInput.addEventListener('input', checkInputs);
userInput.addEventListener('input', checkInputs);

// Validar email y usuario contra localStorage al enviar
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const encontrado = usuarios.find(
    u => u.usuario === userInput.value && u.email === emailInput.value
  );
  if (encontrado) {
    alert("Se enviará un email para recuperar la contraseña.");
    // Aquí podrías redirigir o continuar el flujo
    form.submit();
  } else {
    alert("El usuario y el email no coinciden con ningún registro.");
  }
});

// Inicialmente deshabilitado
enviarBtn.disabled = true;