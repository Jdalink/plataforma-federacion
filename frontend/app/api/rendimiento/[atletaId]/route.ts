import { type NextRequest, NextResponse } from "next/server"

// Simulamos datos de rendimiento para powerlifting
const rendimientoData: Record<string, any[]> = {
  "1": [
    {
      fecha: "2024-01-15",
      sentadilla: 120,
      press_banca: 80,
      peso_muerto: 140,
      total: 340,
      peso_corporal: 75,
      wilks: 285.2,
    },
    {
      fecha: "2024-02-15",
      sentadilla: 125,
      press_banca: 82,
      peso_muerto: 145,
      total: 352,
      peso_corporal: 76,
      wilks: 292.1,
    },
    {
      fecha: "2024-03-15",
      sentadilla: 130,
      press_banca: 85,
      peso_muerto: 150,
      total: 365,
      peso_corporal: 77,
      wilks: 298.5,
    },
    {
      fecha: "2024-04-15",
      sentadilla: 135,
      press_banca: 87,
      peso_muerto: 155,
      total: 377,
      peso_corporal: 78,
      wilks: 304.2,
    },
  ],
  "2": [
    {
      fecha: "2024-01-15",
      sentadilla: 90,
      press_banca: 60,
      peso_muerto: 110,
      total: 260,
      peso_corporal: 65,
      wilks: 245.8,
    },
    {
      fecha: "2024-02-15",
      sentadilla: 95,
      press_banca: 62,
      peso_muerto: 115,
      total: 272,
      peso_corporal: 66,
      wilks: 252.1,
    },
    {
      fecha: "2024-03-15",
      sentadilla: 100,
      press_banca: 65,
      peso_muerto: 120,
      total: 285,
      peso_corporal: 67,
      wilks: 258.9,
    },
  ],
  "3": [
    {
      fecha: "2024-01-15",
      sentadilla: 160,
      press_banca: 110,
      peso_muerto: 180,
      total: 450,
      peso_corporal: 85,
      wilks: 342.5,
    },
    {
      fecha: "2024-02-15",
      sentadilla: 165,
      press_banca: 115,
      peso_muerto: 185,
      total: 465,
      peso_corporal: 86,
      wilks: 348.2,
    },
    {
      fecha: "2024-03-15",
      sentadilla: 170,
      press_banca: 120,
      peso_muerto: 190,
      total: 480,
      peso_corporal: 87,
      wilks: 354.1,
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { atletaId: string } }) {
  try {
    const atletaId = params.atletaId
    const data = rendimientoData[atletaId] || []
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching rendimiento data" }, { status: 500 })
  }
}
