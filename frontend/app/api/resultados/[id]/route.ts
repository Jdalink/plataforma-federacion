import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria (misma que en route.ts)
const resultados = [
  {
    id: 1,
    evento_id: 1,
    atleta_id: 1,
    posicion: 1,
    tiempo: 9.85,
    puntos: 100,
  },
  {
    id: 2,
    evento_id: 1,
    atleta_id: 2,
    posicion: 2,
    tiempo: 10.12,
    puntos: 80,
  },
  {
    id: 3,
    evento_id: 2,
    atleta_id: 3,
    posicion: 1,
    tiempo: 58.45,
    puntos: 100,
  },
  {
    id: 4,
    evento_id: 2,
    atleta_id: 1,
    posicion: 3,
    tiempo: 59.78,
    puntos: 60,
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const index = resultados.findIndex((resultado) => resultado.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Resultado not found" }, { status: 404 })
    }

    resultados[index] = { ...resultados[index], ...body }
    return NextResponse.json(resultados[index])
  } catch (error) {
    return NextResponse.json({ error: "Error updating resultado" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const index = resultados.findIndex((resultado) => resultado.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Resultado not found" }, { status: 404 })
    }

    resultados.splice(index, 1)
    return NextResponse.json({ message: "Resultado deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting resultado" }, { status: 500 })
  }
}
