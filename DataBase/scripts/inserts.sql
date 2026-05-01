CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DELETE FROM estados;
DELETE FROM roles;
DELETE FROM usuarios;
DELETE FROM cursos;
DELETE FROM area_tecnica;
DELETE FROM pensum;
DELETE FROM etiquetas;
DELETE FROM tecnologias;
DELETE FROM tag_publicaciones;
DELETE FROM reportes;
DELETE FROM comentarios;
DELETE FROM posts_foros;
DELETE FROM publicaciones;

INSERT INTO estados (nombre_estado) VALUES 
('Activo'),
('Inactivo'),
('Suspendido'),
('En Revisión');

INSERT INTO roles (nombre_rol, descripcion) VALUES 
('Admin', 'Administrador total del ecosistema Syshub'),
('Moderador', 'Gestor de contenido y reportes'),
('Auxiliar', 'Auxiliar académico con permisos de edición limitada'),
('Estudiante', 'Usuario final del ecosistema');

-- password123
INSERT INTO usuarios (nombre, apellido, correo, password_hash, id_rol, id_estado, fecha_registro)
VALUES 
(
    'Administrador', 'Prueba', 'admin@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Admin'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo'), NOW()
),
(
    'Moderador', 'Prueba', 'moderador@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Moderador'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo'), NOW()
),
(
    'Auxiliar', 'Prueba', 'auxiliar@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Auxiliar'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo'), NOW()
),
(
    'Estudiante', 'Prueba', 'estudiante@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Estudiante'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo'), NOW()
);

-- 3. CLASIFICACIÓN SISTÉMICA
INSERT INTO area_tecnica (nombre_area) VALUES 
('Desarrollo'), ('IA'), ('Infraestructura'), ('Sistemas y Organización'), ('Ciencias de la Computación');

INSERT INTO pensum (codigo_pensum, anio_vigencia) VALUES 
('P2023', 2023), ('P2026', 2026);

INSERT INTO cursos (nombre_curso, id_area, id_pensum) VALUES 
('Sistemas Operativos 1', (SELECT id_area FROM area_tecnica WHERE nombre_area = 'Infraestructura' LIMIT 1), (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2023' LIMIT 1)),
('Teoría de Sistemas 1', (SELECT id_area FROM area_tecnica WHERE nombre_area = 'Sistemas y Organización' LIMIT 1), (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2023' LIMIT 1)),
('Inteligencia Artificial 1', (SELECT id_area FROM area_tecnica WHERE nombre_area = 'IA' LIMIT 1), (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2026' LIMIT 1));

-- 4. ETIQUETAS
INSERT INTO etiquetas (nombre_tag) VALUES 
('IA'), ('Debian'), ('Networking'), ('Base de Datos'), ('Backend'), ('Infraestructura'),
('Tutorial'), ('Investigación'), ('Proyecto'), ('Tarea'), ('Solución Técnica'), ('Hallazgo'), ('Clase Grabada');

-- 5. TECNOLOGÍAS
INSERT INTO tecnologias (nombre_tecnologia, categoria) VALUES 
('Vue.js', 'Frontend'), ('NestJS', 'Backend'), ('PostgreSQL', 'Base de Datos'), 
('Docker', 'DevOps'), ('C', 'Lenguaje'), ('Arduino', 'Hardware'),
('TypeScript', 'Lenguaje'), ('Python', 'IA/Lenguaje');

-- 6. DATOS DE PRUEBA (PUBLICACIONES Y RELACIONES)
WITH repo1 AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso, tipo_contenido)
    VALUES ('Ecosistema Syshub - Análisis Fase 1', (SELECT id_usuario FROM usuarios WHERE correo = 'admin@syshub.com' LIMIT 1), (SELECT id_curso FROM cursos WHERE nombre_curso = 'Teoría de Sistemas 1' LIMIT 1), 'repositorio')
    RETURNING id_publicacion
)
INSERT INTO tag_publicaciones (id_publicacion, id_etiqueta)
SELECT id_publicacion, (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Proyecto' LIMIT 1) FROM repo1;

WITH post1 AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso, tipo_contenido)
    VALUES ('¿Cómo configurar OSPF en Debian 12?', (SELECT id_usuario FROM usuarios WHERE correo = 'admin@syshub.com' LIMIT 1), (SELECT id_curso FROM cursos WHERE nombre_curso = 'Sistemas Operativos 1' LIMIT 1), 'foro')
    RETURNING id_publicacion
)
INSERT INTO posts_foros (id_publicacion, es_pregunta_tecnica, estado_resolucion)
SELECT id_publicacion, true, 'abierto' FROM post1;

INSERT INTO tag_publicaciones (id_publicacion, id_etiqueta) VALUES 
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Debian' LIMIT 1)),
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Networking' LIMIT 1)),
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Solución Técnica' LIMIT 1));

INSERT INTO comentarios (id_publicacion, id_usuario, contenido, puntuacion_calidad) VALUES 
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_usuario FROM usuarios WHERE correo = 'auxiliar@syshub.com' LIMIT 1), 'Excelente duda. Como tip: revisen el archivo de configuración en /etc/frr/frr.conf.', 10);