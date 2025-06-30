const usuario = document.getElementById("usuario");
const password = document.getElementById("password");
const loginButton = document.getElementById("btn-login");
const form = document.getElementById("form_registro");

function checkInputs() {
  if (usuario.value.trim() !== '' && password.value.trim() !== '') {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

usuario.addEventListener('input', checkInputs);
password.addEventListener('input', checkInputs);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const encontrado = usuarios.find(
    u => u.usuario === usuario.value && u.password === password.value
  );
  if (encontrado) {
    // Guarda el usuario activo (solo el nombre de usuario)
    localStorage.setItem("usuarioActivo", encontrado.usuario);
    alert("¡Inicio de sesión exitoso!");
    window.location.href = "./vista_principal.html";
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
});

// (Opcional) Mostrar el último usuario registrado en el login
window.addEventListener('DOMContentLoaded', function() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuarios.length > 0) {
    const ultimo = usuarios[usuarios.length - 1];
    document.getElementById('info-usuario').innerHTML =
      `<strong>Último usuario registrado:</strong> ${ultimo.usuario} <br>
       <strong>Email:</strong> ${ultimo.email}`;
  }
});