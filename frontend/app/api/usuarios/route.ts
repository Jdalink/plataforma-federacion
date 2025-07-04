import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
const usuarios = [
  {
    id: 1,
    nombre_usuario: "admin",
    email: "admin@sistema.com",
    contrasena: "admin123", // En producción esto estaría hasheado
    rol_id: 1,
    activo: true,
  },
  {
    id: 2,
    nombre_usuario: "entrenador1",
    email: "entrenador1@sistema.com",
    contrasena: "entrenador123",
    rol_id: 2,
    activo: true,
  },
  {
    id: 3,
    nombre_usuario: "atleta1",
    email: "atleta1@sistema.com",
    contrasena: "atleta123",
    rol_id: 3,
    activo: true,
  },
]

let nextId = 4

export async function GET() {
  // No devolvemos las contraseñas
  const usuariosSinPassword = usuarios.map(({ contrasena, ...usuario }) => usuario)
  return NextResponse.json(usuariosSinPassword)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newUsuario = {
      id: nextId++,
      ...body,
    }
    usuarios.push(newUsuario)

    // No devolvemos la contraseña
    const { contrasena, ...usuarioSinPassword } = newUsuario
    return NextResponse.json(usuarioSinPassword, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating usuario" }, { status: 500 })
  }
}
