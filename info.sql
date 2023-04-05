CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE publicaciones (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  imagen_url VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  publicacion_id INTEGER NOT NULL REFERENCES publicaciones(id),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  estado BOOLEAN NOT NULL
);

CREATE TABLE comentarios (
  id SERIAL PRIMARY KEY,
  publicacion_id INTEGER NOT NULL REFERENCES publicaciones(id),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  texto TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE publicaciones ADD COLUMN megusta INTEGER DEFAULT 0;
ALTER TABLE publicaciones ADD COLUMN nomegusta INTEGER DEFAULT 0;

SELECT p.*, c.id as comentario_id, c.texto, c.fecha_creacion
FROM publicaciones p
LEFT JOIN comentarios c ON p.id = c.publicacion_id
ORDER BY p.fecha_creacion DESC;
