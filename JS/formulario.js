 // Variables para almacenar datos del formulario
let formData = {};
    
 // Función para validar solo letras
function validarSoloLetras(texto) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);
    //toma valores de los campos de texto
    //valida que no tengan espacios
    //valida que tengan letras y no números
    //devuelve true o false
    //a-zA-ZáéíóúÁÉÍÓÚñÑ son las letras que se permiten en el campo \s son los espacios
}
// Función para validar email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    //  /^ es Inicio de la cadena.
    //  [^\s@] es cualquier caracter que no sea un espacio o @
    // +@ es obligatorio q tenga un caracter que sea @
    // \. es obligatorio q tenga un punto
    // $/ es Final de la cadena.
    // .test() devuelve true o false si se cumple la expresión
    //ejemplo email@gmail.com
}

// Función para validar usuario (letras y números)
function validarUsuario(usuario) {
    return /^[a-zA-Z0-9]+$/.test(usuario);
    //toma valores de los campos de texto
    //valida que no tengan espacios
    //valida que tengan letras y números
}

// Función para validar contraseña
function validarContrasena(contrasena) {
    if (contrasena.length < 8) {
    return false;
    }else{
        // .match() devuelve un array de coincidencias
        // || [] devuelve un array vacío si no hay coincidencias
        // g es para que coincida todas las veces
        const letras = (contrasena.match(/[a-zA-Z]/g) || []).length;
        const numeros = (contrasena.match(/[0-9]/g) || []).length;
        const especiales = (contrasena.match(/[^a-zA-Z0-9]/g) || []).length;
        return letras >= 2 && numeros >= 2 && especiales >= 2;
    }
}

// Función para validar número de tarjeta de crédito
function validarTarjetaCredito(numero) {
    // Debe tener exactamente 16 dígitos
    if (!/^\d{16}$/.test(numero)) {
        return { valida: false, mensaje: 'La tarjeta debe tener exactamente 16 dígitos' };
    }
    
    let suma = 0;
    let ultimoDigito = parseInt(numero.charAt(15));

    // Sumar los primeros 15 dígitos
    for (let i = 0; i < 15; i++) {
        suma += parseInt(numero.charAt(i));
        //parseInt devuelve un número entero
        //numero.charAt(i) devuelve un carácter 
        // devuelve el caracter en la posición i q es 0 en esta primera vuelta
        // Sumar el primer dígito del la tarjeta de credito hasta el 1
    }

    const sumaEsImpar = suma % 2 === 1;
    //suma % 2 devuelve el resto de la división de suma entre 2
    //si x ejemplo sumamamos estos 15 digitos 
    // 1+2+3+4+5+6+7+8+9+1+2+3+4+5+6 = 45 es impar pq el resto de la división de 45 entre 2 es 1
    const ultimoEsPar = ultimoDigito % 2 === 0;
    //lo mismo pero si es par

    const valido = (sumaEsImpar && ultimoEsPar) || (!sumaEsImpar && !ultimoEsPar);
    //si es valido devuelve true
    // sumaEsImpar y ultimoEsPar = es true  OR
    // !sumaEsImpar (si es par) y !ultimoEsPar (su ultimo numero es impar) = es true

    if (valido) {
        return { valida: true, mensaje: '' };
    } else {
        return {
            valida: false,
            mensaje: `El último dígito debe ser ${sumaEsImpar ? 'par' : 'impar'} cuando la suma de los anteriores es ${sumaEsImpar ? 'impar' : 'par'}`
        //Es una forma de construir strings usando comillas invertidas (`), 
        // y permite incluir variables o expresiones dentro del texto con ${...}.
        // el $ nos permite incluir variables expresiones dentro de los strings " {condicion a cumplir ? valor si es verdadero : valor si es falso } " es una expresión de ternario
        };
    }
}

//Funcion para mostrar error
function mostrarError(campo, mensaje) {
    const elemento = document.getElementById('error-' + campo);
    //const elemento es el elemento que queremos cambiar
    //getElementById devuelve el elemento con ese id
    //error-campo es el id del elemento que queremos cambiar
    elemento.textContent = mensaje;
    //textContent es el texto que queremos cambiar
    elemento.style.display = 'block';
    // display es el atributo que queremos cambiar
    // block es el valor que queremos cambiar  
    // esto hace que el elemento se vea
}

