# Dockerfile para el Backend (Node.js/Express)

# --- Etapa 1: Builder ---
# En esta etapa instalamos dependencias y construimos el código TypeScript a JavaScript
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Runner (Producción) ---
# En esta etapa creamos la imagen final, más ligera, para correr la aplicación
FROM node:18-alpine AS runner
WORKDIR /app

# CORRECCIÓN: Instalar 'curl' para que el healthcheck de Docker Compose funcione.
RUN apk add --no-cache curl

# Copiamos solo lo necesario para producción desde la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json .

# Comando para iniciar la aplicación en producción
CMD [ "npm", "run", "start" ]