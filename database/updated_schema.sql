-- Script actualizado de creación de base de datos PostgreSQL para Sistema de Powerlifting
-- Ejecutar como superusuario de PostgreSQL

-- Crear base de datos
CREATE DATABASE powerlifting_federation;

-- Conectar a la base de datos
\c powerlifting_federation;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLAS PRINCIPALES ACTUALIZADAS
-- =============================================

-- Tabla de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
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
    token_verificacion VARCHAR(255),
    token_reset_password VARCHAR(255),
    token_reset_expira TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Autenticación 2FA
CREATE TABLE auth_2fa (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    secret VARCHAR(255),
    backup_codes TEXT[],
    phone VARCHAR(20),
    email_2fa VARCHAR(255),
    metodo_preferido VARCHAR(20) DEFAULT 'app', -- 'app', 'sms', 'email'
    activo BOOLEAN DEFAULT false,
    qr_code_url TEXT,
    temp_secret VARCHAR(255), -- Para setup inicial
    setup_completado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Códigos Temporales (para SMS/Email 2FA)
CREATE TABLE codigos_temporales (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo VARCHAR(10) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'sms', 'email', 'reset_password'
    usado BOOLEAN DEFAULT false,
    expira_en TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Organizadores (NUEVA)
CREATE TABLE organizadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    organizacion VARCHAR(255),
    cargo VARCHAR(100),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    experiencia TEXT,
    certificaciones TEXT[],
    activo BOOLEAN DEFAULT true,
    foto_url VARCHAR(500),
    sitio_web VARCHAR(255),
    redes_sociales JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Atletas (ACTUALIZADA)
CREATE TABLE atletas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('Masculino', 'Femenino')),
    pais VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100),
    email VARCHAR(255),
    telefono VARCHAR(20),
    peso_corporal DECIMAL(5,2),
    altura INTEGER, -- en cm
    categoria_peso VARCHAR(10),
    federacion_id VARCHAR(50),
    numero_licencia VARCHAR(50),
    fecha_inicio_powerlifting DATE,
    gym_entrenamiento VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    notas TEXT,
    foto_url VARCHAR(500),
    redes_sociales JSONB DEFAULT '{}',
    records_personales JSONB DEFAULT '{}',
    lesiones_historial TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Entrenadores (ACTUALIZADA)
CREATE TABLE entrenadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    experiencia TEXT NOT NULL,
    anos_experiencia INTEGER,
    certificaciones TEXT[],
    especialidades TEXT[],
    tarifa_por_hora DECIMAL(8,2),
    disponibilidad JSONB DEFAULT '{}', -- horarios disponibles
    ubicacion VARCHAR(255),
    modalidad_entrenamiento VARCHAR(50)[], -- 'presencial', 'online', 'hibrido'
    idiomas VARCHAR(50)[],
    activo BOOLEAN DEFAULT true,
    foto_url VARCHAR(500),
    biografia TEXT,
    sitio_web VARCHAR(255),
    redes_sociales JSONB DEFAULT '{}',
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    total_atletas_entrenados INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación Entrenador-Atleta (ACTUALIZADA)
CREATE TABLE entrenador_atleta (
    id SERIAL PRIMARY KEY,
    entrenador_id INTEGER NOT NULL REFERENCES entrenadores(id),
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    tipo_entrenamiento VARCHAR(50), -- 'personal', 'grupal', 'online'
    tarifa_acordada DECIMAL(8,2),
    objetivos TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entrenador_id, atleta_id, fecha_inicio)
);

-- Tabla de Competencias (ACTUALIZADA)
CREATE TABLE competencias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    fecha_fin DATE,
    ubicacion VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Nacional', 'Internacional', 'Regional', 'Local')),
    organizador_id INTEGER REFERENCES organizadores(id),
    organizador_externo VARCHAR(255), -- para organizadores no registrados
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'finalizada', 'cancelada')),
    max_participantes INTEGER,
    costo_inscripcion DECIMAL(10,2),
    premios JSONB DEFAULT '{}',
    patrocinadores TEXT[],
    reglas_especiales TEXT,
    equipamiento_permitido TEXT[],
    federacion_sancionadora VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos (dentro de competencias)
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    competencia_id INTEGER NOT NULL REFERENCES competencias(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    categoria_peso VARCHAR(10),
    genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Femenino', 'Mixto')),
    fecha DATE NOT NULL,
    hora_inicio TIME,
    orden_evento INTEGER,
    estado VARCHAR(20) DEFAULT 'programado',
    jueces JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Resultados
CREATE TABLE resultados (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    -- Levantamientos de Powerlifting
    sentadilla_1 DECIMAL(6,2),
    sentadilla_2 DECIMAL(6,2),
    sentadilla_3 DECIMAL(6,2),
    sentadilla_mejor DECIMAL(6,2),
    press_banca_1 DECIMAL(6,2),
    press_banca_2 DECIMAL(6,2),
    press_banca_3 DECIMAL(6,2),
    press_banca_mejor DECIMAL(6,2),
    peso_muerto_1 DECIMAL(6,2),
    peso_muerto_2 DECIMAL(6,2),
    peso_muerto_3 DECIMAL(6,2),
    peso_muerto_mejor DECIMAL(6,2),
    -- Totales y métricas
    total DECIMAL(6,2) GENERATED ALWAYS AS (
        COALESCE(sentadilla_mejor, 0) + 
        COALESCE(press_banca_mejor, 0) + 
        COALESCE(peso_muerto_mejor, 0)
    ) STORED,
    peso_corporal DECIMAL(5,2) NOT NULL,
    categoria_peso VARCHAR(10) NOT NULL,
    wilks_score DECIMAL(6,2),
    dots_score DECIMAL(6,2),
    posicion INTEGER,
    descalificado BOOLEAN DEFAULT false,
    razon_descalificacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evento_id, atleta_id)
);

