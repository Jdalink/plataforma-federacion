"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Dumbbell, Calendar, Target, Zap, Clock, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Atleta {
  id: number
  nombre: string
  apellido: string
}

interface PlanEntrenamiento {
  id: string
  atleta_id: number
  objetivo: string
  nivel: string
  frecuencia: number
  plan_detallado: string
  ejercicios: Ejercicio[]
  fecha_creacion: string
  duracion_semanas: number
}

interface Ejercicio {
  nombre: string
  series: number
  repeticiones: string
  peso_sugerido: string
  descanso: string
  notas: string
}

export default function PlanesEntrenamientoPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [selectedAtleta, setSelectedAtleta] = useState<string>("")
  const [planes, setPlanes] = useState<PlanEntrenamiento[]>([])
  const [loading, setLoading] = useState(false)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [planConfig, setPlanConfig] = useState({
    objetivo: "",
    nivel: "",
    frecuencia: "",
    duracion: "",
    limitaciones: "",
  })

  useEffect(() => {
    fetchAtletas()
  }, [])

  useEffect(() => {
    if (selectedAtleta) {
      fetchPlanes(selectedAtleta)
    }
  }, [selectedAtleta])

  const fetchAtletas = async () => {
    try {
      const response = await fetch("http://backend:3001/api/atletas")
      const data = await response.json()
      setAtletas(data)
    } catch (error) {
      console.error("Error fetching atletas:", error)
    }
  }

  const fetchPlanes = async (atletaId: string) => {
    try {
      const response = await fetch(`/api/planes-entrenamiento/${atletaId}`)
      const data = await response.json()
      setPlanes(data)
    } catch (error) {
      console.error("Error fetching planes:", error)
    }
  }

  const generatePlan = async () => {
    if (!selectedAtleta || !planConfig.objetivo || !planConfig.nivel || !planConfig.frecuencia) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    setGeneratingPlan(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://backend:3001/api/ai/generate-training-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atleta_id: Number.parseInt(selectedAtleta),
          ...planConfig,
          frecuencia: Number.parseInt(planConfig.frecuencia),
          duracion: Number.parseInt(planConfig.duracion),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Plan de entrenamiento generado exitosamente")
        fetchPlanes(selectedAtleta)
        setPlanConfig({
          objetivo: "",
          nivel: "",
          frecuencia: "",
          duracion: "",
          limitaciones: "",
        })
      } else {
        setError(data.error || "Error al generar el plan")
      }
    } catch (error) {
      setError("Error de conexión al generar el plan")
    } finally {
      setGeneratingPlan(false)
    }
  }

  const getAtletaNombre = (atletaId: string) => {
    const atleta = atletas.find((a) => a.id.toString() === atletaId)
    return atleta ? `${atleta.nombre} ${atleta.apellido}` : ""
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case "principiante":
        return "bg-green-100 text-green-800"
      case "intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Planes de Entrenamiento IA
          </h1>
          <p className="text-gray-600">Genera planes de entrenamiento personalizados con inteligencia artificial</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Generar Nuevo Plan
              </CardTitle>
              <CardDescription>Crea un plan personalizado con IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="atleta">Atleta</Label>
                <Select value={selectedAtleta} onValueChange={setSelectedAtleta}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona atleta" />
                  </SelectTrigger>
                  <SelectContent>
                    {atletas.map((atleta) => (
                      <SelectItem key={atleta.id} value={atleta.id.toString()}>
                        {atleta.nombre} {atleta.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="objetivo">Objetivo</Label>
                <Select
                  value={planConfig.objetivo}
                  onValueChange={(value) => setPlanConfig({ ...planConfig, objetivo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuerza_maxima">Fuerza Máxima</SelectItem>
                    <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                    <SelectItem value="potencia">Potencia</SelectItem>
                    <SelectItem value="competencia">Preparación para Competencia</SelectItem>
                    <SelectItem value="tecnica">Mejora de Técnica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nivel">Nivel</Label>
                <Select
                  value={planConfig.nivel}
                  onValueChange={(value) => setPlanConfig({ ...planConfig, nivel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principiante">Principiante</SelectItem>
                    <SelectItem value="intermedio">Intermedio</SelectItem>
                    <SelectItem value="avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="frecuencia">Frecuencia (días/semana)</Label>
                <Select
                  value={planConfig.frecuencia}
                  onValueChange={(value) => setPlanConfig({ ...planConfig, frecuencia: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Días por semana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 días</SelectItem>
                    <SelectItem value="4">4 días</SelectItem>
                    <SelectItem value="5">5 días</SelectItem>
                    <SelectItem value="6">6 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duracion">Duración (semanas)</Label>
                <Select
                  value={planConfig.duracion}
                  onValueChange={(value) => setPlanConfig({ ...planConfig, duracion: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duración del plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 semanas</SelectItem>
                    <SelectItem value="6">6 semanas</SelectItem>
                    <SelectItem value="8">8 semanas</SelectItem>
                    <SelectItem value="12">12 semanas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="limitaciones">Limitaciones o Notas</Label>
                <Textarea
                  id="limitaciones"
                  value={planConfig.limitaciones}
                  onChange={(e) => setPlanConfig({ ...planConfig, limitaciones: e.target.value })}
                  placeholder="Lesiones, limitaciones de tiempo, equipamiento disponible..."
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button onClick={generatePlan} disabled={generatingPlan} className="w-full">
                {generatingPlan ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Generando Plan...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generar Plan con IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedAtleta && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Planes de {getAtletaNombre(selectedAtleta)}
                </CardTitle>
                <CardDescription>Historial de planes de entrenamiento generados</CardDescription>
              </CardHeader>
              <CardContent>
                {planes.length > 0 ? (
                  <div className="space-y-4">
                    {planes.map((plan) => (
                      <Card key={plan.id} className="border-l-4 border-l-purple-500">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{plan.objetivo.replace("_", " ").toUpperCase()}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(plan.fecha_creacion).toLocaleDateString()}
                                <Clock className="h-4 w-4 ml-2" />
                                {plan.duracion_semanas} semanas
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getNivelColor(plan.nivel)}>{plan.nivel}</Badge>
                              <Badge variant="outline">{plan.frecuencia} días/semana</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="resumen" className="w-full">
                            <TabsList>
                              <TabsTrigger value="resumen">Resumen</TabsTrigger>
                              <TabsTrigger value="ejercicios">Ejercicios</TabsTrigger>
                            </TabsList>
                            <TabsContent value="resumen" className="mt-4">
                              <div className="prose max-w-none">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{plan.plan_detallado}</p>
                              </div>
                            </TabsContent>
                            <TabsContent value="ejercicios" className="mt-4">
                              <div className="space-y-3">
                                {plan.ejercicios.map((ejercicio, index) => (
                                  <div key={index} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-medium">{ejercicio.nombre}</h4>
                                      <Badge variant="outline">{ejercicio.peso_sugerido}</Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                                      <div>
                                        <span className="font-medium">Series:</span> {ejercicio.series}
                                      </div>
                                      <div>
                                        <span className="font-medium">Reps:</span> {ejercicio.repeticiones}
                                      </div>
                                      <div>
                                        <span className="font-medium">Descanso:</span> {ejercicio.descanso}
                                      </div>
                                    </div>
                                    {ejercicio.notas && <p className="text-xs text-gray-500 mt-2">{ejercicio.notas}</p>}
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay planes de entrenamiento generados para este atleta</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedAtleta && (
            <Card>
              <CardContent className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un atleta para ver sus planes de entrenamiento</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
