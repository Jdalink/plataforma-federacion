import { type NextRequest, NextResponse } from "next/server"

// Simulamos planes de alimentación
const planesAlimentacion: Record<string, any[]> = {
  "1": [
    {
      id: "plan_alim_1_1",
      atleta_id: 1,
      objetivo: "ganancia_peso",
      peso_actual: 75,
      peso_objetivo: 80,
      actividad_nivel: "intenso",
      restricciones: "Sin lactosa",
      plan_detallado:
        "Plan hipercalórico diseñado para ganancia de masa muscular magra. Incluye 6 comidas al día con énfasis en proteínas de alta calidad y carbohidratos complejos.",
      comidas: [
        {
          nombre: "Desayuno",
          horario: "7:00 AM",
          alimentos: ["Avena", "Plátano", "Proteína en polvo", "Almendras"],
          calorias: 650,
          proteinas: 35,
          carbohidratos: 75,
          grasas: 18,
          notas: "Ideal pre-entrenamiento",
        },
        {
          nombre: "Media Mañana",
          horario: "10:00 AM",
          alimentos: ["Yogur griego", "Berries", "Granola"],
          calorias: 350,
          proteinas: 20,
          carbohidratos: 45,
          grasas: 8,
          notas: "Snack ligero",
        },
      ],
      fecha_creacion: "2024-01-20",
      duracion_semanas: 8,
      calorias_diarias: 3200,
      macros: {
        proteinas: 160,
        carbohidratos: 400,
        grasas: 107,
      },
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { atletaId: string } }) {
  try {
    const atletaId = params.atletaId
    const data = planesAlimentacion[atletaId] || []
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching planes alimentacion" }, { status: 500 })
  }
}
