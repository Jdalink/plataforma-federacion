import type { CorsOptions } from "cors";
// FIX: Se cambió la importación a una importación nombrada
import { logger } from "@/utils/logger";

const getAllowedOrigins = (): string[] => {
  const origins = process.env.CORS_ORIGIN || "http://localhost:3000, http://104.198.235.137:3000";
  return origins.split(",").map((origin) => origin.trim());
};

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      logger.debug(`CORS: Permitiendo origin ${origin}`);
      callback(null, true);
    } else {
      logger.warn(`CORS: Bloqueando origin ${origin}`);
      callback(new Error("No permitido por política CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};