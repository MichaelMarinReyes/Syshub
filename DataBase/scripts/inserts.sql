-- Limpieza en orden de jerarquía (de hijos a padres)
TRUNCATE TABLE 
    entregas_tareas,
    asignaciones_cursos,
    reportes, 
    tag_publicaciones, 
    comentarios, 
    sesiones, 
    articulos_blogs, 
    posts_foros, 
    proyecto_tecnologias,
    proyectos, 
    publicaciones, 
    cursos_auxiliar,
    cursos, 
    tecnologias, 
    etiquetas, 
    usuarios, 
    area_tecnica, 
    pensum, 
    estados, 
    roles 
RESTART IDENTITY CASCADE;

-- 1. ESTADOS
INSERT INTO estados (nombre_estado) VALUES 
('Activo'), 
('Inactivo'), 
('Suspendido'),
('En Revisión'),
('Público'),
('Reportado');

-- 2. ROLES
INSERT INTO roles (nombre_rol, descripcion) VALUES 
('Admin', 'Administrador total del ecosistema Syshub'),
('Moderador', 'Gestor de contenido y reportes'),
('Auxiliar', 'Auxiliar académico con permisos de edición limitada'),
('Estudiante', 'Usuario final del ecosistema');

-- 3. USUARIOS (Password: password123)
INSERT INTO usuarios (nombre, apellido, correo, password_hash, id_rol, id_estado)
VALUES 
(
    'Administrador', 'Prueba', 'admin@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Admin'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo')
),
(
    'Moderador', 'Prueba', 'moderador@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Moderador'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo')
),
(
    'Auxiliar', 'Prueba', 'auxiliar@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Auxiliar'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo')
),
(
    'Estudiante', 'Prueba', 'estudiante@syshub.com', 
    '$2b$10$wWDKPSv5ETvftmXXhOUNjugiMJn4iOCGWvNQcFO.c7jT0hu4eR7G2',
    (SELECT id_rol FROM roles WHERE nombre_rol = 'Estudiante'),
    (SELECT id_estado FROM estados WHERE nombre_estado = 'Activo')
);

-- 4. CLASIFICACIÓN ACADÉMICA
INSERT INTO area_tecnica (nombre_area) VALUES 
('Desarrollo'), ('IA'), ('Infraestructura'), ('Sistemas y Organización'), ('Ciencias de la Computación');

INSERT INTO pensum (codigo_pensum, anio_vigencia) VALUES 
('P2023', 2023), ('P2026', 2026);

