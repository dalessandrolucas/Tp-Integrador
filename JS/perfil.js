window.addEventListener('DOMContentLoaded', function() {
  const radioTarjeta = document.getElementById('radio-tarjeta');
  if (radioTarjeta.checked) {
    document.getElementById('grupo-tarjeta').style.display = 'block';
  }
  if (document.getElementById('radio-cupon').checked) {
    document.getElementById('grupo-cupon').style.display = 'block';
  }
  actualizarBotonGuardar();
});

if (!localStorage.getItem('usuario')) {
  localStorage.setItem('usuario', JSON.stringify({
    nombre: 'usuario123',
    email: 'usuario@gmail.com',
    avatar: 'assets/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.avif',
    metodoPago: '',
    datosPago: {}
  }));
}

let usuario = JSON.parse(localStorage.getItem('usuario'));
document.getElementById('usuario-nombre').textContent = `Nombre de usuario: ${usuario.nombre}`;
document.getElementById('usuario-email').textContent = `E-mail: ${usuario.email}`;
document.getElementById('avatar-img').src = usuario.avatar;

function mostrarCamposMetodoPago() {
  const metodo = document.querySelector('input[name="metodo"]:checked');
  if (metodo) {
    document.getElementById('grupo-tarjeta').style.display = metodo.value === 'tarjeta' ? 'block' : 'none';
    document.getElementById('grupo-cupon').style.display = metodo.value === 'cupon' ? 'block' : 'none';
  }
}

function validarPassword(pass) {
  const regex = /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z\d]){2,}).{8,}$/;
  return regex.test(pass);
}

function validarTarjeta(numero, clave) {
  if (!/^[1-9]{3}$/.test(clave)) return false;
  if (!/^\d{16}$/.test(numero)) return false;
  if (parseInt(numero[numero.length - 1]) % 2 === 0) return false;
  const suma = numero.slice(0, -1).split('').reduce((a, b) => a + parseInt(b), 0);
  if (parseInt(numero[numero.length - 1]) !== suma % 10) return false;
  return true;
}

function actualizarBotonGuardar() {
  const pass1 = document.getElementById('pass-nueva').value;
  const pass2 = document.getElementById('pass-repetir').value;
  const metodo = document.querySelector('input[name="metodo"]:checked');
  const mensajeError = document.getElementById('mensaje-error');
  let valido = false;
  let mensaje = "";

  if (!pass1 || !pass2) {
    mensaje = "Debes completar ambos campos de contraseña.";
  } else if (pass1 !== pass2) {
    mensaje = "Las contraseñas no coinciden.";
  } else if (!validarPassword(pass1)) {
    mensaje = "La contraseña debe tener al menos 8 caracteres, 2 letras, 2 números y 2 caracteres especiales.";
  } else if (!metodo) {
    mensaje = "Debes seleccionar un método de pago.";
  } else if (metodo.value === 'tarjeta') {
    const num = document.getElementById('numero-tarjeta').value;
    const clave = document.getElementById('clave-tarjeta').value;
    if (!num || !clave) {
      mensaje = "Debes completar todos los campos de la tarjeta.";
    } else if (!validarTarjeta(num, clave)) {
      mensaje = "Datos de tarjeta inválidos. Verifica el número y la clave.";
    } else {
      valido = true;
    }
  } else if (metodo.value === 'cupon') {
    const cupon = document.getElementById('codigo-cupon').value;
    if (!cupon) {
      mensaje = "Debes ingresar el código de cupón.";
    } else {
      valido = true;
    }
  } else if (metodo.value === 'transferencia') {
    valido = true;
  }

  document.getElementById('btn-guardar').disabled = !valido;
  mensajeError.textContent = valido ? "" : mensaje;
}

window.addEventListener('DOMContentLoaded', function() {
  mostrarCamposMetodoPago();
  actualizarBotonGuardar();
});

document.getElementById('pass-nueva').addEventListener('input', actualizarBotonGuardar);
document.getElementById('pass-repetir').addEventListener('input', actualizarBotonGuardar);
document.querySelectorAll('input[name="metodo"]').forEach(radio => {
  radio.addEventListener('change', function() {
    mostrarCamposMetodoPago();
    actualizarBotonGuardar();
  });
});
document.getElementById('numero-tarjeta').addEventListener('input', actualizarBotonGuardar);
document.getElementById('clave-tarjeta').addEventListener('input', actualizarBotonGuardar);
document.getElementById('codigo-cupon').addEventListener('input', actualizarBotonGuardar);

document.getElementById('perfil-form').addEventListener('submit', function(e) {
  e.preventDefault();
  actualizarBotonGuardar();
  if (document.getElementById('btn-guardar').disabled) {
    document.getElementById('mensaje-error').textContent = "Corrige los errores antes de guardar.";
    return;
  }
  usuario = JSON.parse(localStorage.getItem('usuario'));
  usuario.password = document.getElementById('pass-nueva').value;
  const metodo = document.querySelector('input[name="metodo"]:checked').value;
  usuario.metodoPago = metodo;
  if (metodo === 'tarjeta') {
    usuario.datosPago = {
      numero: document.getElementById('numero-tarjeta').value,
      clave: document.getElementById('clave-tarjeta').value
    };
  } else if (metodo === 'cupon') {
    usuario.datosPago = {
      codigo: document.getElementById('codigo-cupon').value
    };
  } else {
    usuario.datosPago = {};
  }
  localStorage.setItem('usuario', JSON.stringify(usuario));
  document.getElementById('mensaje-error').textContent = "";
  alert('¡Cambios guardados!');
  window.location.href = 'vista_principal.html';
});

document.getElementById('btn-cancelar').addEventListener('click', function() {
  localStorage.removeItem('usuario');
  
  window.location.href = 'index.html';
});