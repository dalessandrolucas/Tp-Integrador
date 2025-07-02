const grid_series = document.querySelector('.contenedor-series');

window.series.forEach(function (serie) {
  const card = document.createElement('div');
  card.classList.add('card');

  if (serie.centrar) {
    card.classList.add('centrado');
  }

  card.innerHTML = `
      <img src="${serie.img}" alt="${serie.titulo}">
      <h5>${serie.titulo}</h5>
    `;

  
  card.style.cursor = 'pointer';
  card.addEventListener('click', function () {
    
    window.location.href = `detalle-pelicula.html?id=${serie.id}`;

  });

  grid_series.appendChild(card);
});