INSERT INTO cursos (nombre_curso, id_area, id_pensum) VALUES 
('Sistemas Operativos 1', (SELECT id_area FROM area_tecnica WHERE nombre_area = 'Infraestructura' LIMIT 1), (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2023' LIMIT 1)),
('Teoría de Sistemas 1', (SELECT id_area FROM area_tecnica WHERE nombre_area = 'Sistemas y Organización' LIMIT 1), (SELECT id_pensum FROM pensum WHERE codigo_pensum = 'P2023' LIMIT 1));

-- 5. CURSOS_AUXILIAR (Relación Auxiliar - Curso con código de acceso)
INSERT INTO cursos_auxiliar (id_curso, id_usuario, codigo_acceso) VALUES
(
    (SELECT id_curso FROM cursos WHERE nombre_curso = 'Sistemas Operativos 1' LIMIT 1),
    (SELECT id_usuario FROM usuarios WHERE correo = 'auxiliar@syshub.com' LIMIT 1),
    'SO1-ABCDE'
),
(
    (SELECT id_curso FROM cursos WHERE nombre_curso = 'Teoría de Sistemas 1' LIMIT 1),
    (SELECT id_usuario FROM usuarios WHERE correo = 'auxiliar@syshub.com' LIMIT 1),
    'TS1-FGHIJ'
);

-- 6. ETIQUETAS Y TECNOLOGÍAS
INSERT INTO etiquetas (nombre_tag) VALUES 
('IA'), ('Debian'), ('Networking'), ('Base de Datos'), ('Backend'), ('Proyecto'), ('Solución Técnica');

INSERT INTO tecnologias (nombre_tecnologia, categoria) VALUES 
('Vue.js', 'Frontend'), ('NestJS', 'Backend'), ('PostgreSQL', 'Base de Datos'), 
('Docker', 'DevOps'), ('C', 'Lenguaje'), ('Arduino', 'Hardware'),
('TypeScript', 'Lenguaje'), ('Python', 'IA/Lenguaje');

-- 7. DATOS DE PRUEBA (PUBLICACIONES)

-- Repositorio / Proyecto
WITH repo1 AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso_auxiliar, tipo_contenido, id_estado)
    VALUES (
        'Ecosistema Syshub - Análisis Fase 1', 
        (SELECT id_usuario FROM usuarios WHERE correo = 'admin@syshub.com' LIMIT 1), 
        (SELECT id_curso_auxiliar FROM cursos_auxiliar WHERE codigo_acceso = 'TS1-FGHIJ' LIMIT 1), 
        'repositorio',
        (SELECT id_estado FROM estados WHERE nombre_estado = 'Público' LIMIT 1)
    )
    RETURNING id_publicacion
)
INSERT INTO tag_publicaciones (id_publicacion, id_etiqueta)
SELECT id_publicacion, (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Proyecto' LIMIT 1) FROM repo1;

-- Foro: Post Reportado
WITH post_reportado AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso_auxiliar, tipo_contenido, id_estado)
    VALUES (
        '¿Cómo hackear el portal de la U?', 
        (SELECT id_usuario FROM usuarios WHERE correo = 'admin@syshub.com' LIMIT 1), 
        (SELECT id_curso_auxiliar FROM cursos_auxiliar WHERE codigo_acceso = 'SO1-ABCDE' LIMIT 1), 
        'foro',
        (SELECT id_estado FROM estados WHERE nombre_estado = 'Reportado' LIMIT 1)
    )
    RETURNING id_publicacion
)
INSERT INTO reportes (id_publicacion, id_usuario_reporta, motivo_denuncia, estado_resolucion)
SELECT 
    id_publicacion, 
    (SELECT id_usuario FROM usuarios WHERE correo = 'moderador@syshub.com' LIMIT 1), 
    'Contenido malicioso que incita a actividades ilegales.', 
    'pendiente' 
FROM post_reportado;

-- Foro: Post Normal
WITH post1 AS (
    INSERT INTO publicaciones (titulo, id_usuario, id_curso_auxiliar, tipo_contenido, id_estado)
    VALUES (
        '¿Cómo configurar OSPF en Debian 12?', 
        (SELECT id_usuario FROM usuarios WHERE correo = 'admin@syshub.com' LIMIT 1), 
        (SELECT id_curso_auxiliar FROM cursos_auxiliar WHERE codigo_acceso = 'SO1-ABCDE' LIMIT 1), 
        'foro',
        (SELECT id_estado FROM estados WHERE nombre_estado = 'Público' LIMIT 1)
    )
    RETURNING id_publicacion
)
INSERT INTO posts_foros (id_publicacion, es_pregunta_tecnica, estado_resolucion)
SELECT id_publicacion, true, 'abierto' FROM post1;

-- 8. RELACIONES ADICIONALES (COMENTARIOS Y TAGS)
INSERT INTO tag_publicaciones (id_publicacion, id_etiqueta) VALUES 
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Debian' LIMIT 1)),
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_etiqueta FROM etiquetas WHERE nombre_tag = 'Networking' LIMIT 1));

INSERT INTO comentarios (id_publicacion, id_usuario, contenido, puntuacion_calidad) VALUES 
((SELECT id_publicacion FROM publicaciones WHERE titulo = '¿Cómo configurar OSPF en Debian 12?' LIMIT 1), (SELECT id_usuario FROM usuarios WHERE correo = 'moderador@syshub.com' LIMIT 1), 'Excelente duda. Como tip: revisen /etc/frr/frr.conf.', 10);