import type { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  await knex("usuarios").del();
  await knex("roles").del();

  const [adminRole] = await knex("roles").insert({ nombre: "Administrador" }).returning("id");

  const hashedPassword = await bcrypt.hash("password", 10);

  await knex("usuarios").insert({
    nombre_usuario: "admin",
    email: "admin@powerlifting.com", // Login con este email
    contrasena_hash: hashedPassword,
    rol_id: adminRole.id,
    activo: true,
  });
}