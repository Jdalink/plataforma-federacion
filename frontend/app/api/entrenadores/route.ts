import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
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

let nextId = 4

export async function GET() {
  return NextResponse.json(entrenadores)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newEntrenador = {
      id: nextId++,
      ...body,
    }
    entrenadores.push(newEntrenador)
    return NextResponse.json(newEntrenador, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating entrenador" }, { status: 500 })
  }
}
