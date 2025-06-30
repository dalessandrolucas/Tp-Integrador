// Obtener elementos del formulario
const form = document.querySelector('.form_registro');
const emailInput = form.querySelector('input[name="email"]');
const userInput = form.querySelector('input[name="user"]');
const enviarBtn = document.getElementById('btn-login');
const errorMensaje = document.getElementById('error-mensaje');

// Ocultar mensaje de error al inicio
errorMensaje.style.display = "none";

// Función para validar formato de email
function esEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

// Función para verificar si los campos están completos y válidos
function checkInputs() {
  const emailVal = emailInput.value.trim();
  const userVal = userInput.value.trim();

  const emailValido = esEmail(emailVal);

  if (emailVal !== '' && userVal !== '' && emailValido) {
    enviarBtn.disabled = false;
    errorMensaje.style.display = "none"; // Limpiar mensaje
  } else {
    enviarBtn.disabled = true;

    // Mensaje de error en tiempo real
    if (emailVal !== '' && !emailValido) {
      errorMensaje.textContent = "El formato del email es inválido.";
      errorMensaje.style.display = "block";
    } else {
      errorMensaje.style.display = "none";
    }
  }
}

// Validar en tiempo real mientras se escribe
emailInput.addEventListener('input', checkInputs);
userInput.addEventListener('input', checkInputs);

// Al enviar el formulario
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const emailVal = emailInput.value.trim();
  const userVal = userInput.value.trim();

  if (emailVal === '' || userVal === '') {
    errorMensaje.textContent = "Por favor complete ambos campos.";
    errorMensaje.style.display = "block";
    return;
  }

  if (!esEmail(emailVal)) {
    errorMensaje.textContent = "El formato del email es inválido.";
    errorMensaje.style.display = "block";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const encontrado = usuarios.find(
    u => u.usuario === userVal && u.email === emailVal
  );

  if (encontrado) {
    errorMensaje.textContent = "Se enviará un email para recuperar la contraseña.";
    errorMensaje.style.color = "white";
    errorMensaje.style.fontSize = "1em";
    errorMensaje.style.display = "block";
    enviarBtn.style.backgroundColor = "green";
    // form.submit(); // Simular envío o continuar flujo real
    setTimeout(() => {
      window.location.href = "index.html"; // Cambiá la URL según necesites
    }, 2000);
    
  } else {
    errorMensaje.textContent = "El usuario y el email no coinciden con ningún registro.";
    errorMensaje.style.display = "block";
  }
});

// Deshabilitar el botón al inicio
enviarBtn.disabled = true;