// Función para ocultar error
function ocultarError(campo) {
    const elemento = document.getElementById('error-' + campo);
    elemento.style.display = 'none';
    //style es el atributo que queremos cambiar
    //none es el valor que queremos cambiar esto 
    // hace que el elemento no se vea
}

//funcion para validar campo en tiempo real
function validarCampo(campo, valor) {
    const validaciones = {
        'nombre': validarNombreApellido,
        'apellido': validarNombreApellido,
        'email': validarEmailCampo,
        'usuario': validarUsuarioCampo,
        'contrasena': validarContrasenaCampo,
        'repetir-contrasena': validarRepetirContrasena,
        'codigo-tarjeta': validarCodigoTarjeta,
        'numero-tarjeta': validarNumeroTarjeta

    };
    // const validaciones es un objeto que contiene las funciones de validación
    // para cada campo
    // cada función de validación devuelve true o false

    if (validaciones[campo]) {
        return validaciones[campo](campo, valor);
    }

    return true;
}

function validarNombreApellido(campo, valor) {
    if (!valor.trim()){ 
        //!valor.trim() es equivalente a valor.trim() !== ''
        // si no tiene espacios, devuelve false
        return mostrarError(campo, 'Este campo es obligatorio') || false;
    }
    if (!validarSoloLetras(valor)) {
        // validarSoloLetras devuelve true o false
        return mostrarError(campo, 'Solo se permiten letras') || false;
    }
    return ocultarError(campo) || true;
}

function validarEmailCampo(campo, valor) {
    if (!valor.trim()) {
        return mostrarError(campo, 'Este campo es obligatorio') || false;
    }
    if (!validarEmail(valor)){ 
        // validarEmail devuelve true o false
        return mostrarError(campo, 'Ingrese un email válido') || false;
    }
    return ocultarError(campo) || true;
}

function validarUsuarioCampo(campo, valor) {
    if (!valor.trim()) {
        return mostrarError(campo, 'Este campo es obligatorio') || false;
    }
    if (!validarUsuario(valor)){ 
        return mostrarError(campo, 'Solo se permiten letras y números') || false;
    }
    return ocultarError(campo) || true;
}

function validarContrasenaCampo(campo, valor) {
    if (!valor.trim()){
         return mostrarError(campo, 'Este campo es obligatorio') || false;
    }
    if (!validarContrasena(valor)) {
        return mostrarError(campo, 'La contraseña debe tener mínimo 8 caracteres (2 letras, 2 números, 2 especiales)') || false;
    }
    return ocultarError(campo) || true;
}

function validarRepetirContrasena(campo, valor) {
    const contrasenaOriginal = document.getElementById('contrasena').value;
    if (!valor.trim()) {
        return mostrarError(campo, 'Este campo es obligatorio') || false;
    }
    if (valor !== contrasenaOriginal){ 
        //si no coinciden, devuelve false o la contraseña no coincide
        return mostrarError(campo, 'Las contraseñas no coinciden') || false;
    }
    //si es verdadero oculta el msj de error
    return ocultarError(campo) || true;
}

function validarCodigoTarjeta(campo, valor) {
    if (valor === '000'){ 
        //si el valor ingresado es 000, devuelve false o el código no puede ser 000
        return mostrarError(campo, 'El código no puede ser 000') || false;
    }
    if (!/^\d{3}$/.test(valor)) {
        //Si el valor ingresado no es exactamente 3 números, 
        // devuelve false o debe contener exactamente 3 números
        // /^\d{3}$/ es un regex que coincide con números exactamente de 3 dígitos
        // ^ es un metacarácter inicial que indica el inicio de la cadena
        // \d es un metacarácter que coincide con números
        // {3} es un grupo de 3 caracteres
        // $ es un metacarácter final que indica el final de la cadena
        return mostrarError(campo, 'Debe contener exactamente 3 números') || false;
    }
    return ocultarError(campo) || true;
}

function validarNumeroTarjeta(campo, valor) {
    if (!valor.trim()) {
        mostrarError(campo, 'Este campo es obligatorio');
        return false;
    } else {
        const validacion = validarTarjetaCredito(valor);
        if (!validacion.valida) {
            mostrarError(campo, validacion.mensaje);
            return false;
        } else {
            ocultarError(campo);
            return true;
        }
    }
}

