# Guía Completa para Construir el Backend

Esta guía te ayudará a construir un backend completo que se acople perfectamente con el frontend de React/Next.js para el sistema de gestión de powerlifting.

## 📋 Tabla de Contenidos

1. [Tecnologías Recomendadas](#tecnologías-recomendadas)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Implementación de APIs](#implementación-de-apis)
6. [Autenticación y Seguridad](#autenticación-y-seguridad)
7. [Integración con IA](#integración-con-ia)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Monitoreo y Logs](#monitoreo-y-logs)

## 🛠 Tecnologías Recomendadas

### Stack Principal
- **Runtime**: Node.js 18+ o Bun
- **Framework**: Express.js o Fastify
- **Base de Datos**: PostgreSQL 14+
- **ORM**: Prisma o TypeORM
- **Autenticación**: JWT + Passport.js
- **Validación**: Zod o Joi
- **Testing**: Jest + Supertest
- **Documentación**: Swagger/OpenAPI

### Dependencias Clave
\`\`\`json
{
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "zod": "^3.22.4",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "rate-limiter-flexible": "^3.0.8",
    "winston": "^3.11.0",
    "nodemailer": "^6.9.7",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.3",
    "openai": "^4.20.1",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/passport": "^1.0.16",
    "@types/passport-jwt": "^3.0.13",
    "@types/passport-local": "^1.0.38",
    "@types/cors": "^2.8.17",
    "@types/multer": "^1.4.11",
    "typescript": "^5.3.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "supertest": "^6.3.3"
  }
}
\`\`\`

## ⚙️ Configuración del Entorno

### 1. Inicializar el Proyecto
\`\`\`bash
mkdir powerlifting-backend
cd powerlifting-backend
npm init -y
npm install express prisma @prisma/client jsonwebtoken bcryptjs passport passport-jwt passport-local zod cors helmet rate-limiter-flexible winston nodemailer speakeasy qrcode openai multer sharp
npm install -D @types/node @types/express @types/bcryptjs @types/jsonwebtoken @types/passport @types/passport-jwt @types/passport-local @types/cors @types/multer typescript ts-node nodemon jest @types/jest supertest
\`\`\`

### 2. Configurar TypeScript
\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
\`\`\`

### 3. Variables de Entorno
\`\`\`env
# .env
# Base de datos
DATABASE_URL="postgresql://powerlifting_app:secure_password_here@localhost:5432/powerlifting_federation"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-secret-here"
JWT_REFRESH_EXPIRES_IN="30d"

# Servidor
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Email (para 2FA y notificaciones)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS (Twilio para 2FA)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Uploads
UPLOAD_MAX_SIZE="10485760" # 10MB
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000" # 15 minutos
RATE_LIMIT_MAX_REQUESTS="100"

# Logs
LOG_LEVEL="info"
LOG_FILE_PATH="./logs"
\`\`\`

## 🏗 Estructura del Proyecto

\`\`\`
src/
├── config/
│   ├── database.ts
│   ├── auth.ts
│   ├── openai.ts
│   └── email.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── atletas.controller.ts
│   ├── competencias.controller.ts
│   ├── entrenamientos.controller.ts
│   ├── entrenadores.controller.ts
│   ├── resultados.controller.ts
│   ├── rendimiento.controller.ts
│   ├── planes.controller.ts
│   └── dashboard.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── upload.middleware.ts
├── models/
│   └── (archivos de Prisma)
├── routes/
│   ├── auth.routes.ts
│   ├── atletas.routes.ts
│   ├── competencias.routes.ts
│   ├── entrenamientos.routes.ts
│   ├── entrenadores.routes.ts
│   ├── resultados.routes.ts
│   ├── rendimiento.routes.ts
│   ├── planes.routes.ts
│   └── dashboard.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── email.service.ts
│   ├── sms.service.ts
│   ├── ai.service.ts
│   ├── wilks.service.ts
│   └── upload.service.ts
├── utils/
│   ├── logger.ts
│   ├── validators.ts
│   ├── helpers.ts
│   └── constants.ts
├── types/
│   ├── auth.types.ts
│   ├── api.types.ts
│   └── database.types.ts
├── tests/
│   ├── auth.test.ts
│   ├── atletas.test.ts
│   └── ...
└── app.ts
└── server.ts
\`\`\`

## 🗄 Configuración de Base de Datos

### 1. Configurar Prisma
\`\`\`bash
npx prisma init
\`\`\`

### 2. Schema de Prisma
\`\`\`prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Role {
  id          Int       @id @default(autoincrement())
  nombre      String    @unique @db.VarChar(50)
  descripcion String?
  permisos    Json      @default("{}")
  activo      Boolean   @default(true)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  usuarios    Usuario[]
  
  @@map("roles")
}

model Usuario {
  id                Int       @id @default(autoincrement())
  nombreUsuario     String    @unique @map("nombre_usuario") @db.VarChar(50)
  email             String    @unique @db.VarChar(255)
  contrasenaHash    String    @map("contrasena_hash") @db.VarChar(255)
  rolId             Int       @map("rol_id")
  activo            Boolean   @default(true)
  emailVerificado   Boolean   @default(false) @map("email_verificado")
  ultimoLogin       DateTime? @map("ultimo_login")
  intentosLogin     Int       @default(0) @map("intentos_login")
  bloqueadoHasta    DateTime? @map("bloqueado_hasta")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  
  rol               Role      @relation(fields: [rolId], references: [id])
  auth2fa           Auth2FA?
  
  @@map("usuarios")
}

model Auth2FA {
  id              Int      @id @default(autoincrement())
  usuarioId       Int      @unique @map("usuario_id")
  secret          String?  @db.VarChar(255)
  backupCodes     String[] @map("backup_codes")
  phone           String?  @db.VarChar(20)
  email2fa        String?  @map("email_2fa") @db.VarChar(255)
  metodoPreferido String   @default("app") @map("metodo_preferido") @db.VarChar(20)
  activo          Boolean  @default(false)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  usuario         Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@map("auth_2fa")
}

model Atleta {
  id               Int       @id @default(autoincrement())
  nombre           String    @db.VarChar(100)
  apellido         String    @db.VarChar(100)
  fechaNacimiento  DateTime  @map("fecha_nacimiento") @db.Date
  genero           String    @db.VarChar(20)
  pais             String    @db.VarChar(100)
  ciudad           String?   @db.VarChar(100)
  email            String?   @db.VarChar(255)
  telefono         String?   @db.VarChar(20)
  pesoCorporal     Decimal?  @map("peso_corporal") @db.Decimal(5,2)
  altura           Int?
  categoriaPeso    String?   @map("categoria_peso") @db.VarChar(10)
  federacionId     String?   @map("federacion_id") @db.VarChar(50)
  activo           Boolean   @default(true)
  notas            String?
  fotoUrl          String?   @map("foto_url") @db.VarChar(500)
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")
  
  entrenamientos   Entrenamiento[]
  resultados       Resultado[]
  rendimiento      Rendimiento[]
  planesEntrenamiento PlanEntrenamiento[]
  planesAlimentacion  PlanAlimentacion[]
  entrenadorAtleta    EntrenadorAtleta[]
  
  @@map("atletas")
}

// ... resto de modelos siguiendo el mismo patrón
\`\`\`

### 3. Migrar Base de Datos
\`\`\`bash
# Ejecutar el script SQL primero
psql -U postgres -f database/schema.sql

# Luego sincronizar Prisma
npx prisma db pull
npx prisma generate
\`\`\`

## 🔌 Implementación de APIs

### 1. Configuración Principal
\`\`\`typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error.middleware';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import logger from './utils/logger';

// Importar rutas
import authRoutes from './routes/auth.routes';
import atletasRoutes from './routes/atletas.routes';
import competenciasRoutes from './routes/competencias.routes';
import entrenamientosRoutes from './routes/entrenamientos.routes';
import entrenadoresRoutes from './routes/entrenadores.routes';
import resultadosRoutes from './routes/resultados.routes';
import rendimientoRoutes from './routes/rendimiento.routes';
import planesRoutes from './routes/planes.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
export const prisma = new PrismaClient();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true
}));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimitMiddleware);

// Logging de requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Rutas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas protegidas
app.use('/api', authMiddleware);

// Rutas protegidas
app.use('/api/atletas', atletasRoutes);
app.use('/api/competencias', competenciasRoutes);
app.use('/api/entrenamientos', entrenamientosRoutes);
app.use('/api/entrenadores', entrenadoresRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api/rendimiento', rendimientoRoutes);
app.use('/api/planes-entrenamiento', planesRoutes.entrenamiento);
app.use('/api/planes-alimentacion', planesRoutes.alimentacion);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
\`\`\`

### 2. Controlador de Ejemplo (Atletas)
\`\`\`typescript
// src/controllers/atletas.controller.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { z } from 'zod';
import logger from '../utils/logger';

const atletaSchema = z.object({
  nombre: z.string().min(1).max(100),
  apellido: z.string().min(1).max(100),
  fechaNacimiento: z.string().transform(str => new Date(str)),
  genero: z.enum(['Masculino', 'Femenino']),
  pais: z.string().min(1).max(100),
  ciudad: z.string().max(100).optional(),
  email: z.string().email().optional(),
  telefono: z.string().max(20).optional(),
  pesoCorporal: z.number().positive().optional(),
  altura: z.number().positive().optional(),
});

export class AtletasController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, pais, activo } = req.query;
      
      const where: any = {};
      
      if (search) {
        where.OR = [
          { nombre: { contains: search as string, mode: 'insensitive' } },
          { apellido: { contains: search as string, mode: 'insensitive' } }
        ];
      }
      
      if (pais) where.pais = pais;
      if (activo !== undefined) where.activo = activo === 'true';

      const [atletas, total] = await Promise.all([
        prisma.atleta.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
          include: {
            entrenadorAtleta: {
              where: { activo: true },
              include: { entrenador: true }
            }
          }
        }),
        prisma.atleta.count({ where })
      ]);

      res.json({
        data: atletas,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error getting atletas:', error);
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const atleta = await prisma.atleta.findUnique({
        where: { id: Number(id) },
        include: {
          entrenadorAtleta: {
            where: { activo: true },
            include: { entrenador: true }
          },
          resultados: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { evento: { include: { competencia: true } } }
          },
          rendimiento: {
            orderBy: { fecha: 'desc' },
            take: 10
          }
        }
      });

      if (!atleta) {
        return res.status(404).json({ error: 'Atleta no encontrado' });
      }

      res.json(atleta);
    } catch (error) {
      logger.error('Error getting atleta by ID:', error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = atletaSchema.parse(req.body);
      
      const atleta = await prisma.atleta.create({
        data: validatedData
      });

      logger.info('Atleta created:', { atletaId: atleta.id, userId: req.user?.id });
      res.status(201).json(atleta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      }
      logger.error('Error creating atleta:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = atletaSchema.partial().parse(req.body);
      
      const atleta = await prisma.atleta.update({
        where: { id: Number(id) },
        data: validatedData
      });

      logger.info('Atleta updated:', { atletaId: atleta.id, userId: req.user?.id });
      res.json(atleta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      }
      logger.error('Error updating atleta:', error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      await prisma.atleta.update({
        where: { id: Number(id) },
        data: { activo: false }
      });

      logger.info('Atleta soft deleted:', { atletaId: id, userId: req.user?.id });
      res.json({ message: 'Atleta eliminado correctamente' });
    } catch (error) {
      logger.error('Error deleting atleta:', error);
      next(error);
    }
  }
}
\`\`\`

### 3. Middleware de Autenticación
\`\`\`typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import logger from '../utils/logger';

interface JwtPayload {
  userId: number;
  email: string;
  rol: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        rol: string;
        permisos: any;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: { rol: true }
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
      permisos: usuario.rol.permisos
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
};

export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const permisos = req.user.permisos;
    
    // Admin tiene todos los permisos
    if (permisos.all === true) {
      return next();
    }

    // Verificar permiso específico
    if (permisos[resource] && (permisos[resource].includes(action) || permisos[resource].includes('all'))) {
      return next();
    }

    res.status(403).json({ error: 'Permisos insuficientes' });
  };
};
\`\`\`

### 4. Servicio de IA
\`\`\`typescript
// src/services/ai.service.ts
import OpenAI from 'openai';
import logger from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  async generateTrainingPlan(params: {
    atletaId: number;
    objetivo: string;
    nivel: string;
    frecuencia: number;
    duracion: number;
    limitaciones?: string;
  }) {
    try {
      const prompt = `
      Eres un entrenador experto en powerlifting. Genera un plan de entrenamiento detallado con las siguientes especificaciones:

      - Objetivo: ${params.objetivo}
      - Nivel del atleta: ${params.nivel}
      - Frecuencia: ${params.frecuencia} días por semana
      - Duración: ${params.duracion} semanas
      - Limitaciones: ${params.limitaciones || "Ninguna"}

      El plan debe incluir:
      1. Una descripción general del plan (2-3 párrafos)
      2. Lista de ejercicios específicos con series, repeticiones, peso sugerido y descansos
      3. Enfoque en los tres levantamientos principales: sentadilla, press de banca y peso muerto
      4. Ejercicios accesorios apropiados para el nivel

      Responde en formato JSON con esta estructura:
      {
        "plan_detallado": "descripción del plan",
        "ejercicios": [
          {
            "nombre": "nombre del ejercicio",
            "series": número,
            "repeticiones": "rango de reps",
            "peso_sugerido": "porcentaje o descripción",
            "descanso": "tiempo de descanso",
            "notas": "notas adicionales"
          }
        ]
      }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Eres un entrenador experto en powerlifting con 15 años de experiencia. Siempre respondes en español y con información técnicamente correcta."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response || '{}');
      } catch {
        // Si no es JSON válido, crear estructura básica
        return {
          plan_detallado: response,
          ejercicios: [
            {
              nombre: "Sentadilla Trasera",
              series: 4,
              repeticiones: "5-8",
              peso_sugerido: "80-85% 1RM",
              descanso: "3-4 min",
              notas: "Enfoque en técnica"
            },
            {
              nombre: "Press de Banca",
              series: 4,
              repeticiones: "5-8",
              peso_sugerido: "80-85% 1RM",
              descanso: "3-4 min",
              notas: "Pausa en el pecho"
            },
            {
              nombre: "Peso Muerto",
              series: 3,
              repeticiones: "5-8",
              peso_sugerido: "80-85% 1RM",
              descanso: "4-5 min",
              notas: "Activación de glúteos"
            }
          ]
        };
      }
    } catch (error) {
      logger.error('Error generating training plan:', error);
      throw new Error('Error al generar plan de entrenamiento');
    }
  }

  async generateNutritionPlan(params: {
    atletaId: number;
    objetivo: string;
    pesoActual: number;
    pesoObjetivo?: number;
    actividadNivel: string;
    restricciones?: string;
    duracion: number;
    preferencias?: string;
  }) {
    try {
      const prompt = `
      Eres un nutricionista deportivo especializado en powerlifting. Genera un plan de alimentación detallado con las siguientes especificaciones:

      - Objetivo: ${params.objetivo}
      - Peso actual: ${params.pesoActual}kg
      - Peso objetivo: ${params.pesoObjetivo ? params.pesoObjetivo + "kg" : "No especificado"}
      - Nivel de actividad: ${params.actividadNivel}
      - Restricciones: ${params.restricciones || "Ninguna"}
      - Preferencias: ${params.preferencias || "Ninguna"}
      - Duración: ${params.duracion} semanas

      El plan debe incluir:
      1. Una descripción general del plan nutricional (2-3 párrafos)
      2. Cálculo de calorías diarias totales
      3. Distribución de macronutrientes (proteínas, carbohidratos, grasas en gramos)
      4. Plan de comidas detallado con al menos 5 comidas al día
      5. Cada comida debe incluir alimentos específicos, calorías y macros

      Responde en formato JSON con esta estructura:
      {
        "plan_detallado": "descripción del plan",
        "calorias_diarias": número,
        "macros": {
          "proteinas": número,
          "carbohidratos": número,
          "grasas": número
        },
        "comidas": [
          {
            "nombre": "nombre de la comida",
            "horario": "hora sugerida",
            "alimentos": ["alimento1", "alimento2"],
            "calorias": número,
            "proteinas": número,
            "carbohidratos": número,
            "grasas": número,
            "notas": "notas adicionales"
          }
        ]
      }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Eres un nutricionista deportivo con especialización en powerlifting y 10 años de experiencia. Siempre respondes en español con información nutricional precisa."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response || '{}');
      } catch {
        // Si no es JSON válido, crear estructura básica
        const calorias = params.pesoActual * (params.actividadNivel === 'intenso' ? 35 : params.actividadNivel === 'moderado' ? 30 : 25);
        return {
          plan_detallado: response,
          calorias_diarias: Math.round(calorias),
          macros: {
            proteinas: Math.round(params.pesoActual * 2.2),
            carbohidratos: Math.round(params.pesoActual * 4),
            grasas: Math.round(params.pesoActual * 1)
          },
          comidas: [
            {
              nombre: "Desayuno",
              horario: "7:00 AM",
              alimentos: ["Avena", "Plátano", "Proteína en polvo"],
              calorias: Math.round(calorias * 0.25),
              proteinas: Math.round(params.pesoActual * 0.5),
              carbohidratos: Math.round(params.pesoActual * 1),
              grasas: Math.round(params.pesoActual * 0.2),
              notas: "Comida pre-entrenamiento"
            }
          ]
        };
      }
    } catch (error) {
      logger.error('Error generating nutrition plan:', error);
      throw new Error('Error al generar plan de alimentación');
    }
  }

  async analyzePerformance(atletaId: number, rendimientoData: any[]) {
    try {
      const prompt = `
      Analiza el siguiente historial de rendimiento de un atleta de powerlifting y proporciona insights:

      Datos de rendimiento: ${JSON.stringify(rendimientoData)}

      Proporciona:
      1. Análisis de tendencias en cada levantamiento
      2. Identificación de fortalezas y debilidades
      3. Recomendaciones específicas para mejorar
      4. Predicción de potencial futuro

      Responde en formato JSON con análisis detallado.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Eres un analista de rendimiento deportivo especializado en powerlifting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      logger.error('Error analyzing performance:', error);
      throw new Error('Error al analizar rendimiento');
    }
  }
}

