const express = require('express');
const app = express();
const pool = require('./db'); 

app.use(express.urlencoded({ extended: true })); 


app.post('/crear', async (req, res) => {
  const { titulo, descripcion, imagenURL } = req.body;

  try {
    await pool.query('INSERT INTO publicaciones (titulo, descripcion, imagen_url) VALUES ($1, $2, $3)', [titulo, descripcion, imagenURL]);
    res.redirect('/');
  } catch (err) {
    console.error('Error saving the publication', err);
    res.status(500).send('Error al guardar la publicación');
  }
});
