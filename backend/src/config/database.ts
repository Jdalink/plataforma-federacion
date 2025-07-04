/**
 * Configuración y conexión a la base de datos
 *
 * ¿Por qué esta estructura?
 * - Singleton pattern para la conexión
 * - Manejo de errores centralizado
 * - Pool de conexiones optimizado
 * - Fácil testing y mocking
 */

import knex, { type Knex } from "knex"
import { logger } from "@/utils/logger"

const knexConfig = require("../../knexfile")

class Database {
  private static instance: Database
  private knexInstance: Knex

  private constructor() {
    const environment = process.env.NODE_ENV || "development"
    const config = knexConfig[environment]

    this.knexInstance = knex(config)
    this.setupEventListeners()
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  public getKnex(): Knex {
    return this.knexInstance
  }

  private setupEventListeners(): void {
    // Log de queries en desarrollo
    if (process.env.NODE_ENV === "development") {
      this.knexInstance.on("query", (query) => {
        logger.debug("SQL Query:", {
          sql: query.sql,
          bindings: query.bindings,
        })
      })
    }

    // Log de queries lentas
    this.knexInstance.on("query", (query) => {
      const startTime = Date.now()

      query.response = query.response || {}
      const originalCallback = query.response.callback

      query.response.callback = function (...args: any[]) {
        const duration = Date.now() - startTime

        if (duration > 1000) {
          // Queries que tomen más de 1 segundo
          logger.warn("Slow query detected:", {
            sql: query.sql,
            duration: `${duration}ms`,
            bindings: query.bindings,
          })
        }

        if (originalCallback) {
          originalCallback.apply(this, args)
        }
      }
    })
  }

  public async testConnection(): Promise<boolean> {
    try {
      await this.knexInstance.raw("SELECT 1")
      logger.info("✅ Conexión a base de datos establecida")
      return true
    } catch (error) {
      logger.error("❌ Error conectando a base de datos:", error)
      return false
    }
  }

  public async runMigrations(): Promise<void> {
    try {
      logger.info("Ejecutando migraciones...")
      await this.knexInstance.migrate.latest()
      logger.info("✅ Migraciones completadas")
    } catch (error) {
      logger.error("❌ Error ejecutando migraciones:", error)
      throw error
    }
  }

  public async rollbackMigrations(): Promise<void> {
    try {
      logger.info("Revirtiendo migraciones...")
      await this.knexInstance.migrate.rollback()
      logger.info("✅ Migraciones revertidas")
    } catch (error) {
      logger.error("❌ Error revirtiendo migraciones:", error)
      throw error
    }
  }

  public async runSeeds(): Promise<void> {
    try {
      logger.info("Ejecutando seeds...")
      await this.knexInstance.seed.run()
      logger.info("✅ Seeds completados")
    } catch (error) {
      logger.error("❌ Error ejecutando seeds:", error)
      throw error
    }
  }

  public async close(): Promise<void> {
    try {
      await this.knexInstance.destroy()
      logger.info("✅ Conexión a base de datos cerrada")
    } catch (error) {
      logger.error("❌ Error cerrando conexión:", error)
      throw error
    }
  }
}

// Exportar instancia singleton
export const database = Database.getInstance()
export const db = database.getKnex()

// Helper para transacciones
export const withTransaction = async <T>(
  callback: (trx: Knex.Transaction) => Promise<T>
): Promise<T> => {
  return db.transaction(callback);
}

// Helper para paginación
export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const paginate = async <T>(
  query: Knex.QueryBuilder,
  options: PaginationOptions
): Promise<PaginatedResult<T>> => {
  const { page, limit } = options
  const offset = (page - 1) * limit

  // Clonar query para contar total
  const countQuery = query.clone().clearSelect().clearOrder().count("* as total")
  const [{ total }] = await countQuery
  const totalCount = Number.parseInt(total as string, 10)

  // Ejecutar query con paginación
  const data = await query.offset(offset).limit(limit)

  const totalPages = Math.ceil(totalCount / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}