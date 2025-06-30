const usuario = document.getElementById("usuario");
const password = document.getElementById("password");
const loginButton = document.getElementById("btn-login");
const form = document.getElementById("form_registro");
document.getElementById('error-mensaje').style.display = "none";
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
    document.getElementById('error-mensaje').style.display = "block";
    document.getElementById('error-mensaje').style.color = "white";
    document.getElementById('error-mensaje').textContent = "¡Inicio de sesión exitoso!";
    document.getElementById('btn-login').style.backgroundColor = "green";
    document.getElementById('btn-login').style.color = "white";

    setTimeout(() => {
        window.location.href = "./vista_principal.html"; // Ruta de redirección
    }, 2000);

  } else {
    document.getElementById('error-mensaje').style.display = "block";
    document.getElementById('error-mensaje').textContent = "Usuario o contraseña incorrectos.";
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