-- Resto de tablas (entrenamientos, rendimiento, planes, etc.) se mantienen igual...

-- =============================================
-- DATOS INICIALES ACTUALIZADOS
-- =============================================

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('Administrador', 'Acceso completo al sistema', '{"all": true}'),
('Entrenador', 'Gestión de atletas y entrenamientos', '{"atletas": ["read", "update"], "entrenamientos": ["all"], "planes": ["all"]}'),
('Organizador', 'Gestión de competencias y eventos', '{"competencias": ["all"], "eventos": ["all"], "resultados": ["all"]}'),
('Atleta', 'Acceso limitado a información personal', '{"profile": ["read", "update"], "entrenamientos": ["read"], "resultados": ["read"]}'),
('Gerencia', 'Acceso a reportes y estadísticas', '{"reportes": ["read"], "dashboard": ["read"], "estadisticas": ["read"]}');

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre_usuario, email, contrasena_hash, rol_id) VALUES
('admin', 'admin@powerlifting.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1); -- password: password

-- Insertar categorías de peso estándar IPF
INSERT INTO categorias_peso (genero, peso_limite, nombre) VALUES
-- Masculino
('Masculino', 59, '59'),
('Masculino', 66, '66'),
('Masculino', 74, '74'),
('Masculino', 83, '83'),
('Masculino', 93, '93'),
('Masculino', 105, '105'),
('Masculino', 120, '120'),
('Masculino', 999, '120+'),
-- Femenino
('Femenino', 47, '47'),
('Femenino', 52, '52'),
('Femenino', 57, '57'),
('Femenino', 63, '63'),
('Femenino', 69, '69'),
('Femenino', 76, '76'),
('Femenino', 84, '84'),
('Femenino', 999, '84+');

-- =============================================
-- ÍNDICES ACTUALIZADOS
-- =============================================

-- Índices para usuarios y autenticación
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_nombre_usuario ON usuarios(nombre_usuario);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_auth_2fa_usuario_id ON auth_2fa(usuario_id);
CREATE INDEX idx_codigos_temporales_usuario_codigo ON codigos_temporales(usuario_id, codigo);
CREATE INDEX idx_codigos_temporales_expira ON codigos_temporales(expira_en);

-- Índices para organizadores
CREATE INDEX idx_organizadores_email ON organizadores(email);
CREATE INDEX idx_organizadores_organizacion ON organizadores(organizacion);
CREATE INDEX idx_organizadores_activo ON organizadores(activo);

-- Índices para atletas
CREATE INDEX idx_atletas_nombre_apellido ON atletas(nombre, apellido);
CREATE INDEX idx_atletas_pais ON atletas(pais);
CREATE INDEX idx_atletas_categoria_peso ON atletas(categoria_peso);
CREATE INDEX idx_atletas_activo ON atletas(activo);

-- Índices para entrenadores
CREATE INDEX idx_entrenadores_email ON entrenadores(email);
CREATE INDEX idx_entrenadores_ubicacion ON entrenadores(ubicacion);
CREATE INDEX idx_entrenadores_activo ON entrenadores(activo);

-- Resto de índices se mantienen igual...

-- =============================================
-- TRIGGERS ACTUALIZADOS
-- =============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizadores_updated_at BEFORE UPDATE ON organizadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_atletas_updated_at BEFORE UPDATE ON atletas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entrenadores_updated_at BEFORE UPDATE ON entrenadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competencias_updated_at BEFORE UPDATE ON competencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCIONES ÚTILES ACTUALIZADAS
-- =============================================

-- Función para limpiar códigos temporales expirados
CREATE OR REPLACE FUNCTION limpiar_codigos_expirados()
RETURNS void AS $$
BEGIN
    DELETE FROM codigos_temporales WHERE expira_en < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Función para generar código temporal
CREATE OR REPLACE FUNCTION generar_codigo_temporal(p_usuario_id INTEGER, p_tipo VARCHAR, p_duracion_minutos INTEGER DEFAULT 5)
RETURNS VARCHAR AS $$
DECLARE
    codigo VARCHAR(6);
BEGIN
    -- Generar código de 6 dígitos
    codigo := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Insertar código temporal
    INSERT INTO codigos_temporales (usuario_id, codigo, tipo, expira_en)
    VALUES (p_usuario_id, codigo, p_tipo, CURRENT_TIMESTAMP + INTERVAL '1 minute' * p_duracion_minutos);
    
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- Crear usuario de aplicación
CREATE USER powerlifting_app WITH PASSWORD 'secure_password_here';
GRANT CONNECT ON DATABASE powerlifting_federation TO powerlifting_app;
GRANT USAGE ON SCHEMA public TO powerlifting_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO powerlifting_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO powerlifting_app;
