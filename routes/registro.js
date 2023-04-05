const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.get('/', (req, res) => {
  res.render('registro');
});

router.post('/', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  console.log('Datos recibidos del formulario:', req.body); 

  try {
    const result = await pool.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id', [nombre, correo, contrasena]);
    console.log('Usuario registrado con éxito. ID:', result.rows[0].id);
    req.flash('success', 'Registro exitoso, ahora puedes iniciar sesión');
    res.redirect('/login'); // Redirige a la página de inicio de sesión después de un registro exitoso.
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error al registrar usuario');
  }
});

module.exports = router;
