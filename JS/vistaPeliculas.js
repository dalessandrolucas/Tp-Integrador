const grid_peliculas = document.querySelector('.contenedor-peliculas');

window.peliculas.forEach(function (peli) {
  const card = document.createElement('div');
  card.classList.add('card');

  if (peli.centrar) {
    card.classList.add('centrado');
  }

  card.innerHTML = `
      <img src="${peli.img}" alt="${peli.titulo}">
      <h5>${peli.titulo}</h5>
    `;


  card.style.cursor = 'pointer';
  card.addEventListener('click', function () {

    window.location.href = `detalle-pelicula.html?id=${peli.id}`;
    
  });

  grid_peliculas.appendChild(card);
});

