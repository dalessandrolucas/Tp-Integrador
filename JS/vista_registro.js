const form = document.getElementById('registrationForm');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const email = document.getElementById('email');
const usuario = document.getElementById('usuario');
const contrasena = document.getElementById('contrasena');
const repetirContrasena = document.getElementById('repetir-contrasena');
const numeroTarjeta = document.getElementById('numero-tarjeta');
const codigoTarjeta = document.getElementById('codigo-tarjeta');
const confirmarBtn = document.getElementById('confirmar');
const cancelarBtn = document.getElementById('cancelar');

// Limitar input del código de tarjeta a solo números y máximo 3 dígitos
codigoTarjeta.addEventListener('input', function () {
  // Reemplazar todo lo que no sea número
  this.value = this.value.replace(/\D/g, '');

  // Cortar si se excede de 3 caracteres
  if (this.value.length > 3) {
    this.value = this.value.slice(0, 3);
  }
});

// Limitar input de número de tarjeta a 16 dígitos numéricos
numeroTarjeta.addEventListener('input', function () {
  // Quitar caracteres no numéricos
  this.value = this.value.replace(/\D/g, '');

  // Limitar a 16 dígitos
  if (this.value.length > 16) {
    this.value = this.value.slice(0, 16);
    document.getElementById('error-numero-tarjeta').textContent = "Solo se permiten hasta 16 dígitos.";
  } else {
    document.getElementById('error-numero-tarjeta').textContent = "";
  }
});

// Validaciones regex
function soloLetras(valor) {
  return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(valor);
}
function soloLetrasYNumeros(valor) {
  return /^[A-Za-z0-9]+$/.test(valor);
}
function esEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}
function validarContrasena(valor) {
  const letras = valor.match(/[A-Za-z]/g) || [];
  const numeros = valor.match(/[0-9]/g) || [];
  const especiales = valor.match(/[^A-Za-z0-9]/g) || [];
  return valor.length >= 8 && letras.length >= 2 && numeros.length >= 2 && especiales.length >= 2;
}
function validarCodigoTarjeta(valor) {
  return /^[0-9]{3}$/.test(valor) && valor !== "000";
}
function validarNumeroTarjeta(valor) {
  if (!(/^\d{16}$/.test(valor))) 
    return false;
  const numeros = valor.split('').map(Number);
  const suma = numeros.slice(0, 15).reduce((a, b) => a + b, 0);
  const ultimo = numeros[15];
  // Si suma es impar, último debe ser par. Si suma es par, último debe ser impar.
  return (suma % 2 === 0 && ultimo % 2 === 1) || (suma % 2 === 1 && ultimo % 2 === 0);
}

// Mostrar/ocultar campos de pago según método
function mostrarCamposPago() {
  document.getElementById('debito-fields').style.display = document.getElementById('debito').checked ? 'block' : 'none';
  document.getElementById('cupon-fields').style.display = document.getElementById('cupon').checked ? 'flex' : 'none';
  document.getElementById('transferencia-fields').style.display = document.getElementById('transferencia').checked ? 'flex' : 'none';
}
['debito', 'cupon', 'transferencia'].forEach(id => {
  document.getElementById(id).addEventListener('change', mostrarCamposPago);
});
window.addEventListener('DOMContentLoaded', mostrarCamposPago);

