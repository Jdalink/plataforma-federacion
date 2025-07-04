import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.string("nombre", 50).notNullable().unique();
  });

  await knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nombre_usuario", 50).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("contrasena_hash", 255).notNullable();
    table.integer("rol_id").unsigned().references("id").inTable("roles");
    table.boolean("activo").defaultTo(true);
    table.timestamp("ultimo_login");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("usuarios");
  await knex.schema.dropTableIfExists("roles");
}