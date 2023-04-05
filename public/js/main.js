document.addEventListener('DOMContentLoaded', () => {
    const meGustaButtons = document.querySelectorAll('.me-gusta');
    const noMeGustaButtons = document.querySelectorAll('.no-me-gusta');
  
    meGustaButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const postId = event.target.dataset.id;
        fetch(`/api/publicaciones/${postId}/megusta`, { method: 'POST' })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            const meGustaCounter = event.target.closest('.d-flex').querySelector('.me-gusta-counter');
            meGustaCounter.textContent = `(${data.megusta})`;
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    });
  
    noMeGustaButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const postId = event.target.dataset.id;
        fetch(`/api/publicaciones/${postId}/nomegusta`, { method: 'POST' })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); 
            const noMeGustaCounter = event.target.closest('.d-flex').querySelector('.no-me-gusta-counter');
            noMeGustaCounter.textContent = `(${data.nomegusta})`;
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    });
  });
  
  
 
  const comentarioFormularios = document.querySelectorAll('.card form');
  
  comentarioFormularios.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const postId = event.target.closest('.card').querySelector('.me-gusta').dataset.id;
      const comentario = event.target.querySelector('textarea').value;
  
      fetch(`/api/publicaciones/${postId}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comentario }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        //...
  .then((data) => {
      const comentarioElement = document.createElement('div');
      comentarioElement.classList.add('comentario');
    
      const comentarioTexto = document.createElement('p');
      comentarioTexto.textContent = data.comentario;
      comentarioElement.appendChild(comentarioTexto);
    
      const fechaElement = document.createElement('small');
      fechaElement.classList.add('text-muted');
      fechaElement.textContent = `Fecha: ${data.fecha_creacion}`;
      comentarioElement.appendChild(fechaElement);
    
      event.target.closest('.card').querySelector('.comentarios').appendChild(comentarioElement);
    
      
      event.target.querySelector('textarea').value = '';
    })
      .catch((error) => {
          console.error('Error:', error);
        });
    });
  });
  