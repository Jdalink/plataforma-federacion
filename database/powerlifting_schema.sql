-- =============================================
-- SCRIPT COMPLETO Y CORREGIDO PARA DOCKER
-- Sistema de Gestión de Powerlifting
-- =============================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar zona horaria
SET timezone = 'UTC';

-- =============================================
-- TABLAS DE CONFIGURACIÓN Y SEGURIDAD
-- =============================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    intentos_login INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_2fa (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    secret VARCHAR(255),
    backup_codes TEXT[],
    phone VARCHAR(20),
    email_2fa VARCHAR(255),
    metodo_preferido VARCHAR(20) DEFAULT 'app' CHECK (metodo_preferido IN ('app', 'sms', 'email')),
    activo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- (Aquí puedes agregar el resto de las tablas de tu proyecto como atletas, competencias, etc.)
-- CREATE TABLE atletas ( ... );
-- CREATE TABLE competencias ( ... );
-- etc...


-- =============================================
-- DATOS INICIALES (ESTA PARTE ES CRÍTICA)
-- =============================================

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('Administrador', 'Acceso completo al sistema', '{"all": true}'),
('Entrenador', 'Gestión de atletas y entrenamientos', '{"atletas": ["read", "update"], "entrenamientos": ["all"], "planes": ["all"]}'),
('Atleta', 'Acceso limitado a información personal', '{"profile": ["read", "update"], "entrenamientos": ["read"], "resultados": ["read"]}'),
('Gerencia', 'Acceso a reportes y estadísticas', '{"reportes": ["read"], "dashboard": ["read"], "estadisticas": ["read"]}');

-- Insertar usuario administrador por defecto
-- La contraseña es 'password'
INSERT INTO usuarios (nombre_usuario, email, contrasena_hash, rol_id) VALUES
('admin', 'jequitemanzo@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

COMMIT;