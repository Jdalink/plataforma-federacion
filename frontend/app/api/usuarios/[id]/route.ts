import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria (misma que en route.ts)
const usuarios = [
  {
    id: 1,
    nombre_usuario: "admin",
    email: "admin@sistema.com",
    contrasena: "admin123",
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const index = usuarios.findIndex((usuario) => usuario.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Usuario not found" }, { status: 404 })
    }

    // Si no se proporciona contraseña, mantener la actual
    if (!body.contrasena) {
      delete body.contrasena
    }

    usuarios[index] = { ...usuarios[index], ...body }

    // No devolvemos la contraseña
    const { contrasena, ...usuarioSinPassword } = usuarios[index]
    return NextResponse.json(usuarioSinPassword)
  } catch (error) {
    return NextResponse.json({ error: "Error updating usuario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const index = usuarios.findIndex((usuario) => usuario.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Usuario not found" }, { status: 404 })
    }

    usuarios.splice(index, 1)
    return NextResponse.json({ message: "Usuario deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting usuario" }, { status: 500 })
  }
}
