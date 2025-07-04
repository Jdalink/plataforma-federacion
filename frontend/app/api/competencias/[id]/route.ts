import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria (misma que en route.ts)
const competencias = [
  {
    id: 1,
    nombre: "Campeonato Nacional de Atletismo",
    fecha: "2024-06-15",
    ubicacion: "Estadio Olímpico, Ciudad de México",
    tipo: "Nacional",
    organizador: "Federación Mexicana de Atletismo",
  },
  {
    id: 2,
    nombre: "Copa Internacional de Natación",
    fecha: "2024-07-20",
    ubicacion: "Centro Acuático Nacional, Madrid",
    tipo: "Internacional",
    organizador: "Federación Internacional de Natación",
  },
  {
    id: 3,
    nombre: "Maratón de la Ciudad",
    fecha: "2024-08-10",
    ubicacion: "Centro Histórico, São Paulo",
    tipo: "Nacional",
    organizador: "Confederación Brasileña de Atletismo",
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const index = competencias.findIndex((competencia) => competencia.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Competencia not found" }, { status: 404 })
    }

    competencias[index] = { ...competencias[index], ...body }
    return NextResponse.json(competencias[index])
  } catch (error) {
    return NextResponse.json({ error: "Error updating competencia" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const index = competencias.findIndex((competencia) => competencia.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Competencia not found" }, { status: 404 })
    }

    competencias.splice(index, 1)
    return NextResponse.json({ message: "Competencia deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting competencia" }, { status: 500 })
  }
}
