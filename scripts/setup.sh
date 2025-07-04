#!/bin/bash

# =============================================
# SCRIPT DE SETUP AUTOMÁTICO
# =============================================

# ¿Por qué este script?
# - Automatiza todo el proceso de setup
# - Reduce errores humanos
# - Documentación ejecutable del proceso

set -e  # Salir si cualquier comando falla

echo "🚀 Configurando proyecto de Powerlifting..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Instalar desde https://docker.com"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado"
    fi
    
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado. Instalar desde https://nodejs.org"
    fi
    
    log "✅ Todas las dependencias están instaladas"
}

# Crear directorios necesarios
create_directories() {
    log "Creando estructura de directorios..."
    
    mkdir -p backend/src/{config,controllers,middleware,routes,services,utils,types,database/{migrations,seeds}}
    mkdir -p backend/logs
    mkdir -p backend/uploads
    mkdir -p database
    mkdir -p docker/{nginx,postgres,redis,ssl}
    mkdir -p scripts
    
    log "✅ Directorios creados"
}

# Configurar variables de entorno
setup_environment() {
    log "Configurando variables de entorno..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        warn "Archivo .env creado desde .env.example. Revisar y actualizar valores."
    fi
    
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        warn "Archivo backend/.env creado. Revisar y actualizar valores."
    fi
    
    log "✅ Variables de entorno configuradas"
}

# Instalar dependencias del backend
install_backend_dependencies() {
    log "Instalando dependencias del backend..."
    
    cd backend
    npm install
    
    log "✅ Dependencias del backend instaladas"
    cd ..
}

# Configurar base de datos
setup_database() {
    log "Configurando base de datos..."
    
    # Iniciar solo PostgreSQL y Redis
    docker-compose up -d postgres redis
    
    # Esperar a que PostgreSQL esté listo
    log "Esperando a que PostgreSQL esté listo..."
    sleep 10
    
    # Ejecutar migraciones
    cd backend
    npm run migrate
    
    log "✅ Base de datos configurada"
    cd ..
}

# Iniciar todos los servicios
start_services() {
    log "Iniciando todos los servicios..."
    
    docker-compose up -d
    
    log "✅ Servicios iniciados"
}

# Verificar que todo esté funcionando
verify_setup() {
    log "Verificando setup..."
    
    # Esperar a que los servicios estén listos
    sleep 30
    
    # Verificar Postgre
    # ** rest of code here **
}

# Ejecutar el script de setup
check_dependencies
create_directories
setup_environment
install_backend_dependencies
setup_database
start_services
verify_setup

echo "✅ Configuración completada!"
echo "🔗 Puedes iniciar el backend con: cd backend && npm run dev"