export const aiService = new AIService();
\`\`\`

### 5. Servicio de Cálculo Wilks
\`\`\`typescript
// src/services/wilks.service.ts
export class WilksService {
  // Coeficientes Wilks 2020
  private static readonly MALE_COEFFICIENTS = {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863E-06,
    f: -1.291E-08
  };

  private static readonly FEMALE_COEFFICIENTS = {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582E-05,
    f: -9.054E-08
  };

  static calculateWilks(total: number, bodyweight: number, isMale: boolean): number {
    const coeffs = isMale ? this.MALE_COEFFICIENTS : this.FEMALE_COEFFICIENTS;
    
    const denominator = coeffs.a + 
      coeffs.b * bodyweight + 
      coeffs.c * Math.pow(bodyweight, 2) + 
      coeffs.d * Math.pow(bodyweight, 3) + 
      coeffs.e * Math.pow(bodyweight, 4) + 
      coeffs.f * Math.pow(bodyweight, 5);
    
    const wilksCoeff = 500 / denominator;
    
    return Math.round((total * wilksCoeff) * 100) / 100;
  }

  static getWeightCategory(weight: number, isMale: boolean): string {
    const maleCategories = [59, 66, 74, 83, 93, 105, 120];
    const femaleCategories = [47, 52, 57, 63, 69, 76, 84];
    
    const categories = isMale ? maleCategories : femaleCategories;
    
    for (const category of categories) {
      if (weight <= category) {
        return category.toString();
      }
    }
    
    return isMale ? '120+' : '84+';
  }
}
\`\`\`

## 🔐 Autenticación y Seguridad

### 1. Servicio de Autenticación
\`\`\`typescript
// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '../app';
import { emailService } from './email.service';
import { smsService } from './sms.service';
import logger from '../utils/logger';

export class AuthService {
  async login(nombreUsuario: string, contrasena: string, ip: string) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { nombreUsuario },
        include: { rol: true, auth2fa: true }
      });

      if (!usuario || !usuario.activo) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar si está bloqueado
      if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
        throw new Error('Usuario bloqueado temporalmente');
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(contrasena, usuario.contrasenaHash);
      
      if (!isValidPassword) {
        // Incrementar intentos fallidos
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: {
            intentosLogin: usuario.intentosLogin + 1,
            bloqueadoHasta: usuario.intentosLogin >= 4 ? 
              new Date(Date.now() + 15 * 60 * 1000) : // 15 minutos
              undefined
          }
        });
        throw new Error('Credenciales inválidas');
      }

      // Reset intentos de login
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          intentosLogin: 0,
          bloqueadoHasta: null,
          ultimoLogin: new Date()
        }
      });

      // Verificar si requiere 2FA
      if (usuario.auth2fa?.activo) {
        return {
          requires2FA: true,
          has2FASetup: true,
          userId: usuario.id
        };
      }

      // Si no tiene 2FA configurado, requerirlo para admin/entrenador
      if (['Administrador', 'Entrenador'].includes(usuario.rol.nombre)) {
        const secret = speakeasy.generateSecret({
          name: `Powerlifting Federation (${usuario.email})`,
          issuer: 'Powerlifting Federation'
        });

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
        const backupCodes = this.generateBackupCodes();

        await prisma.auth2FA.upsert({
          where: { usuarioId: usuario.id },
          create: {
            usuarioId: usuario.id,
            secret: secret.base32,
            backupCodes,
            activo: false
          },
          update: {
            secret: secret.base32,
            backupCodes
          }
        });

        return {
          requires2FA: true,
          has2FASetup: false,
          qrCode: qrCodeUrl,
          backupCodes,
          userId: usuario.id
        };
      }

      // Generar tokens
      const tokens = this.generateTokens(usuario);
      
      return {
        requires2FA: false,
        tokens,
        user: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          email: usuario.email,
          rol: usuario.rol.nombre
        }
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async verify2FA(userId: number, code: string, method: string) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: { rol: true, auth2fa: true }
      });

      if (!usuario || !usuario.auth2fa) {
        throw new Error('Usuario no encontrado');
      }

      let isValidCode = false;

      switch (method) {
        case 'app':
          isValidCode = speakeasy.totp.verify({
            secret: usuario.auth2fa.secret!,
            encoding: 'base32',
            token: code,
            window: 2
          });
          break;
        
        case 'backup':
          isValidCode = usuario.auth2fa.backupCodes.includes(code);
          if (isValidCode) {
            // Remover código usado
            const updatedCodes = usuario.auth2fa.backupCodes.filter(c => c !== code);
            await prisma.auth2FA.update({
              where: { usuarioId: userId },
              data: { backupCodes: updatedCodes }
            });
          }
          break;
        
        case 'sms':
        case 'email':
          // Verificar código temporal (implementar cache/redis)
          isValidCode = await this.verifyTemporaryCode(userId, code, method);
          break;
      }

      if (!isValidCode) {
        throw new Error('Código inválido');
      }

      // Activar 2FA si es primera vez
      if (!usuario.auth2fa.activo) {
        await prisma.auth2FA.update({
          where: { usuarioId: userId },
          data: { activo: true }
        });
      }

      const tokens = this.generateTokens(usuario);
      
      return {
        tokens,
        user: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          email: usuario.email,
          rol: usuario.rol.nombre
        }
      };
    } catch (error) {
      logger.error('2FA verification error:', error);
      throw error;
    }
  }

  async sendCode(userId: number, method: 'sms' | 'email') {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: { auth2fa: true }
      });

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Guardar código temporal (implementar con Redis en producción)
      await this.saveTemporaryCode(userId, code, method);

      if (method === 'sms' && usuario.auth2fa?.phone) {
        await smsService.sendCode(usuario.auth2fa.phone, code);
      } else if (method === 'email') {
        await emailService.send2FACode(usuario.email, code);
      }

      return { success: true };
    } catch (error) {
      logger.error('Send code error:', error);
      throw error;
    }
  }

  private generateTokens(usuario: any) {
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    });

    return { accessToken, refreshToken };
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    return codes;
  }

  private async saveTemporaryCode(userId: number, code: string, method: string) {
    // En producción, usar Redis
    // Por ahora, guardar en memoria o base de datos temporal
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    
    // Implementar según tu estrategia de cache
    logger.info(`Temporary code for user ${userId}: ${code} (${method})`);
  }

  private async verifyTemporaryCode(userId: number, code: string, method: string): Promise<boolean> {
    // Implementar verificación de código temporal
    // Por ahora, códigos de prueba
    const testCodes = { sms: '111111', email: '333333' };
    return code === testCodes[method as keyof typeof testCodes];
  }
}

export const authService = new AuthService();
\`\`\`

## 🧪 Testing

### 1. Configuración de Jest
\`\`\`javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
\`\`\`

### 2. Setup de Testing
\`\`\`typescript
// src/tests/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL || 'postgresql://test:test@localhost:5432/powerlifting_test'
    }
  }
});

beforeAll(async () => {
  // Limpiar base de datos de prueba
  await prisma.$executeRaw`TRUNCATE TABLE usuarios, atletas, resultados CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
