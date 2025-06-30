window.addEventListener('DOMContentLoaded', function() {
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.usuario === usuarioActivo);

  //Limita el número de digitos de tarjeta
  document.getElementById('numero-tarjeta').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 16) {
      this.value = this.value.slice(0, 16);
    }
  }); 
  //Limita el número de digitos de clave
  document.getElementById('clave-tarjeta').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 3) {
      this.value = this.value.slice(0, 3);
    } 
  });

  if (!usuario) {
    document.getElementById('info-usuario').innerHTML = "<p>No hay usuario logueado.</p>";
    return;
  }
  document.getElementById('info-usuario').innerHTML = `
    <h2 style="margin-bottom:0;">${usuario.nombre || usuario.usuario}</h2>
    <p style="margin-top:0;"><strong>Email:</strong> ${usuario.email}</p>
  `;
  document.getElementById('avatar-img').src = usuario.avatar || "assets/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.avif";
  mostrarCamposMetodoPago();
  actualizarBotonGuardar();
});

function mostrarCamposMetodoPago() {
  const metodo = document.querySelector('input[name="metodo"]:checked');
  document.getElementById('grupo-tarjeta').style.display = (metodo && metodo.value === 'tarjeta') ? 'block' : 'none';
  document.getElementById('grupo-cupon').style.display = (metodo && metodo.value === 'cupon') ? 'block' : 'none';
}

function validarPassword(pass) {
  const regex = /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z\d]){2,}).{8,}$/;
  return regex.test(pass);
}

function validarTarjeta(numero, clave) {
  if (!/^[0-9]{3}$/.test(clave) || clave === "000") return false;
  if (!/^\d{16}$/.test(numero)) return false;
  const numeros = numero.split('').map(Number);
  const suma = numeros.slice(0, 15).reduce((a, b) => a + b, 0);
  const ultimo = numeros[15];
  return (suma % 2 === 0 && ultimo % 2 === 1) || (suma % 2 === 1 && ultimo % 2 === 0);
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

// Listeners para validación en tiempo real
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

// MODAL DE CONFIRMACIÓN DE CONTRASEÑA

document.getElementById('perfil-form').addEventListener('submit', function(e) {
  e.preventDefault();
  actualizarBotonGuardar();
  if (document.getElementById('btn-guardar').disabled) {
    document.getElementById('mensaje-error').textContent = "Corrige los errores antes de guardar.";
    return;
  }
  document.getElementById('modal-confirmacion').style.display = 'flex';
  document.getElementById('input-pass-confirm').value = '';
  document.getElementById('modal-error').textContent = '';
});

document.getElementById('btn-modal-cancelar').addEventListener('click', function() {
  document.getElementById('modal-confirmacion').style.display = 'none';
});

document.getElementById('btn-modal-confirmar').addEventListener('click', function() {
  const passConfirm = document.getElementById('input-pass-confirm').value;
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  let usuario = usuarios.find(u => u.usuario === usuarioActivo);

  if (!usuario || usuario.password !== passConfirm) {
    document.getElementById('modal-confirmacion').style.display = 'none';
    document.getElementById('mensaje-error').textContent = "Contraseña incorrecta. No se guardaron los cambios.";
    return;
  }

  // Si la contraseña es correcta, guardar cambios
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
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  document.getElementById('mensaje-error').textContent = "";
  document.getElementById('modal-confirmacion').style.display = 'none';
  alert('¡Cambios guardados!');
  window.location.href = 'vista_principal.html';
});

// Cancelar: vuelve al login (no borra el usuario)
document.getElementById('btn-cancelar').addEventListener('click', function() {
  window.location.href = 'index.html';
});