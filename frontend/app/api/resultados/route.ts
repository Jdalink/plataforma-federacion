import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
const resultados = [
  {
    id: 1,
    evento_id: 1,
    atleta_id: 1,
    sentadilla: 200,
    press_banca: 120,
    peso_muerto: 220,
    categoria_peso: 83,
    wilks_score: 450.5,
    total: 540,
  },
  {
    id: 2,
    evento_id: 1,
    atleta_id: 2,
    sentadilla: 180,
    press_banca: 110,
    peso_muerto: 210,
    categoria_peso: 83,
    wilks_score: 420.0,
    total: 500,
  },
  {
    id: 3,
    evento_id: 2,
    atleta_id: 3,
    sentadilla: 220,
    press_banca: 130,
    peso_muerto: 240,
    categoria_peso: 93,
    wilks_score: 480.7,
    total: 590,
  },
  {
    id: 4,
    evento_id: 2,
    atleta_id: 1,
    sentadilla: 190,
    press_banca: 115,
    peso_muerto: 200,
    categoria_peso: 74,
    wilks_score: 430.2,
    total: 505,
  },
]

let nextId = 5

export async function GET() {
  return NextResponse.json(resultados)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newResultado = {
      id: nextId++,
      ...body,
    }
    resultados.push(newResultado)
    return NextResponse.json(newResultado, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating resultado" }, { status: 500 })
  }
}