\`\`\`

### 3. Test de Ejemplo
\`\`\`typescript
// src/tests/atletas.test.ts
import request from 'supertest';
import app from '../app';
import { prisma } from './setup';

describe('Atletas API', () => {
  let authToken: string;
  let atletaId: number;

  beforeAll(async () => {
    // Crear usuario de prueba y obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        nombreUsuario: 'test_admin',
        contrasena: 'test123'
      });
    
    authToken = loginResponse.body.tokens.accessToken;
  });

  describe('POST /api/atletas', () => {
    it('should create a new atleta', async () => {
      const atletaData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1995-01-01',
        genero: 'Masculino',
        pais: 'México',
        email: 'juan@test.com'
      };

      const response = await request(app)
        .post('/api/atletas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(atletaData)
        .expect(201);

      expect(response.body).toMatchObject(atletaData);
      expect(response.body.id).toBeDefined();
      atletaId = response.body.id;
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/atletas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Juan'
          // Faltan campos requeridos
        })
        .expect(400);

      expect(response.body.error).toBe('Datos inválidos');
    });
  });

  describe('GET /api/atletas', () => {
    it('should return paginated atletas', async () => {
      const response = await request(app)
        .get('/api/atletas?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/atletas/:id', () => {
    it('should return atleta by id', async () => {
      const response = await request(app)
        .get(`/api/atletas/${atletaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(atletaId);
    });

    it('should return 404 for non-existent atleta', async () => {
      await request(app)
        .get('/api/atletas/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
\`\`\`

## 🚀 Deployment

### 1. Dockerfile
\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3001

CMD ["npm", "start"]
\`\`\`

### 2. Docker Compose
\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: powerlifting_federation
      POSTGRES_USER: powerlifting_app
      POSTGRES_PASSWORD: secure_password_here
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    environment:
      DATABASE_URL: postgresql://powerlifting_app:secure_password_here@postgres:5432/powerlifting_federation
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-super-secret-jwt-key
      OPENAI_API_KEY: your-openai-key
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs

volumes:
  postgres_data:
\`\`\`

### 3. Scripts de Package.json
\`\`\`json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:seed": "ts-node src/scripts/seed.ts",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  }
}
\`\`\`

## 📊 Monitoreo y Logs

### 1. Configuración de Winston
\`\`\`typescript
// src/utils/logger.ts
import winston from 'winston';
import path from 'path';

const logDir = process.env.LOG_FILE_PATH || './logs';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'powerlifting-backend' },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
\`\`\`

## 🔧 Comandos de Desarrollo

\`\`\`bash
# Instalar dependencias
npm install

# Configurar base de datos
createdb powerlifting_federation
psql -d powerlifting_federation -f database/schema.sql

# Generar cliente Prisma
npx prisma generate

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm test

# Construir para producción
npm run build

# Ejecutar en producción
npm start
\`\`\`

## 📝 Notas Importantes

1. **Seguridad**: Implementar rate limiting, validación de entrada, y sanitización
2. **Performance**: Usar índices de base de datos, cache con Redis, y paginación
3. **Escalabilidad**: Considerar microservicios para módulos grandes
4. **Monitoreo**: Implementar health checks y métricas
5. **Backup**: Configurar backups automáticos de PostgreSQL
6. **SSL**: Usar HTTPS en producción
7. **Variables de Entorno**: Nunca commitear secrets al repositorio

Este backend proporcionará una base sólida y escalable para tu sistema de gestión de powerlifting con todas las funcionalidades requeridas por el frontend.
