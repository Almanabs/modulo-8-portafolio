const express = require('express');
const app = express();
const expressHandlebars = require('express-handlebars');
const pool = require('./db');
const session = require('express-session');
const { verificarToken } = require('./auth-server');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(express.static('public'));
const multer = require('multer');

app.use(bodyParser.json());
// Configurar Handlebars como el motor de plantillas
const hbs = expressHandlebars.create({ defaultLayout: 'main', partialsDir: 'views/partials', helpers: { crearPublicacion: 'crear-publicacion' } });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Configurar middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Agregar middleware de sesión
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true
}));



app.use(flash());
// Rutas
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  next();
});
const registroRouter = require('./routes/registro');
app.use('/registro', registroRouter);

// Controladores


app.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.id as comentario_id, c.texto, c.fecha_creacion
      FROM publicaciones p
      LEFT JOIN comentarios c ON p.id = c.publicacion_id
      ORDER BY p.fecha_creacion DESC;
    `);

    const publicaciones = [];
    const publicacionesMap = {};

    result.rows.forEach(row => {
      if (!publicacionesMap[row.id]) {
        const publicacion = {
          id: row.id,
          imagen_url: row.imagen_url,
          titulo: row.titulo,
          descripcion: row.descripcion,
          fecha_creacion: row.fecha_creacion,
          megusta: row.megusta,
          nomegusta: row.nomegusta,
          comentarios: [],
        };
        publicaciones.push(publicacion);
        publicacionesMap[row.id] = publicacion;
      }
      if (row.comentario_id) {
        publicacionesMap[row.id].comentarios.push({
          id: row.comentario_id,
          texto: row.texto,
          fecha_creacion: row.fecha_creacion,
        });
      }
    });

    res.render('index', { publicaciones });
  } catch (err) {
    console.error('Error al obtener las publicaciones y comentarios', err);
    res.status(500).json({ message: 'Error al obtener las publicaciones y comentarios' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.get('/crear-publicacion', (req, res) => {
  res.render('crear-publicacion');
});

app.post('/crear', upload.single('imagen'), async (req, res) => {
  const { titulo, descripcion } = req.body;
  const imagenUrl = `/uploads/${req.file.filename}`;

  try {
    await pool.query('INSERT INTO publicaciones (titulo, descripcion, imagen_url) VALUES ($1, $2, $3)', [titulo, descripcion, imagenUrl]);
    res.redirect('/');
  } catch (err) {
    console.error('Error al crear la publicación', err);
    res.status(500).send('Error al crear la publicación');
  }
});


app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

app.post('/login', async (req, res) => {
  let { correo, contrasena } = req.body;
  try {
    let usuario = await pool.query('SELECT * FROM usuarios WHERE correo=$1 AND contrasena=$2', [correo, contrasena]);    
    if (usuario.rows) {      
      let token = generarToken(usuario.rows[0]);      
      res.send({ code: 200, message: 'Inicio de sesión exitoso', token: token });
    } else {
      res.status(500).send({ code: 500, message:'el Usuario o contraseña no existe'})
    }
     
  } catch (err) {
    console.error('Error al crear consultar el usuario', err);
    res.status(500).send('Error al crear consultar el usuario');
  }

});

function generarToken(usuario) {
  const payload = {
    id: usuario.id,
    username: usuario.correo,
   
  };
  const secret = process.env.JWT_SECRET || '123456';
  const opciones = { expiresIn: '1h' };

  return jwt.sign(payload, secret, opciones);
}
app.post('/api/publicaciones/:id/megusta', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query('UPDATE publicaciones SET megusta = megusta + 1 WHERE id = $1', [id]);
    const result = await pool.query('SELECT megusta FROM publicaciones WHERE id = $1', [id]);
    res.json({ megusta: result.rows[0].megusta });
  } catch (err) {
    console.error('Error al registrar el me gusta', err);
    res.status(500).json({ message: 'Error al registrar el me gusta' });
  }
});

app.post('/api/publicaciones/:id/nomegusta', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query('UPDATE publicaciones SET nomegusta = nomegusta + 1 WHERE id = $1', [id]);
    const result = await pool.query('SELECT nomegusta FROM publicaciones WHERE id = $1', [id]);
    res.json({ nomegusta: result.rows[0].nomegusta });
  } catch (err) {
    console.error('Error al registrar el no me gusta', err);
    res.status(500).json({ message: 'Error al registrar el no me gusta' });
  }
});

app.post('/api/publicaciones/:id/comentarios', async (req, res) => {
  const id = req.params.id;
  const comentario = req.body.comentario;

  try {
    const result = await pool.query('INSERT INTO comentarios (publicacion_id, usuario_id, texto, fecha_creacion) VALUES ($1, $2, $3, NOW()) RETURNING texto, fecha_creacion', [id, 1, comentario]);
    res.json({ comentario: result.rows[0].texto, fecha_creacion: result.rows[0].fecha_creacion });
  } catch (err) {
    console.error('Error al agregar el comentario', err);
    res.status(500).json({ message: 'Error al agregar el comentario' });
  }
});


// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

