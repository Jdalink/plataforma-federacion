import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
const entrenamientos = [
  {
    id: 1,
    atleta_id: 1,
    fecha: "2024-01-15",
    descripcion: "Entrenamiento de resistencia cardiovascular - 5km de carrera continua",
    duracion: 45,
    intensidad: "Media",
  },
  {
    id: 2,
    atleta_id: 2,
    fecha: "2024-01-16",
    descripcion: "Entrenamiento de fuerza - Pesas y ejercicios funcionales",
    duracion: 60,
    intensidad: "Alta",
  },
  {
    id: 3,
    atleta_id: 3,
    fecha: "2024-01-17",
    descripcion: "Entrenamiento de flexibilidad y recuperación - Yoga y estiramientos",
    duracion: 30,
    intensidad: "Baja",
  },
]

let nextId = 4

export async function GET() {
  return NextResponse.json(entrenamientos)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newEntrenamiento = {
      id: nextId++,
      ...body,
    }
    entrenamientos.push(newEntrenamiento)
    return NextResponse.json(newEntrenamiento, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating entrenamiento" }, { status: 500 })
  }
}
