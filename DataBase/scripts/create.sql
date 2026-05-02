
-- \i '/home/michael/Documentos/2026/Primer Semestre/Teoría de sistemas 1/Laboratorio/Proyecto/Database/scripts/create.sql'

\set ON_ERROR_STOP on

-- Reinicio de Base de Datos
DROP DATABASE IF EXISTS syshub_db;
CREATE DATABASE syshub_db;
\c syshub_db

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Limpieza de tablas existentes (en orden inverso a su dependencia)
DROP TABLE IF EXISTS tag_publicaciones CASCADE;
DROP TABLE IF EXISTS proyecto_tecnologias CASCADE;
DROP TABLE IF EXISTS entregas_tareas CASCADE;
DROP TABLE IF EXISTS asignaciones_cursos CASCADE;
DROP TABLE IF EXISTS reportes CASCADE;
DROP TABLE IF EXISTS comentarios CASCADE;
DROP TABLE IF EXISTS sesiones CASCADE;
DROP TABLE IF EXISTS articulos_blogs CASCADE;
DROP TABLE IF EXISTS posts_foros CASCADE;
DROP TABLE IF EXISTS proyectos CASCADE;
DROP TABLE IF EXISTS publicaciones CASCADE;
DROP TABLE IF EXISTS cursos_auxiliar CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS tecnologias CASCADE;
DROP TABLE IF EXISTS etiquetas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS area_tecnica CASCADE;
DROP TABLE IF EXISTS pensum CASCADE;
DROP TABLE IF EXISTS estados CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Estructura de Tablas Base
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
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
    id_curso UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_curso VARCHAR(150) NOT NULL,
    id_area UUID REFERENCES area_tecnica(id_area),
    id_pensum UUID REFERENCES pensum(id_pensum)
);

CREATE TABLE cursos_auxiliar (
    id_curso_auxiliar UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_curso UUID NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    codigo_acceso VARCHAR(10) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_auxiliar_curso UNIQUE (id_curso, id_usuario)
);

CREATE TABLE publicaciones (
    id_publicacion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_curso_auxiliar UUID REFERENCES cursos_auxiliar(id_curso_auxiliar) ON DELETE CASCADE,
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
    es_destacado BOOLEAN DEFAULT FALSE,
    fecha_destacado TIMESTAMP,
    id_auxiliar_curador UUID REFERENCES usuarios(id_usuario)
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

CREATE TABLE asignaciones_cursos (
    id_asignacion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_curso_auxiliar UUID NOT NULL REFERENCES cursos_auxiliar(id_curso_auxiliar) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_estudiante_curso_auxiliar UNIQUE (id_usuario, id_curso_auxiliar)
);

CREATE TABLE entregas_tareas (
    id_entrega UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_publicacion UUID NOT NULL REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    enlace_recurso TEXT,
    comentario_estudiante TEXT,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calificacion DECIMAL(5,2) DEFAULT 0.00,
    id_estado UUID REFERENCES estados(id_estado)
);

-- Índices para Optimización
CREATE INDEX idx_asignaciones_estudiante ON asignaciones_cursos(id_usuario);
CREATE INDEX idx_asignaciones_ca ON asignaciones_cursos(id_curso_auxiliar);
CREATE INDEX idx_entregas_publicacion ON entregas_tareas(id_publicacion);
CREATE INDEX idx_cursos_auxiliar_codigo ON cursos_auxiliar(codigo_acceso);