CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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