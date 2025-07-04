-- Script de creación de base de datos PostgreSQL para Sistema de Powerlifting
-- Ejecutar como superusuario de PostgreSQL

-- Crear base de datos
CREATE DATABASE powerlifting_federation;

-- Conectar a la base de datos
\c powerlifting_federation;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS analytics;

-- =============================================
-- TABLAS PRINCIPALES
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Atletas
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
    peso_corporal DECIMAL(5,2), -- Peso actual en kg
    altura INTEGER, -- Altura en cm
    categoria_peso VARCHAR(10),
    federacion_id VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    notas TEXT,
    foto_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Entrenadores
CREATE TABLE entrenadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    experiencia TEXT NOT NULL,
    certificaciones TEXT[],
    especialidades TEXT[],
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación Entrenador-Atleta
CREATE TABLE entrenador_atleta (
    id SERIAL PRIMARY KEY,
    entrenador_id INTEGER NOT NULL REFERENCES entrenadores(id),
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entrenador_id, atleta_id, fecha_inicio)
);

-- Tabla de Competencias
CREATE TABLE competencias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    fecha_fin DATE,
    ubicacion VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Nacional', 'Internacional', 'Regional', 'Local')),
    organizador VARCHAR(255),
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'finalizada', 'cancelada')),
    max_participantes INTEGER,
    costo_inscripcion DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos (dentro de competencias)
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    competencia_id INTEGER NOT NULL REFERENCES competencias(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL, -- 'Open', 'Junior', 'Master', etc.
    categoria_peso VARCHAR(10), -- '83kg', '93kg', etc.
    genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Femenino', 'Mixto')),
    fecha DATE NOT NULL,
    hora_inicio TIME,
    orden_evento INTEGER,
    estado VARCHAR(20) DEFAULT 'programado',
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

-- Tabla de Entrenamientos
CREATE TABLE entrenamientos (
    id SERIAL PRIMARY KEY,
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    entrenador_id INTEGER REFERENCES entrenadores(id),
    fecha DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    duracion INTEGER, -- en minutos
    tipo_entrenamiento VARCHAR(50), -- 'Fuerza', 'Técnica', 'Acondicionamiento'
    intensidad VARCHAR(20) CHECK (intensidad IN ('Baja', 'Media', 'Alta')),
    descripcion TEXT NOT NULL,
    ejercicios JSONB, -- Array de ejercicios con series, reps, peso
    rpe_promedio DECIMAL(3,1), -- Rate of Perceived Exertion
    notas TEXT,
    completado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Rendimiento (histórico de PRs y métricas)
CREATE TABLE rendimiento (
    id SERIAL PRIMARY KEY,
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    fecha DATE NOT NULL,
    sentadilla DECIMAL(6,2),
    press_banca DECIMAL(6,2),
    peso_muerto DECIMAL(6,2),
    total DECIMAL(6,2) GENERATED ALWAYS AS (
        COALESCE(sentadilla, 0) + 
        COALESCE(press_banca, 0) + 
        COALESCE(peso_muerto, 0)
    ) STORED,
    peso_corporal DECIMAL(5,2) NOT NULL,
    wilks DECIMAL(6,2),
    dots DECIMAL(6,2),
    tipo_registro VARCHAR(20) DEFAULT 'entrenamiento' CHECK (tipo_registro IN ('entrenamiento', 'competencia', 'test')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(atleta_id, fecha, tipo_registro)
);

-- Tabla de Planes de Entrenamiento
CREATE TABLE planes_entrenamiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    entrenador_id INTEGER REFERENCES entrenadores(id),
    nombre VARCHAR(255) NOT NULL,
    objetivo VARCHAR(100) NOT NULL,
    nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
    frecuencia INTEGER NOT NULL, -- días por semana
    duracion_semanas INTEGER NOT NULL,
    plan_detallado TEXT NOT NULL,
    ejercicios JSONB NOT NULL, -- Array de ejercicios estructurados
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    generado_por_ia BOOLEAN DEFAULT false,
    parametros_ia JSONB, -- Parámetros usados para generar con IA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Planes de Alimentación
CREATE TABLE planes_alimentacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atleta_id INTEGER NOT NULL REFERENCES atletas(id),
    nombre VARCHAR(255) NOT NULL,
    objetivo VARCHAR(100) NOT NULL,
    peso_actual DECIMAL(5,2) NOT NULL,
    peso_objetivo DECIMAL(5,2),
    actividad_nivel VARCHAR(50) NOT NULL,
    restricciones TEXT,
    preferencias TEXT,
    plan_detallado TEXT NOT NULL,
    calorias_diarias INTEGER NOT NULL,
    macros JSONB NOT NULL, -- {proteinas: X, carbohidratos: Y, grasas: Z}
    comidas JSONB NOT NULL, -- Array de comidas estructuradas
    duracion_semanas INTEGER NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    generado_por_ia BOOLEAN DEFAULT false,
    parametros_ia JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLAS DE CONFIGURACIÓN
-- =============================================

-- Tabla de Configuración del Sistema
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    descripcion TEXT,
    categoria VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías de Peso
CREATE TABLE categorias_peso (
    id SERIAL PRIMARY KEY,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('Masculino', 'Femenino')),
    peso_limite DECIMAL(5,2) NOT NULL,
    nombre VARCHAR(10) NOT NULL, -- '59', '66', '74', etc.
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLAS DE AUDITORÍA Y LOGS
-- =============================================

-- Tabla de Auditoría
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    tabla VARCHAR(50) NOT NULL,
    registro_id INTEGER NOT NULL,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
    usuario_id INTEGER REFERENCES usuarios(id),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Logs del Sistema
CREATE TABLE logs_sistema (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('DEBUG', 'INFO', 'WARN', 'ERROR')),
    mensaje TEXT NOT NULL,
    contexto JSONB,
    usuario_id INTEGER REFERENCES usuarios(id),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_nombre_usuario ON usuarios(nombre_usuario);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Índices para atletas
CREATE INDEX idx_atletas_nombre_apellido ON atletas(nombre, apellido);
CREATE INDEX idx_atletas_pais ON atletas(pais);
CREATE INDEX idx_atletas_categoria_peso ON atletas(categoria_peso);
CREATE INDEX idx_atletas_activo ON atletas(activo);

-- Índices para competencias
CREATE INDEX idx_competencias_fecha ON competencias(fecha);
CREATE INDEX idx_competencias_tipo ON competencias(tipo);
CREATE INDEX idx_competencias_estado ON competencias(estado);

-- Índices para resultados
CREATE INDEX idx_resultados_atleta_id ON resultados(atleta_id);
CREATE INDEX idx_resultados_evento_id ON resultados(evento_id);
CREATE INDEX idx_resultados_total ON resultados(total DESC);
CREATE INDEX idx_resultados_wilks ON resultados(wilks_score DESC);

-- Índices para entrenamientos
CREATE INDEX idx_entrenamientos_atleta_fecha ON entrenamientos(atleta_id, fecha DESC);
CREATE INDEX idx_entrenamientos_entrenador ON entrenamientos(entrenador_id);

-- Índices para rendimiento
CREATE INDEX idx_rendimiento_atleta_fecha ON rendimiento(atleta_id, fecha DESC);
CREATE INDEX idx_rendimiento_total ON rendimiento(total DESC);

-- Índices para planes
CREATE INDEX idx_planes_entrenamiento_atleta ON planes_entrenamiento(atleta_id);
CREATE INDEX idx_planes_alimentacion_atleta ON planes_alimentacion(atleta_id);

-- Índices para auditoría
CREATE INDEX idx_auditoria_tabla_registro ON auditoria(tabla, registro_id);
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_created_at ON auditoria(created_at);

-- =============================================
-- TRIGGERS
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
CREATE TRIGGER update_atletas_updated_at BEFORE UPDATE ON atletas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entrenadores_updated_at BEFORE UPDATE ON entrenadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competencias_updated_at BEFORE UPDATE ON competencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resultados_updated_at BEFORE UPDATE ON resultados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entrenamientos_updated_at BEFORE UPDATE ON entrenamientos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planes_entrenamiento_updated_at BEFORE UPDATE ON planes_entrenamiento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planes_alimentacion_updated_at BEFORE UPDATE ON planes_alimentacion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función de auditoría
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_anteriores)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_anteriores, datos_nuevos)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_nuevos)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoría para tablas principales
CREATE TRIGGER audit_usuarios AFTER INSERT OR UPDATE OR DELETE ON usuarios FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_atletas AFTER INSERT OR UPDATE OR DELETE ON atletas FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_resultados AFTER INSERT OR UPDATE OR DELETE ON resultados FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('Administrador', 'Acceso completo al sistema', '{"all": true}'),
('Entrenador', 'Gestión de atletas y entrenamientos', '{"atletas": ["read", "update"], "entrenamientos": ["all"], "planes": ["all"]}'),
('Atleta', 'Acceso limitado a información personal', '{"profile": ["read", "update"], "entrenamientos": ["read"], "resultados": ["read"]}'),
('Gerencia', 'Acceso a reportes y estadísticas', '{"reportes": ["read"], "dashboard": ["read"], "estadisticas": ["read"]}');

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

