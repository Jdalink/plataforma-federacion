# Dockerfile para el Frontend (Next.js) - VERSIÓN CORREGIDA PARA SUBDIRECTORIO

# --- Etapa 1: Dependencias ---
FROM node:18-alpine AS deps
WORKDIR /app

# CORRECCIÓN: Copiamos los archivos desde el subdirectorio /frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./

# Instala pnpm y luego las dependencias
RUN npm install -g pnpm && pnpm install

# --- Etapa 2: Construcción (Build) ---
FROM node:18-alpine AS builder
WORKDIR /app

# Copia las dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# CORRECCIÓN: Copiamos todo el código fuente desde el subdirectorio /frontend
COPY frontend/ .

# Construye la aplicación
RUN npm run build

# --- Etapa 3: Producción (Runner) ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia los artefactos de la construcción de la etapa anterior
COPY --from=builder /app/public ./public

# Habilitar la salida standalone en next.config.mjs es necesario para esto
# Se asume que el build genera la carpeta .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Comando para iniciar el servidor de Next.js
CMD ["node", "server.js"]