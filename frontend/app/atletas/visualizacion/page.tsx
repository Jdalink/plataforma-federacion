"use client"

import { useState, useEffect } from "react"
// CORRECCIÓN: Rutas de importación verificadas y corregidas
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Users, Trophy, MapPin, Weight, TrendingUp, Medal, Eye, Star } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";


// Se define la interfaz completa para el atleta
interface Atleta {
  id: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  genero: string
  pais: string
  ciudad?: string
  email?: string
  telefono?: string
  peso_corporal?: number
  altura?: number
  categoria_peso?: string
  numero_licencia?: string
  fecha_inicio_powerlifting?: string
  gym_entrenamiento?: string
  foto_url?: string
  records_personales?: {
    sentadilla?: number
    press_banca?: number
    peso_muerto?: number
    total?: number
    wilks?: number
  }
  total_competencias?: number
  mejor_wilks?: number
  entrenador?: {
    nombre: string
    apellido: string
  }
}

export default function AtletasVisualizacionPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState({
    genero: "Todos",
    pais: "",
    categoria_peso: "Todas",
    ordenar: "nombre",
  })
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchAtletas()
  }, [searchTerm, filtros, paginacion.page])

  const fetchAtletas = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: paginacion.page.toString(),
        limit: paginacion.limit.toString(),
        search: searchTerm,
        ...filtros,
      })

      // CORRECCIÓN: URL apuntando al servicio de backend en Docker
      const response = await fetch(`http://backend:3001/api/atletas?${params}`)
      const data = await response.json()

      setAtletas(data.data || [])
      setPaginacion((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      }))
    } catch (error) {
      console.error("Error fetching atletas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const formatearPeso = (peso?: number) => {
    return peso ? `${peso} kg` : "N/A"
  }

  const formatearAltura = (altura?: number) => {
    return altura ? `${altura} cm` : "N/A"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Visualización de Atletas
          </h1>
          <p className="text-gray-600">Explora el directorio completo de atletas</p>
        </div>
        <Link href="/atletas" className="text-blue-600 hover:underline">
          ← Volver a Gestión
        </Link>
      </div>

      {/* El resto del código JSX se pega aquí. Asegúrate de tenerlo completo. */}
      {/* ... Tu código JSX para estadísticas, filtros y el grid de atletas ... */}

    </div>
  )
}