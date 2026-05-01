
-- \i '/home/michael/Documentos/2026/Primer Semestre/Teoría de sistemas 1/Laboratorio/Proyecto/Database/scripts/create.sql'

\set ON_ERROR_STOP on
DROP DATABASE IF EXISTS syshub_db;
CREATE DATABASE syshub_db;
\c syshub_db

-- Habilitar extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
    id_rol UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE estados (
    id_estado UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_estado VARCHAR(50) NOT NULL
);

CREATE TABLE pensum (
    id_pensum UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_pensum VARCHAR(20) NOT NULL,
    anio_vigencia INTEGER NOT NULL
);

CREATE TABLE area_tecnica (
    id_area UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_area VARCHAR(100) NOT NULL
);

CREATE TABLE etiquetas (
    id_etiqueta UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_tag VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_rol UUID REFERENCES roles(id_rol),
    id_estado UUID REFERENCES estados(id_estado),
    fecha_registro TIMESTAMP NOT NULL
);

CREATE TABLE cursos (
    id_curso UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_curso VARCHAR(150) NOT NULL,
    id_area UUID REFERENCES area_tecnica(id_area),
    id_pensum UUID REFERENCES pensum(id_pensum)
);

CREATE TABLE publicaciones (
    id_publicacion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_curso UUID REFERENCES cursos(id_curso),
    id_estado UUID REFERENCES estados(id_estado),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_contenido VARCHAR(20)
);

CREATE TABLE tecnologias (
    id_tecnologia UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_tecnologia VARCHAR(100) UNIQUE NOT NULL,
    categoria VARCHAR(50)
);

CREATE TABLE proyectos (
    id_publicacion UUID PRIMARY KEY REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    descripcion_tecnica TEXT,
    url_adjunto TEXT,
    es_destacado BOOLEAN DEFAULT FALSE
);

CREATE TABLE proyecto_tecnologias (
    id_publicacion UUID REFERENCES proyectos(id_publicacion) ON DELETE CASCADE,
    id_tecnologia UUID REFERENCES tecnologias(id_tecnologia) ON DELETE CASCADE,
    PRIMARY KEY (id_publicacion, id_tecnologia)
);

CREATE TABLE posts_foros (
    id_publicacion UUID PRIMARY KEY REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    es_pregunta_tecnica BOOLEAN DEFAULT TRUE,
    estado_resolucion VARCHAR(50) DEFAULT 'abierto'
);

CREATE TABLE articulos_blogs (
    id_publicacion UUID PRIMARY KEY REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    cuerpo_extenso TEXT NOT NULL,
    url_imagen_portada TEXT
);

CREATE TABLE sesiones (
    id_sesion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    token_sesion TEXT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(45),
    dispositivo TEXT
);

CREATE TABLE comentarios (
    id_comentario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_publicacion UUID REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_usuario UUID REFERENCES usuarios(id_usuario),
    contenido TEXT NOT NULL,
    puntuacion_calidad INTEGER DEFAULT 0
);

CREATE TABLE tag_publicaciones (
    id_publicacion UUID REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_etiqueta UUID REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE,
    PRIMARY KEY (id_publicacion, id_etiqueta)
);

CREATE TABLE reportes (
    id_reporte UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_publicacion UUID REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_usuario_reporta UUID REFERENCES usuarios(id_usuario),
    motivo_denuncia TEXT NOT NULL,
    id_moderador_asignado UUID REFERENCES usuarios(id_usuario),
    estado_resolucion VARCHAR(50) DEFAULT 'pendiente'
);