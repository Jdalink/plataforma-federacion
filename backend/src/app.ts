import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { corsConfig } from "@/config/cors";
import { helmetConfig } from "@/config/security";
import { errorHandler } from "@/middleware/error.middleware";
import { rateLimitMiddleware } from "@/middleware/rate-limit.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { logger } from "@/utils/logger";
import rolesRoutes from '@/routes/roles.routes'; 

// Importación de todas las rutas
import authRoutes from "@/routes/auth.routes";
import usuariosRoutes from '@/routes/usuarios.routes';
// (Aquí importarás las otras rutas de módulos a medida que los desarrolles)
// import atletasRoutes from '@/routes/atletas.routes'; 

const app = express();

// Middlewares
app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(rateLimitMiddleware);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("combined", { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.startTime = Date.now();
  next();
});

// Rutas Públicas (como login y health check)
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRoutes);

// Middleware de Autenticación para todas las rutas API siguientes
app.use("/api", authMiddleware);

// Rutas Protegidas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/roles", rolesRoutes);
// app.use("/api/atletas", atletasRoutes);
// (Aquí registrarás las otras rutas)

// Manejador de Errores Final
app.use(errorHandler);

export default app;