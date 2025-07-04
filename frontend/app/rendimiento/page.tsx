"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, Target, Award, Activity } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface RendimientoData {
  fecha: string
  sentadilla: number
  press_banca: number
  peso_muerto: number
  total: number
  peso_corporal: number
  wilks: number
}

interface Atleta {
  id: number
  nombre: string
  apellido: string
}

export default function RendimientoPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [selectedAtleta, setSelectedAtleta] = useState<string>("")
  const [rendimientoData, setRendimientoData] = useState<RendimientoData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAtletas()
  }, [])

  useEffect(() => {
    if (selectedAtleta) {
      fetchRendimientoData(selectedAtleta)
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

  const fetchRendimientoData = async (atletaId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rendimiento/${atletaId}`)
      const data = await response.json()
      setRendimientoData(data)
    } catch (error) {
      console.error("Error fetching rendimiento data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAtletaNombre = (atletaId: string) => {
    const atleta = atletas.find((a) => a.id.toString() === atletaId)
    return atleta ? `${atleta.nombre} ${atleta.apellido}` : ""
  }

  const getLatestStats = () => {
    if (rendimientoData.length === 0) return null
    const latest = rendimientoData[rendimientoData.length - 1]
    const previous = rendimientoData.length > 1 ? rendimientoData[rendimientoData.length - 2] : latest

    return {
      current: latest,
      improvement: {
        sentadilla: latest.sentadilla - previous.sentadilla,
        press_banca: latest.press_banca - previous.press_banca,
        peso_muerto: latest.peso_muerto - previous.peso_muerto,
        total: latest.total - previous.total,
        wilks: latest.wilks - previous.wilks,
      },
    }
  }

  const stats = getLatestStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Análisis de Rendimiento
          </h1>
          <p className="text-gray-600">Seguimiento del progreso y análisis de rendimiento en powerlifting</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Atleta</CardTitle>
            <CardDescription>Elige un atleta para ver su análisis de rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedAtleta} onValueChange={setSelectedAtleta}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Selecciona un atleta" />
              </SelectTrigger>
              <SelectContent>
                {atletas.map((atleta) => (
                  <SelectItem key={atleta.id} value={atleta.id.toString()}>
                    {atleta.nombre} {atleta.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedAtleta && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sentadilla</CardTitle>
                <Target className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.current.sentadilla}kg</div>
                <p className={`text-xs ${stats.improvement.sentadilla >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.improvement.sentadilla >= 0 ? "+" : ""}
                  {stats.improvement.sentadilla}kg desde último registro
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Press Banca</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.current.press_banca}kg</div>
                <p className={`text-xs ${stats.improvement.press_banca >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.improvement.press_banca >= 0 ? "+" : ""}
                  {stats.improvement.press_banca}kg desde último registro
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Muerto</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.current.peso_muerto}kg</div>
                <p className={`text-xs ${stats.improvement.peso_muerto >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.improvement.peso_muerto >= 0 ? "+" : ""}
                  {stats.improvement.peso_muerto}kg desde último registro
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.current.total}kg</div>
                <p className={`text-xs ${stats.improvement.total >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.improvement.total >= 0 ? "+" : ""}
                  {stats.improvement.total}kg desde último registro
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wilks Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.current.wilks}</div>
                <p className={`text-xs ${stats.improvement.wilks >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.improvement.wilks >= 0 ? "+" : ""}
                  {stats.improvement.wilks.toFixed(1)} desde último registro
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Levantamientos</CardTitle>
                <CardDescription>Evolución de los tres levantamientos principales</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rendimientoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sentadilla" stroke="#ef4444" strokeWidth={2} name="Sentadilla" />
                    <Line type="monotone" dataKey="press_banca" stroke="#3b82f6" strokeWidth={2} name="Press Banca" />
                    <Line type="monotone" dataKey="peso_muerto" stroke="#10b981" strokeWidth={2} name="Peso Muerto" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total y Wilks Score</CardTitle>
                <CardDescription>Progreso del total y puntuación Wilks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rendimientoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="total"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Total (kg)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="wilks"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Wilks Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comparación de Levantamientos Actuales</CardTitle>
              <CardDescription>Distribución actual de fuerza por levantamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[stats.current]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sentadilla" fill="#ef4444" name="Sentadilla" />
                  <Bar dataKey="press_banca" fill="#3b82f6" name="Press Banca" />
                  <Bar dataKey="peso_muerto" fill="#10b981" name="Peso Muerto" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {selectedAtleta && rendimientoData.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              No hay datos de rendimiento disponibles para {getAtletaNombre(selectedAtleta)}
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Cargando datos de rendimiento...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