-- Insertar configuración inicial
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria) VALUES
('sistema_nombre', 'Federación de Powerlifting', 'string', 'Nombre del sistema', 'general'),
('wilks_formula_version', '2020', 'string', 'Versión de la fórmula Wilks a usar', 'calculo'),
('max_intentos_login', '5', 'number', 'Máximo número de intentos de login', 'seguridad'),
('session_timeout', '3600', 'number', 'Timeout de sesión en segundos', 'seguridad'),
('backup_retention_days', '30', 'number', 'Días de retención de backups', 'sistema'),
('email_notifications', 'true', 'boolean', 'Habilitar notificaciones por email', 'notificaciones');

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de atletas con información completa
CREATE VIEW vista_atletas_completa AS
SELECT 
    a.*,
    e.nombre as entrenador_nombre,
    e.apellido as entrenador_apellido,
    COUNT(r.id) as total_competencias,
    MAX(r.total) as mejor_total,
    MAX(r.wilks_score) as mejor_wilks
FROM atletas a
LEFT JOIN entrenador_atleta ea ON a.id = ea.atleta_id AND ea.activo = true
LEFT JOIN entrenadores e ON ea.entrenador_id = e.id
LEFT JOIN resultados r ON a.id = r.atleta_id
WHERE a.activo = true
GROUP BY a.id, e.nombre, e.apellido;

