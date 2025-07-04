#!/bin/bash

# Script para desarrollo
echo "🚀 Iniciando entorno de desarrollo..."

# Iniciar servicios de base de datos
docker-compose up -d postgres redis

# Esperar a que estén listos
sleep 5

# Iniciar backend en modo desarrollo
cd backend
npm run dev
