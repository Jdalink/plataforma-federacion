import dotenv from "dotenv";
import { database } from "@/config/database";
import app from "./app";
import { logger } from "@/utils/logger";

dotenv.config();
const PORT = process.env.PORT || 3001;

async function startServer() {
  console.log("--- INICIANDO PROCESO DE ARRANQUE DEL SERVIDOR ---");
  try {
    await database.testConnection();
    console.log("[Paso 1/3] Conexión a DB exitosa.");

    await database.runMigrations();
    console.log("[Paso 2/3] Migraciones completadas.");

    // Solo ejecutar seeds en desarrollo para crear el usuario admin
    if (process.env.NODE_ENV === 'development') {
      await database.runSeeds();
    }

    app.listen(PORT, () => {
      console.log(`[Paso 3/3] ¡ÉXITO! Servidor escuchando en puerto ${PORT}`);
      logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("!!! ERROR FATAL DURANTE EL ARRANQUE:", error);
    process.exit(1);
  }
}

startServer();