// Event listeners para validación en tiempo real
document.getElementById('nombre').addEventListener('input', function() {
    validarCampo('nombre', this.value);
    verificarFormularioCompleto();
    //document.getElementById es el elemento que queremos cambiar
    //getElementById devuelve el elemento con ese id
    //.addEventListener es un método de la clase EventTarget
    //addEventListener se llama cuando se produce un evento
    //input es el evento que queremos escuchar
    //function es el tipo de dato que queremos que devuelva
    //this es el objeto que llamamos al método
    //.value es el valor que queremos obtener

    //cuando ingresamos un valor por los inputs type text con id nombre
    //validamos q sea solo strings sin numeros
});

document.getElementById('apellido').addEventListener('input', function() {
    validarCampo('apellido', this.value);
    verificarFormularioCompleto();
});

document.getElementById('email').addEventListener('input', function() {
    validarCampo('email', this.value);
    verificarFormularioCompleto();
});

document.getElementById('usuario').addEventListener('input', function() {
    validarCampo('usuario', this.value);
    verificarFormularioCompleto();
});

document.getElementById('contrasena').addEventListener('input', function() {
    validarCampo('contrasena', this.value);
    // Re-validar repetir contraseña si ya tiene valor
    const repetirContrasena = document.getElementById('repetir-contrasena').value;
    // const repetirContrasena es un valor constante que contiene el valor de la contraseña repetida
    // si ya tiene valor, validar que coincida con la contraseña original
    if (repetirContrasena) {
        validarCampo('repetir-contrasena', repetirContrasena);

    }
    verificarFormularioCompleto();
});

document.getElementById('repetir-contrasena').addEventListener('input', function() {
    validarCampo('repetir-contrasena', this.value);
    verificarFormularioCompleto();
});

document.getElementById('codigo-tarjeta').addEventListener('input', function() {
    validarCampo('codigo-tarjeta', this.value);
    verificarFormularioCompleto();
});

 document.getElementById('numero-tarjeta').addEventListener('input', function() {
    // Solo permitir números
    this.value = this.value.replace(/\D/g, '').substring(0, 16);
    /*this.value Hace referencia al valor actual del campo de entrada 
    (el texto que está escribiendo el usuario).

    .replace(/\D/g, '')
    \D es una expresión regular que significa: cualquier carácter 
    que NO sea un dígito (es decir, todo menos 0-9).

    g es la bandera global, que indica que debe 
    reemplazar todas las apariciones, no solo la primera.

    '' → reemplaza esos caracteres con una cadena vacía.
    Resultado: elimina todo lo que no sea un número
    
    Limita lo ingresado a solo números y (.substring) máximo 16 dígitos.*/
    validarCampo('numero-tarjeta', this.value);
    verificarFormularioCompleto();
});

// Manejar cambios en métodos de pago
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    //Selecciona todos los inputs type name payment
    //Recorre todo los inputs radio 
    radio.addEventListener('change', function() {
        //Agrega un listener para que, cuando el usuario seleccione 
        // una opción distinta, se ejecute el bloque de código.
        document.querySelectorAll('.payment-fields').forEach(field => {
            //Selecciona todas las class payment-fields
            field.classList.remove('active');
            // Ocultar todos los campos de pago
        });
        
        // Mostrar campos del método seleccionado
        const selectedFields = document.getElementById(this.value + '-fields');
        if (selectedFields) {
            selectedFields.classList.add('active');
        }

        verificarFormularioCompleto();
    });
});

//FUncion para verificar si el formulario esta completo
function verificarFormularioCompleto() {
    //Creo un arrays de los campos
    const campos = ['nombre', 'apellido', 'email', 'usuario', 'contrasena', 'repetir-contrasena'];
    let todosCamposValidos = true;
    
    // Verificar campos básicos
    campos.forEach(campo => {
        //Recorre el arrays campos
        const valor = document.getElementById(campo).value;
        if (!validarCampo(campo, valor)) {
            todosCamposValidos = false;
        }
    });

    // Verificar método de pago
    const metodoPago = document.querySelector('input[name="payment"]:checked');
    //Selecciona el input[name="payment"]:checked
    if (!metodoPago) {
        todosCamposValidos = false;
    } else if (metodoPago.value === 'debito') {
        // Verificar campos de tarjeta
        const numeroTarjeta = document.getElementById('numero-tarjeta').value;
        const codigoTarjeta = document.getElementById('codigo-tarjeta').value;
        
        if (!validarCampo('numero-tarjeta', numeroTarjeta) || !validarCampo('codigo-tarjeta', codigoTarjeta)) {
            todosCamposValidos = false;
        }
    } else if (metodoPago.value === 'cupon') {
        // Verificar que al menos un cupón esté seleccionado
        const pagoFacil = document.getElementById('pago-facil').checked;
        const rapiPago = document.getElementById('rapi-pago').checked;
        
        if (!pagoFacil && !rapiPago) {
            todosCamposValidos = false;
        }
    }
    
    // Habilitar/deshabilitar botón confirmar
    document.getElementById('confirmar').disabled = !todosCamposValidos;
}

