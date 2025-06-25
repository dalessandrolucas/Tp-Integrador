const params = new URLSearchParams(window.location.search);
const nombre = params.get('nombre');

const pelicula = peliculas.find(p => p.nombre === nombre);

if (pelicula) {
  document.getElementById('titulo').textContent = pelicula.nombre;
  document.getElementById('imagen').src = pelicula.imagen;
  document.getElementById('descripcion').textContent = pelicula.descripcion;
} else {
  document.getElementById('titulo').textContent = "Película no encontrada";
  document.getElementById('imagen').style.display = "none";
  document.getElementById('descripcion').textContent = "";
}