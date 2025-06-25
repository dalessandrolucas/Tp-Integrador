
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
  top.style.display = "none";


  const texto = document.getElementById("busqueda").value.toLowerCase();
  const seleccion = document
    .getElementById("categoriaSelect")
    .value.toLowerCase();


  document.querySelectorAll(".card").forEach((card) => {
    const nombre = card.dataset.nombre.toLowerCase();
    const tipo = card.dataset.tipo.toLowerCase();
    const categorias = card.dataset.categoria.toLowerCase().split(" ");

    const coincideNombre = nombre.includes(texto);

    const coincideFiltro =
      seleccion === "todos" ||
      tipo === seleccion ||
      categorias.includes(seleccion);


    card.style.display = coincideNombre && coincideFiltro ? "block" : "none";
  });


  actualizarVisibilidadTitulos();
}


document.addEventListener("DOMContentLoaded", function () {

  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];


  document.querySelectorAll(".card").forEach((card) => {
    const nombre = card.dataset.nombre;

    const esFavorito = favoritos.some((f) => f.nombre === nombre);

    const btn = card.querySelector(".favorito-cards i");

    if (btn && esFavorito) {
      btn.classList.add("favorito-activo");
    }
  });


  const seriesContainer = document.getElementById("cards-series");
  const peliculasContainer = document.getElementById("cards-peliculas");

  if (seriesContainer && peliculasContainer) {

    seriesContainer.innerHTML = "";
    peliculasContainer.innerHTML = "";

    if (favoritos.length === 0) {
      seriesContainer.innerHTML = "<p>No hay series favoritas guardadas.</p>";
      peliculasContainer.innerHTML =
        "<p>No hay películas favoritas guardadas.</p>";
    } else {

      favoritos.forEach((fav) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-tipo", fav.tipo);
        card.setAttribute("data-nombre", fav.nombre);
        card.setAttribute("data-categoria", fav.categoria);

        card.innerHTML = `
  <a href="${fav.enlace}">
    <img src="${fav.imagen}" alt="${fav.nombre}" class="card-img">
    <div class="card-body">
      <h5 class="card-title">${fav.nombre}</h5>
    </div>
  </a>
  <button class="favorito-cards"><i class="fa-solid fa-heart favorito-activo"></i></button>
`;

        if (fav.tipo === "serie") {
          seriesContainer.appendChild(card);
        } else if (fav.tipo === "pelicula") {
          peliculasContainer.appendChild(card);
        }
      });
    }
  }
});


document.addEventListener("click", function (event) {

  const btnFavorito = event.target.closest(".favorito-cards");
  if (btnFavorito) {

    const card = btnFavorito.closest(".card");
    if (!card) return;

    const img = card.querySelector("img");

    const enlace = card.querySelector("a")
      ? card.querySelector("a").getAttribute("href")
      : "#";
    const favorito = {
      nombre: card.dataset.nombre,
      tipo: card.dataset.tipo,
      categoria: card.dataset.categoria,
      imagen: img ? img.getAttribute("src") : "",
      enlace: enlace,
    };

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const index = favoritos.findIndex((f) => f.nombre === favorito.nombre);

    if (index === -1) {

      favoritos.push(favorito);
      btnFavorito.querySelector("i").classList.add("favorito-activo");
    } else {

      favoritos.splice(index, 1);
      btnFavorito.querySelector("i").classList.remove("favorito-activo");

      if (window.location.pathname.includes("vistas_favoritos.html")) {
        card.remove();

        const favoritosRestantes = document.querySelectorAll(".card");
        if (favoritosRestantes.length === 0) {
          const container = card.parentElement;
          container.innerHTML = "<p>No hay favoritos guardados.</p>";
        }
      }
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
});
