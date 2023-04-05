const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('./db');

router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const result = await pool.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id', [nombre, correo, hashedPassword]);

        res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: result.rows[0].id });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario' });
    }
});
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        const usuario = result.rows[0];
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }, 'tu_clave_secreta');
        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(400).json({ error: 'Error al iniciar sesión' });
    }
});