// Validar campos y mostrar mensajes de error
function validarCampos() {
  let valido = true;

  // Nombre
  if (nombre.value.trim() === "") {
    document.getElementById('error-nombre').textContent = "El nombre es obligatorio.";
    valido = false;
  } else if (!soloLetras(nombre.value)) {
    document.getElementById('error-nombre').textContent = "El nombre solo puede contener letras.";
    valido = false;
  } else {
    document.getElementById('error-nombre').textContent = "";
  }

  // Apellido
  if (apellido.value.trim() === "") {
    document.getElementById('error-apellido').textContent = "El apellido es obligatorio.";
    valido = false;
  } else if (!soloLetras(apellido.value)) {
    document.getElementById('error-apellido').textContent = "El apellido solo puede contener letras.";
    valido = false;
  } else {
    document.getElementById('error-apellido').textContent = "";
  }

  // Email
  if (email.value.trim() === "") {
    document.getElementById('error-email').textContent = "El email es obligatorio.";
    valido = false;
  } else if (!esEmail(email.value)) {
    document.getElementById('error-email').textContent = "El formato del email es inválido.";
    valido = false;
  } else {
    document.getElementById('error-email').textContent = "";
  }

  // Usuario
  if (usuario.value.trim() === "") {
    document.getElementById('error-usuario').textContent = "El usuario es obligatorio.";
    valido = false;
  } else if (!soloLetrasYNumeros(usuario.value)) {
    document.getElementById('error-usuario').textContent = "El usuario solo puede contener letras y números.";
    valido = false;
  } else {
    document.getElementById('error-usuario').textContent = "";
  }

  // Contraseña
  if (contrasena.value.trim() === "") {
    document.getElementById('error-contrasena').textContent = "La contraseña es obligatoria.";
    valido = false;
  } else if (!validarContrasena(contrasena.value)) {
    document.getElementById('error-contrasena').textContent = "Debe tener al menos 8 caracteres, 2 letras, 2 números y 2 caracteres especiales.";
    valido = false;
  } else {
    document.getElementById('error-contrasena').textContent = "";
  }

  // Repetir contraseña
  if (repetirContrasena.value.trim() === "") {
    document.getElementById('error-repetir-contrasena').textContent = "Debes repetir la contraseña.";
    valido = false;
  } else if (contrasena.value !== repetirContrasena.value) {
    document.getElementById('error-repetir-contrasena').textContent = "Las contraseñas no coinciden.";
    valido = false;
  } else {
    document.getElementById('error-repetir-contrasena').textContent = "";
  }

  // Método de pago: solo validar si está seleccionado débito
  const debito = document.getElementById('debito').checked;
  if (debito) {
    if (numeroTarjeta.value.trim() === "") {
      document.getElementById('error-numero-tarjeta').textContent = "El número de tarjeta es obligatorio.";
      valido = false;
    } else if (!validarNumeroTarjeta(numeroTarjeta.value)) {
      document.getElementById('error-numero-tarjeta').textContent = "Número inválido: deben ser 16 dígitos y cumplir la regla de suma y paridad.";
      valido = false;
    } else {
      document.getElementById('error-numero-tarjeta').textContent = "";
    }
    if (codigoTarjeta.value.trim() === "") {
      document.getElementById('error-codigo-tarjeta').textContent = "La clave es obligatoria.";
      valido = false;
    } else if (!validarCodigoTarjeta(codigoTarjeta.value)) {
      document.getElementById('error-codigo-tarjeta').textContent = "Clave inválida: deben ser 3 dígitos y no puede ser 000.";
      valido = false;
    } else {
      document.getElementById('error-codigo-tarjeta').textContent = "";
    }
  } else {
    document.getElementById('error-numero-tarjeta').textContent = "";
    document.getElementById('error-codigo-tarjeta').textContent = "";
  }

  // Habilitar o deshabilitar el botón
  confirmarBtn.disabled = !valido;
  return valido;
}

// Validar en cada input en tiempo real
[nombre, apellido, email, usuario, contrasena, repetirContrasena, numeroTarjeta, codigoTarjeta].forEach(input => {
  input.addEventListener('input', validarCampos);
});
['debito', 'cupon', 'transferencia'].forEach(id => {
  document.getElementById(id).addEventListener('change', validarCampos);
});

// Guardar usuario al confirmar
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (validarCampos()) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({
      usuario: usuario.value,
      password: contrasena.value,
      email: email.value,
      nombre: nombre.value,
      apellido: apellido.value
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    window.location.href = "index.html"; // Redirige al login
  }
});

// Cancelar
cancelarBtn.addEventListener('click', function() {
  window.location.href = "index.html";
});