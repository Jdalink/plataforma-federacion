"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Apple, Calendar, Target, Zap, Clock, AlertCircle, CheckCircle, Utensils } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Atleta {
  id: number
  nombre: string
  apellido: string
}

interface PlanAlimentacion {
  id: string
  atleta_id: number
  objetivo: string
  peso_actual: number
  peso_objetivo: number
  actividad_nivel: string
  restricciones: string
  plan_detallado: string
  comidas: Comida[]
  fecha_creacion: string
  duracion_semanas: number
  calorias_diarias: number
  macros: {
    proteinas: number
    carbohidratos: number
    grasas: number
  }
}

interface Comida {
  nombre: string
  horario: string
  alimentos: string[]
  calorias: number
  proteinas: number
  carbohidratos: number
  grasas: number
  notas: string
}

export default function PlanesAlimentacionPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [selectedAtleta, setSelectedAtleta] = useState<string>("")
  const [planes, setPlanes] = useState<PlanAlimentacion[]>([])
  const [loading, setLoading] = useState(false)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [planConfig, setPlanConfig] = useState({
    objetivo: "",
    peso_actual: "",
    peso_objetivo: "",
    actividad_nivel: "",
    restricciones: "",
    duracion: "",
    preferencias: "",
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
      const response = await fetch(`/api/planes-alimentacion/${atletaId}`)
      const data = await response.json()
      setPlanes(data)
    } catch (error) {
      console.error("Error fetching planes:", error)
    }
  }

  const generatePlan = async () => {
    if (!selectedAtleta || !planConfig.objetivo || !planConfig.peso_actual || !planConfig.actividad_nivel) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    setGeneratingPlan(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://backend:3001/api/ai/generate-nutrition-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atleta_id: Number.parseInt(selectedAtleta),
          ...planConfig,
          peso_actual: Number.parseFloat(planConfig.peso_actual),
          peso_objetivo: planConfig.peso_objetivo ? Number.parseFloat(planConfig.peso_objetivo) : null,
          duracion: Number.parseInt(planConfig.duracion),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Plan de alimentación generado exitosamente")
        fetchPlanes(selectedAtleta)
        setPlanConfig({
          objetivo: "",
          peso_actual: "",
          peso_objetivo: "",
          actividad_nivel: "",
          restricciones: "",
          duracion: "",
          preferencias: "",
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

  const getObjetivoColor = (objetivo: string) => {
    switch (objetivo.toLowerCase()) {
      case "perdida_peso":
        return "bg-red-100 text-red-800"
      case "ganancia_peso":
        return "bg-green-100 text-green-800"
      case "mantenimiento":
        return "bg-blue-100 text-blue-800"
      case "rendimiento":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Apple className="h-8 w-8 text-green-600" />
            Planes de Alimentación IA
          </h1>
          <p className="text-gray-600">Genera planes nutricionales personalizados con inteligencia artificial</p>
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
              <CardDescription>Crea un plan nutricional personalizado con IA</CardDescription>
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
                    <SelectItem value="perdida_peso">Pérdida de Peso</SelectItem>
                    <SelectItem value="ganancia_peso">Ganancia de Peso</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="rendimiento">Optimización de Rendimiento</SelectItem>
                    <SelectItem value="competencia">Preparación para Competencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="peso_actual">Peso Actual (kg)</Label>
                  <Input
                    id="peso_actual"
                    type="number"
                    step="0.1"
                    value={planConfig.peso_actual}
                    onChange={(e) => setPlanConfig({ ...planConfig, peso_actual: e.target.value })}
                    placeholder="75.0"
                  />
                </div>
                <div>
                  <Label htmlFor="peso_objetivo">Peso Objetivo (kg)</Label>
                  <Input
                    id="peso_objetivo"
                    type="number"
                    step="0.1"
                    value={planConfig.peso_objetivo}
                    onChange={(e) => setPlanConfig({ ...planConfig, peso_objetivo: e.target.value })}
                    placeholder="80.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="actividad_nivel">Nivel de Actividad</Label>
                <Select
                  value={planConfig.actividad_nivel}
                  onValueChange={(value) => setPlanConfig({ ...planConfig, actividad_nivel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentario</SelectItem>
                    <SelectItem value="ligero">Actividad Ligera</SelectItem>
                    <SelectItem value="moderado">Actividad Moderada</SelectItem>
                    <SelectItem value="intenso">Actividad Intensa</SelectItem>
                    <SelectItem value="muy_intenso">Muy Intenso</SelectItem>
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
                <Label htmlFor="restricciones">Restricciones Alimentarias</Label>
                <Textarea
                  id="restricciones"
                  value={planConfig.restricciones}
                  onChange={(e) => setPlanConfig({ ...planConfig, restricciones: e.target.value })}
                  placeholder="Alergias, intolerancias, dietas especiales..."
                />
              </div>

              <div>
                <Label htmlFor="preferencias">Preferencias</Label>
                <Textarea
                  id="preferencias"
                  value={planConfig.preferencias}
                  onChange={(e) => setPlanConfig({ ...planConfig, preferencias: e.target.value })}
                  placeholder="Comidas favoritas, horarios preferidos..."
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
                  <Apple className="h-5 w-5" />
                  Planes de {getAtletaNombre(selectedAtleta)}
                </CardTitle>
                <CardDescription>Historial de planes de alimentación generados</CardDescription>
              </CardHeader>
              <CardContent>
                {planes.length > 0 ? (
                  <div className="space-y-4">
                    {planes.map((plan) => (
                      <Card key={plan.id} className="border-l-4 border-l-green-500">
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
                              <Badge className={getObjetivoColor(plan.objetivo)}>
                                {plan.objetivo.replace("_", " ")}
                              </Badge>
                              <Badge variant="outline">{plan.calorias_diarias} kcal/día</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="resumen" className="w-full">
                            <TabsList>
                              <TabsTrigger value="resumen">Resumen</TabsTrigger>
                              <TabsTrigger value="macros">Macros</TabsTrigger>
                              <TabsTrigger value="comidas">Comidas</TabsTrigger>
                            </TabsList>
                            <TabsContent value="resumen" className="mt-4">
                              <div className="prose max-w-none">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{plan.plan_detallado}</p>
                              </div>
                            </TabsContent>
                            <TabsContent value="macros" className="mt-4">
                              <div className="grid grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="pt-6">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-red-600">{plan.macros.proteinas}g</div>
                                      <p className="text-xs text-muted-foreground">Proteínas</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-6">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {plan.macros.carbohidratos}g
                                      </div>
                                      <p className="text-xs text-muted-foreground">Carbohidratos</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-6">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-yellow-600">{plan.macros.grasas}g</div>
                                      <p className="text-xs text-muted-foreground">Grasas</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>
                            <TabsContent value="comidas" className="mt-4">
                              <div className="space-y-3">
                                {plan.comidas.map((comida, index) => (
                                  <div key={index} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h4 className="font-medium flex items-center gap-2">
                                          <Utensils className="h-4 w-4" />
                                          {comida.nombre}
                                        </h4>
                                        <p className="text-sm text-gray-500">{comida.horario}</p>
                                      </div>
                                      <Badge variant="outline">{comida.calorias} kcal</Badge>
                                    </div>
                                    <div className="mb-2">
                                      <p className="text-sm">
                                        <strong>Alimentos:</strong> {comida.alimentos.join(", ")}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                                      <div>P: {comida.proteinas}g</div>
                                      <div>C: {comida.carbohidratos}g</div>
                                      <div>G: {comida.grasas}g</div>
                                    </div>
                                    {comida.notas && <p className="text-xs text-gray-500 mt-2">{comida.notas}</p>}
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
                    <p className="text-gray-500">No hay planes de alimentación generados para este atleta</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedAtleta && (
            <Card>
              <CardContent className="text-center py-8">
                <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un atleta para ver sus planes de alimentación</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