-- Vista de rankings actuales
CREATE VIEW vista_rankings AS
SELECT 
    a.nombre,
    a.apellido,
    a.categoria_peso,
    a.genero,
    MAX(r.total) as mejor_total,
    MAX(r.wilks_score) as mejor_wilks,
    RANK() OVER (PARTITION BY a.categoria_peso, a.genero ORDER BY MAX(r.total) DESC) as ranking_categoria,
    RANK() OVER (PARTITION BY a.genero ORDER BY MAX(r.wilks_score) DESC) as ranking_absoluto
FROM atletas a
JOIN resultados r ON a.id = r.atleta_id
WHERE a.activo = true AND r.descalificado = false
GROUP BY a.id, a.nombre, a.apellido, a.categoria_peso, a.genero;

-- =============================================
-- FUNCIONES ÚTILES
-- =============================================

-- Función para calcular Wilks Score
CREATE OR REPLACE FUNCTION calcular_wilks(total DECIMAL, peso_corporal DECIMAL, es_masculino BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
    coeff DECIMAL;
    a DECIMAL; b DECIMAL; c DECIMAL; d DECIMAL; e DECIMAL; f DECIMAL;
BEGIN
    IF es_masculino THEN
        -- Coeficientes Wilks 2020 para hombres
        a := -216.0475144;
        b := 16.2606339;
        c := -0.002388645;
        d := -0.00113732;
        e := 7.01863E-06;
        f := -1.291E-08;
    ELSE
        -- Coeficientes Wilks 2020 para mujeres
        a := 594.31747775582;
        b := -27.23842536447;
        c := 0.82112226871;
        d := -0.00930733913;
        e := 4.731582E-05;
        f := -9.054E-08;
    END IF;
    
    coeff := 500 / (a + b * peso_corporal + c * peso_corporal^2 + d * peso_corporal^3 + e * peso_corporal^4 + f * peso_corporal^5);
    
    RETURN ROUND((total * coeff)::DECIMAL, 2);
END;
$$ LANGUAGE plpgsql;

-- Función para obtener categoría de peso
CREATE OR REPLACE FUNCTION obtener_categoria_peso(peso DECIMAL, genero VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    categoria VARCHAR;
BEGIN
    SELECT nombre INTO categoria
    FROM categorias_peso
    WHERE categorias_peso.genero = obtener_categoria_peso.genero
    AND peso <= peso_limite
    AND activo = true
    ORDER BY peso_limite ASC
    LIMIT 1;
    
    RETURN COALESCE(categoria, '120+');
END;
$$ LANGUAGE plpgsql;

-- Crear usuario de aplicación
CREATE USER powerlifting_app WITH PASSWORD 'secure_password_here';
GRANT CONNECT ON DATABASE powerlifting_federation TO powerlifting_app;
GRANT USAGE ON SCHEMA public TO powerlifting_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO powerlifting_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO powerlifting_app;

-- Comentarios en las tablas
COMMENT ON TABLE atletas IS 'Información de atletas de powerlifting';
COMMENT ON TABLE resultados IS 'Resultados de competencias con los tres levantamientos';
COMMENT ON TABLE planes_entrenamiento IS 'Planes de entrenamiento generados por IA o entrenadores';
COMMENT ON TABLE planes_alimentacion IS 'Planes nutricionales personalizados';
COMMENT ON TABLE rendimiento IS 'Histórico de rendimiento y PRs de atletas';

COMMENT ON COLUMN resultados.wilks_score IS 'Puntuación Wilks para comparación entre categorías';
COMMENT ON COLUMN resultados.total IS 'Suma de los mejores levantamientos (calculado automáticamente)';
COMMENT ON COLUMN planes_entrenamiento.ejercicios IS 'JSON con estructura de ejercicios, series, reps, etc.';
COMMENT ON COLUMN planes_alimentacion.comidas IS 'JSON con plan de comidas detallado';
