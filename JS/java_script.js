function actualizarVisibilidadTitulos() {
  const cards = document.querySelectorAll(".card");
  let seriesVisibles = 0;
  let peliculasVisibles = 0;

  cards.forEach((card) => {
    if (card.style.display !== "none") {
      const tipo = card.dataset.tipo;
      if (tipo === "serie") {
        seriesVisibles++;
      } else if (tipo === "pelicula") {
        peliculasVisibles++;
      }
    }
  });

  let tituloSeries = document.getElementById("tituloSeries");
  let tituloPeliculas = document.getElementById("tituloPeliculas");

  tituloSeries.style.display = seriesVisibles < 1 ? "none" : "block";
  tituloPeliculas.style.display = peliculasVisibles < 1 ? "none" : "block";

  tituloSeries.textContent = "Series";
  tituloPeliculas.textContent = "Peliculas";
}
 
function filtrar() {
let top = document.getElementById("top");
top.style.display ="none";
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const seleccion = document.getElementById("categoriaSelect").value.toLowerCase();

  document.querySelectorAll(".card").forEach((card) => {
    const nombre = card.dataset.nombre.toLowerCase();
    const tipo = card.dataset.tipo.toLowerCase();
    const categorias = card.dataset.categoria.toLowerCase().split(" ");
    const coincideNombre = nombre.includes(texto);
    const coincideFiltro = seleccion === "todos" || tipo === seleccion || categorias.includes(seleccion);

    card.style.display = coincideNombre && coincideFiltro ? "block" : "none";
  });

  actualizarVisibilidadTitulos();
}

