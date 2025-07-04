import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
const eventos = [
  {
    id: 1,
    competencia_id: 1,
    nombre: "Sentadilla",
    categoria: "Open",
    fecha: "2024-06-15",
  },
  {
    id: 2,
    competencia_id: 1,
    nombre: "Press de Banca",
    categoria: "Open",
    fecha: "2024-06-16",
  },
  {
    id: 3,
    competencia_id: 2,
    nombre: "Peso Muerto",
    categoria: "Junior",
    fecha: "2024-07-20",
  },
  {
    id: 4,
    competencia_id: 3,
    nombre: "Sentadilla",
    categoria: "Master",
    fecha: "2024-08-10",
  },
]

let nextId = 5

export async function GET() {
  return NextResponse.json(eventos)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newEvento = {
      id: nextId++,
      ...body,
    }
    eventos.push(newEvento)
    return NextResponse.json(newEvento, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating evento" }, { status: 500 })
  }
}
