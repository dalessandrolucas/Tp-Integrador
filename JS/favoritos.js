// Esta función actualiza la visibilidad de los títulos de series y películas
function actualizarVisibilidadTitulos() {
  // Selecciona todas las cards
  const cards = document.querySelectorAll(".card");
  let seriesVisibles = 0;
  let peliculasVisibles = 0;

  // Cuenta cuántas series y películas están visibles
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

  // Obtiene los elementos de los títulos
  let tituloSeries = document.getElementById("tituloSeries");
  let tituloPeliculas = document.getElementById("tituloPeliculas");

  // Muestra u oculta los títulos según si hay cards visibles
  tituloSeries.style.display = seriesVisibles < 1 ? "none" : "block";
  tituloPeliculas.style.display = peliculasVisibles < 1 ? "none" : "block";

  // Cambia el texto de los títulos
  tituloSeries.textContent = "Series";
  tituloPeliculas.textContent = "Peliculas";
}

// Esta función filtra las cards según el texto de búsqueda y la categoría seleccionada
function filtrar() {
  let top = document.getElementById("top");
  top.style.display = "none"; // Oculta el elemento "top" al filtrar

  // Obtiene el texto de búsqueda y la categoría seleccionada
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const seleccion = document
    .getElementById("categoriaSelect")
    .value.toLowerCase();

  // Recorre todas las cards y decide si mostrarlas u ocultarlas
  document.querySelectorAll(".card").forEach((card) => {
    const nombre = card.dataset.nombre.toLowerCase();
    const tipo = card.dataset.tipo.toLowerCase();
    const categorias = card.dataset.categoria.toLowerCase().split(" ");
    // Verifica si el nombre incluye el texto buscado
    const coincideNombre = nombre.includes(texto);
    // Verifica si el tipo o la categoría coincide con la selección
    const coincideFiltro =
      seleccion === "todos" ||
      tipo === seleccion ||
      categorias.includes(seleccion);

    // Muestra u oculta la card según los filtros
    card.style.display = coincideNombre && coincideFiltro ? "block" : "none";
  });

  // Actualiza la visibilidad de los títulos
  actualizarVisibilidadTitulos();
}

// Cuando la página termina de cargar, ejecuta esta función
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene los favoritos guardados en localStorage (o un array vacío si no hay)
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  // Marca los corazones de las cards que ya están en favoritos
  document.querySelectorAll(".card").forEach((card) => {
    const nombre = card.dataset.nombre;
    // Verifica si este card está en favoritos
    const esFavorito = favoritos.some((f) => f.nombre === nombre);
    // Busca el ícono del corazón dentro del botón
    const btn = card.querySelector(".favorito-cards i");
    // Si está en favoritos, le agrega la clase para que se vea rojo
    if (btn && esFavorito) {
      btn.classList.add("favorito-activo");
    }
  });

  // Busca los contenedores donde se mostrarán las cards de favoritos
  const seriesContainer = document.getElementById("cards-series");
  const peliculasContainer = document.getElementById("cards-peliculas");
  // Si existen los contenedores (estás en la vista de favoritos)
  if (seriesContainer && peliculasContainer) {
    // Limpia los contenedores
    seriesContainer.innerHTML = "";
    peliculasContainer.innerHTML = "";
    // Si no hay favoritos, muestra un mensaje
    if (favoritos.length === 0) {
      seriesContainer.innerHTML = "<p>No hay series favoritas guardadas.</p>";
      peliculasContainer.innerHTML =
        "<p>No hay películas favoritas guardadas.</p>";
    } else {
      // Si hay favoritos, crea una card para cada uno y la agrega al contenedor correspondiente
      favoritos.forEach((fav) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-tipo", fav.tipo);
        card.setAttribute("data-nombre", fav.nombre);
        card.setAttribute("data-categoria", fav.categoria);
        // El HTML de la card, con el corazón ya rojo
        card.innerHTML = `
  <a href="${fav.enlace}">
    <img src="${fav.imagen}" alt="${fav.nombre}" class="card-img">
    <div class="card-body">
      <h5 class="card-title">${fav.nombre}</h5>
    </div>
  </a>
  <button class="favorito-cards"><i class="fa-solid fa-heart favorito-activo"></i></button>
`;
        // Agrega la card al contenedor de series o películas según corresponda
        if (fav.tipo === "serie") {
          seriesContainer.appendChild(card);
        } else if (fav.tipo === "pelicula") {
          peliculasContainer.appendChild(card);
        }
      });
    }
  }
});

// Este evento escucha todos los clicks en la página
document.addEventListener("click", function (event) {
  // Busca si el click fue en un botón de favorito (o en su ícono)
  const btnFavorito = event.target.closest(".favorito-cards");
  if (btnFavorito) {
    // Busca la card a la que pertenece ese botón
    const card = btnFavorito.closest(".card");
    if (!card) return;
    // Busca la imagen de la card
    const img = card.querySelector("img");
    // Crea un objeto con los datos de la card
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
    // Obtiene los favoritos actuales
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    // Busca si ya está en favoritos
    const index = favoritos.findIndex((f) => f.nombre === favorito.nombre);

    if (index === -1) {
      // Si no está, lo agrega a favoritos y pone el corazón rojo
      favoritos.push(favorito);
      btnFavorito.querySelector("i").classList.add("favorito-activo");
    } else {
      // Si ya está, lo quita de favoritos y pone el corazón gris
      favoritos.splice(index, 1);
      btnFavorito.querySelector("i").classList.remove("favorito-activo");
      // Si estás en la vista de favoritos, elimina la card del DOM
      if (window.location.pathname.includes("vistas_favoritos.html")) {
        card.remove();
        // Si ya no quedan favoritos, muestra el mensaje
        const favoritosRestantes = document.querySelectorAll(".card");
        if (favoritosRestantes.length === 0) {
          const container = card.parentElement;
          container.innerHTML = "<p>No hay favoritos guardados.</p>";
        }
      }
    }
    // Guarda la lista actualizada de favoritos en localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    // No redirige a ninguna página, solo actualiza el estado
  }
});
