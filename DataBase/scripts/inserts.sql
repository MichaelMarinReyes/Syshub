CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DELETE FROM estados;
DELETE FROM roles;
DELETE FROM usuarios;
DELETE FROM cursos;
DELETE FROM area_tecnica;
DELETE FROM pensum;
DELETE FROM etiquetas;
DELETE FROM tecnologias;

INSERT INTO estados (nombre_estado) VALUES 
('Activo'),
('Inactivo'),
('Suspendido');

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

INSERT INTO area_tecnica (nombre_area) VALUES 
('Ciencias de la Computación'),
('Sistemas y Organización'),
('Infraestructura y Redes'),
('Desarrollo de Software');

-- 3. PENSUM
INSERT INTO pensum (codigo_pensum, anio_vigencia) VALUES 
('P2023', 2023),
('P2026', 2026);

-- 4. CURSOS (Garantizamos un solo registro por subconsulta)
INSERT INTO cursos (nombre_curso, id_area, id_pensum) VALUES 
(
    'Sistemas Operativos 1', 
    (SELECT id_area FROM area_tecnica WHERE nombre_area = 'Infraestructura y Redes' LIMIT 1), 
    (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2023' LIMIT 1)
),
(
    'Teoría de Sistemas 1', 
    (SELECT id_area FROM area_tecnica WHERE nombre_area = 'Sistemas y Organización' LIMIT 1), 
    (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2023' LIMIT 1)
);

-- 5. ETIQUETAS Y TECNOLOGÍAS
INSERT INTO etiquetas (nombre_tag) VALUES 
('IA'), ('Debian'), ('Networking'), ('SCRUM'), ('Base de Datos'), ('Backend');

INSERT INTO tecnologias (nombre_tecnologia, categoria) VALUES 
('Vue.js', 'Frontend'), ('NestJS', 'Backend'), ('PostgreSQL', 'Base de Datos'), 
('Docker', 'DevOps'), ('C', 'Lenguaje'), ('Arduino', 'Hardware');

-- 6. HILO 1: PREGUNTA TÉCNICA (Sys-Reddit)
WITH post1 AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso, tipo_contenido)
    VALUES ('¿Cómo configurar OSPF en Debian 12?', 
    (SELECT id_usuario FROM usuarios WHERE correo = 'admin@syshub.com' LIMIT 1), 
    (SELECT id_curso FROM cursos WHERE nombre_curso = 'Sistemas Operativos 1' LIMIT 1), 
    'foro')
    RETURNING id_publicacion
)
INSERT INTO posts_foros (id_publicacion, es_pregunta_tecnica, estado_resolucion)
SELECT id_publicacion, true, 'abierto' FROM post1;

-- 7. HILO 2: PUBLICACIÓN DE INTERÉS
WITH post2 AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso, tipo_contenido)
    VALUES ('Mejores extensiones de VS Code para C', 
    (SELECT id_usuario FROM usuarios WHERE correo = 'estudiante@syshub.com' LIMIT 1), 
    NULL, 'foro')
    RETURNING id_publicacion
)
INSERT INTO posts_foros (id_publicacion, es_pregunta_tecnica, estado_resolucion)
SELECT id_publicacion, false, 'abierto' FROM post2;

-- 8. RELACIÓN DE ETIQUETAS
INSERT INTO tag_publicaciones (id_publicacion, id_etiqueta) VALUES 
(
    (SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), 
    (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Debian' LIMIT 1)
),
(
    (SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), 
    (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Networking' LIMIT 1)
);

-- 9. COMENTARIOS Y REPORTES
INSERT INTO comentarios (id_publicacion, id_usuario, contenido, puntuacion_calidad) VALUES 
(
    (SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1),
    (SELECT id_usuario FROM usuarios WHERE correo = 'moderador@syshub.com' LIMIT 1),
    'Excelente pregunta, asegúrate de instalar el paquete quagga o frr.',
    10
);

INSERT INTO reportes (id_publicacion, id_usuario_reporta, motivo_denuncia, estado_resolucion) VALUES 
(
    (SELECT id_publicacion FROM publicaciones WHERE titulo = 'Mejores extensiones de VS Code para C' LIMIT 1),
    (SELECT id_usuario FROM usuarios WHERE correo = 'moderador@syshub.com' LIMIT 1),
    'Spam o contenido irrelevante',
    'pendiente'
);