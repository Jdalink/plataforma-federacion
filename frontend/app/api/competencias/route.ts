import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
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

let nextId = 4

export async function GET() {
  return NextResponse.json(competencias)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCompetencia = {
      id: nextId++,
      ...body,
    }
    competencias.push(newCompetencia)
    return NextResponse.json(newCompetencia, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating competencia" }, { status: 500 })
  }
}