// Event listeners para cupones
document.getElementById('pago-facil').addEventListener('change', verificarFormularioCompleto);
document.getElementById('rapi-pago').addEventListener('change', verificarFormularioCompleto);

//Funcion para validar todo el formulario
function validarFormulario(){
    let esValido = true;
    //validar campos basicos
    const campos = ['nombre', 'apellido', 'email', 'usuario', 'contrasena', 'repetir-contrasena'];
    campos.forEach(campo => {
        const valor = document.getElementById(campo).value;
        if (!validarCampo(campo, valor)) {
            esValido = false;
        }
    });
    // Validar método de pago seleccionado
    const metodoPago = document.querySelector('input[name="payment"]:checked');
    if (!metodoPago) {
        alert('Debe seleccionar un método de pago');
        esValido = false;
    } else if (metodoPago.value === 'debito') {
        // Validar campos de tarjeta
        const numeroTarjeta = document.getElementById('numero-tarjeta').value;
        const codigoTarjeta = document.getElementById('codigo-tarjeta').value;
        
        if (!validarCampo('numero-tarjeta', numeroTarjeta)) {
            esValido = false;
        }
        
        if (!validarCampo('codigo-tarjeta', codigoTarjeta)) {
            esValido = false;
        }
    } else if (metodoPago.value === 'cupon') {
        // Validar que al menos un cupón esté seleccionado
        const pagoFacil = document.getElementById('pago-facil').checked;
        const rapiPago = document.getElementById('rapi-pago').checked;
        
        if (!pagoFacil && !rapiPago) {
            alert('Debe seleccionar al menos un tipo de cupón');
            esValido = false;
        }
    }

    return esValido;
}
//Funcion para navegar al login
function irAlLogin(){
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 2000);
}

// Event listeners para los botones
document.getElementById('confirmar').addEventListener('click', function() {
    if (validarFormulario()) {
        // Guardar datos (en memoria para esta demostración)
        formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            usuario: document.getElementById('usuario').value,
            metodoPago: document.querySelector('input[name="payment"]:checked').value
        };
        guardarRegistroEnLocalStorage(formData);
    }
        
            
});

function guardarRegistroEnLocalStorage(nuevoUsuario) {
    // Paso 1: Obtener lo que ya hay en el localStorage
    const datosGuardados = localStorage.getItem("listasDeUsuarios");

    // Paso 2: Si hay algo, lo convertimos a array; si no, iniciamos uno vacío
    const lista = datosGuardados ? JSON.parse(datosGuardados) : [];
    //condicion ternaria para verificar si hay datos guardados

    //paso 3: Verificar si ya existe un usuario con el mismo email o nombre de usuario
    const existe = lista.some(usuario =>
        usuario.email === nuevoUsuario.email ||
        usuario.usuario === nuevoUsuario.usuario
    );

    if (existe) {
        alert("Ya existe un usuario con este email o nombre de usuario.");
        return;
    }
    // Paso 4: Agregamos el nuevo objeto
    lista.push(nuevoUsuario);
    // Paso 5: Guardamos el array actualizado
    localStorage.setItem("listasDeUsuarios", JSON.stringify(lista));
    irAlLogin();
}

// function cargarRegistroDeLocalStorage() {
//     const registro = localStorage.getItem('registro');
//     if (registro) {
//         formData = JSON.parse(registro);
//     }
// }

document.getElementById('cancelar').addEventListener('click', function() {
    irAlLogin();
});

 // Restricciones de entrada para campos específicos
document.getElementById('codigo-tarjeta').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').substring(0, 3);
});

// Inicializar verificación del formulario
verificarFormularioCompleto();