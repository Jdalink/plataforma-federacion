import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria (misma que en route.ts)
const entrenadores = [
  {
    id: 1,
    nombre: "Roberto",
    apellido: "Martínez",
    experiencia: "15 años de experiencia en atletismo de alto rendimiento. Especialista en velocidad y saltos.",
    email: "roberto.martinez@email.com",
    telefono: "+52 555 987 6543",
  },
  {
    id: 2,
    nombre: "Ana",
    apellido: "García",
    experiencia: "10 años entrenando natación competitiva. Certificada por la Federación Internacional de Natación.",
    email: "ana.garcia@email.com",
    telefono: "+34 612 987 654",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "López",
    experiencia: "8 años en entrenamiento funcional y preparación física. Especialista en deportes de resistencia.",
    email: "carlos.lopez@email.com",
    telefono: "+55 11 87654 3210",
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const index = entrenadores.findIndex((entrenador) => entrenador.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Entrenador not found" }, { status: 404 })
    }

    entrenadores[index] = { ...entrenadores[index], ...body }
    return NextResponse.json(entrenadores[index])
  } catch (error) {
    return NextResponse.json({ error: "Error updating entrenador" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const index = entrenadores.findIndex((entrenador) => entrenador.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Entrenador not found" }, { status: 404 })
    }

    entrenadores.splice(index, 1)
    return NextResponse.json({ message: "Entrenador deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting entrenador" }, { status: 500 })
  }
}
