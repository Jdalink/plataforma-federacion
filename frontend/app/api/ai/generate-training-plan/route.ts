import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { atleta_id, objetivo, nivel, frecuencia, duracion, limitaciones } = await request.json()

    const prompt = `
    Eres un entrenador experto en powerlifting. Genera un plan de entrenamiento detallado con las siguientes especificaciones:

    - Objetivo: ${objetivo}
    - Nivel del atleta: ${nivel}
    - Frecuencia: ${frecuencia} días por semana
    - Duración: ${duracion} semanas
    - Limitaciones: ${limitaciones || "Ninguna"}

    El plan debe incluir:
    1. Una descripción general del plan (2-3 párrafos)
    2. Lista de ejercicios específicos con series, repeticiones, peso sugerido y descansos
    3. Enfoque en los tres levantamientos principales: sentadilla, press de banca y peso muerto
    4. Ejercicios accesorios apropiados para el nivel

    Responde en formato JSON con esta estructura:
    {
      "plan_detallado": "descripción del plan",
      "ejercicios": [
        {
          "nombre": "nombre del ejercicio",
          "series": número,
          "repeticiones": "rango de reps",
          "peso_sugerido": "porcentaje o descripción",
          "descanso": "tiempo de descanso",
          "notas": "notas adicionales"
        }
      ]
    }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "Eres un entrenador experto en powerlifting con 15 años de experiencia. Siempre respondes en español y con información técnicamente correcta.",
    })

    // Intentamos parsear la respuesta como JSON
    let planData
    try {
      planData = JSON.parse(text)
    } catch {
      // Si no es JSON válido, creamos una estructura básica
      planData = {
        plan_detallado: text,
        ejercicios: [
          {
            nombre: "Sentadilla Trasera",
            series: 4,
            repeticiones: "5-8",
            peso_sugerido: "80-85% 1RM",
            descanso: "3-4 min",
            notas: "Enfoque en técnica",
          },
          {
            nombre: "Press de Banca",
            series: 4,
            repeticiones: "5-8",
            peso_sugerido: "80-85% 1RM",
            descanso: "3-4 min",
            notas: "Pausa en el pecho",
          },
          {
            nombre: "Peso Muerto",
            series: 3,
            repeticiones: "5-8",
            peso_sugerido: "80-85% 1RM",
            descanso: "4-5 min",
            notas: "Activación de glúteos",
          },
        ],
      }
    }

    // Guardamos el plan (simulado)
    const newPlan = {
      id: `plan_${Date.now()}`,
      atleta_id,
      objetivo,
      nivel,
      frecuencia,
      duracion_semanas: duracion,
      ...planData,
      fecha_creacion: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    console.error("Error generating training plan:", error)
    return NextResponse.json({ error: "Error al generar el plan de entrenamiento" }, { status: 500 })
  }
}
