import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria (misma que en route.ts)
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const index = entrenamientos.findIndex((entrenamiento) => entrenamiento.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Entrenamiento not found" }, { status: 404 })
    }

    entrenamientos[index] = { ...entrenamientos[index], ...body }
    return NextResponse.json(entrenamientos[index])
  } catch (error) {
    return NextResponse.json({ error: "Error updating entrenamiento" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const index = entrenamientos.findIndex((entrenamiento) => entrenamiento.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Entrenamiento not found" }, { status: 404 })
    }

    entrenamientos.splice(index, 1)
    return NextResponse.json({ message: "Entrenamiento deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting entrenamiento" }, { status: 500 })
  }
}
