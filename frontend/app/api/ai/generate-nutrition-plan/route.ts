import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { atleta_id, objetivo, peso_actual, peso_objetivo, actividad_nivel, restricciones, duracion, preferencias } =
      await request.json()

    const prompt = `
    Eres un nutricionista deportivo especializado en powerlifting. Genera un plan de alimentación detallado con las siguientes especificaciones:

    - Objetivo: ${objetivo}
    - Peso actual: ${peso_actual}kg
    - Peso objetivo: ${peso_objetivo ? peso_objetivo + "kg" : "No especificado"}
    - Nivel de actividad: ${actividad_nivel}
    - Restricciones: ${restricciones || "Ninguna"}
    - Preferencias: ${preferencias || "Ninguna"}
    - Duración: ${duracion} semanas

    El plan debe incluir:
    1. Una descripción general del plan nutricional (2-3 párrafos)
    2. Cálculo de calorías diarias totales
    3. Distribución de macronutrientes (proteínas, carbohidratos, grasas en gramos)
    4. Plan de comidas detallado con al menos 5 comidas al día
    5. Cada comida debe incluir alimentos específicos, calorías y macros

    Responde en formato JSON con esta estructura:
    {
      "plan_detallado": "descripción del plan",
      "calorias_diarias": número,
      "macros": {
        "proteinas": número,
        "carbohidratos": número,
        "grasas": número
      },
      "comidas": [
        {
          "nombre": "nombre de la comida",
          "horario": "hora sugerida",
          "alimentos": ["alimento1", "alimento2"],
          "calorias": número,
          "proteinas": número,
          "carbohidratos": número,
          "grasas": número,
          "notas": "notas adicionales"
        }
      ]
    }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "Eres un nutricionista deportivo con especialización en powerlifting y 10 años de experiencia. Siempre respondes en español con información nutricional precisa.",
    })

    // Intentamos parsear la respuesta como JSON
    let planData
    try {
      planData = JSON.parse(text)
    } catch {
      // Si no es JSON válido, creamos una estructura básica
      const calorias = peso_actual * (actividad_nivel === "intenso" ? 35 : actividad_nivel === "moderado" ? 30 : 25)
      planData = {
        plan_detallado: text,
        calorias_diarias: Math.round(calorias),
        macros: {
          proteinas: Math.round(peso_actual * 2.2),
          carbohidratos: Math.round(peso_actual * 4),
          grasas: Math.round(peso_actual * 1),
        },
        comidas: [
          {
            nombre: "Desayuno",
            horario: "7:00 AM",
            alimentos: ["Avena", "Plátano", "Proteína en polvo"],
            calorias: Math.round(calorias * 0.25),
            proteinas: Math.round(peso_actual * 0.5),
            carbohidratos: Math.round(peso_actual * 1),
            grasas: Math.round(peso_actual * 0.2),
            notas: "Comida pre-entrenamiento",
          },
        ],
      }
    }

    // Guardamos el plan (simulado)
    const newPlan = {
      id: `plan_alim_${Date.now()}`,
      atleta_id,
      objetivo,
      peso_actual,
      peso_objetivo,
      actividad_nivel,
      restricciones,
      duracion_semanas: duracion,
      ...planData,
      fecha_creacion: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    console.error("Error generating nutrition plan:", error)
    return NextResponse.json({ error: "Error al generar el plan de alimentación" }, { status: 500 })
  }
}
