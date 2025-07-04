/**
 * Configuración de Knex para diferentes entornos
 *
 * ¿Por qué Knex?
 * - Query builder potente y flexible
 * - Sistema de migraciones robusto
 * - Compatible con múltiples bases de datos
 * - Muy ligero comparado con ORMs completos
 */

require("dotenv").config()

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_HOST || "localhost",
      port: process.env.DATABASE_PORT || 5432,
      database: process.env.DATABASE_NAME || "powerlifting_federation",
      user: process.env.DATABASE_USER || "powerlifting_user",
      password: process.env.DATABASE_PASSWORD || "secure_password_123",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  test: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_TEST_HOST || "localhost",
      port: process.env.DATABASE_TEST_PORT || 5432,
      database: process.env.DATABASE_TEST_NAME || "powerlifting_test",
      user: process.env.DATABASE_TEST_USER || "powerlifting_user",
      password: process.env.DATABASE_TEST_PASSWORD || "secure_password_123",
    },
    pool: {
      min: 1,
      max: 5,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },
}