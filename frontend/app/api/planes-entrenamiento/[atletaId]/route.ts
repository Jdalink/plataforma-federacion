import { type NextRequest, NextResponse } from "next/server"

// Simulamos planes de entrenamiento
const planesEntrenamiento: Record<string, any[]> = {
  "1": [
    {
      id: "plan_1_1",
      atleta_id: 1,
      objetivo: "fuerza_maxima",
      nivel: "intermedio",
      frecuencia: 4,
      plan_detallado:
        "Plan de 8 semanas enfocado en el desarrollo de fuerza máxima en los tres levantamientos principales. Incluye periodización lineal con incrementos progresivos de carga.",
      ejercicios: [
        {
          nombre: "Sentadilla Trasera",
          series: 4,
          repeticiones: "3-5",
          peso_sugerido: "85-90% 1RM",
          descanso: "3-4 min",
          notas: "Enfoque en técnica perfecta",
        },
        {
          nombre: "Press de Banca",
          series: 4,
          repeticiones: "3-5",
          peso_sugerido: "85-90% 1RM",
          descanso: "3-4 min",
          notas: "Pausa completa en el pecho",
        },
        {
          nombre: "Peso Muerto",
          series: 3,
          repeticiones: "3-5",
          peso_sugerido: "85-90% 1RM",
          descanso: "4-5 min",
          notas: "Activación de glúteos",
        },
      ],
      fecha_creacion: "2024-01-15",
      duracion_semanas: 8,
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { atletaId: string } }) {
  try {
    const atletaId = params.atletaId
    const data = planesEntrenamiento[atletaId] || []
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching planes entrenamiento" }, { status: 500 })
  }
}
