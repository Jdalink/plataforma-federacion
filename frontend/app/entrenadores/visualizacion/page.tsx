"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  UserCheck,
  MapPin,
  Star,
  Users,
  Award,
  Clock,
  DollarSign,
  Globe,
  Eye,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Entrenador {
  id: number
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  experiencia: string
  anos_experiencia?: number
  certificaciones?: string[]
  especialidades?: string[]
  tarifa_por_hora?: number
  disponibilidad?: any
  ubicacion?: string
  modalidad_entrenamiento?: string[]
  idiomas?: string[]
  foto_url?: string
  biografia?: string
  sitio_web?: string
  redes_sociales?: any
  calificacion_promedio?: number
  total_atletas_entrenados?: number
  activo: boolean
}

export default function EntrenadoresVisualizacionPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState({
    ubicacion: "",
    especialidad: "",
    modalidad: "",
    ordenar: "nombre",
  })
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchEntrenadores()
  }, [searchTerm, filtros, paginacion.page])

  const fetchEntrenadores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: paginacion.page.toString(),
        limit: paginacion.limit.toString(),
        search: searchTerm,
        ...filtros,
      })

      const response = await fetch(`/api/entrenadores?${params}`)
      const data = await response.json()

      setEntrenadores(data.data || [])
      setPaginacion((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      }))
    } catch (error) {
      console.error("Error fetching entrenadores:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-purple-600" />
            Directorio de Entrenadores
          </h1>
          <p className="text-gray-600">Encuentra el entrenador perfecto para tus objetivos</p>
        </div>
        <Link href="/entrenadores" className="text-blue-600 hover:underline">
          ← Volver a Gestión
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entrenadores</p>
                <p className="text-2xl font-bold">{paginacion.total}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">{entrenadores.filter((e) => e.activo).length}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promedio Experiencia</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    entrenadores.reduce((acc, e) => acc + (e.anos_experiencia || 0), 0) / entrenadores.length || 0,
                  )}{" "}
                  años
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ubicaciones</p>
                <p className="text-2xl font-bold">
                  {new Set(entrenadores.map((e) => e.ubicacion).filter(Boolean)).size}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entrenadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Input
              placeholder="Ubicación"
              value={filtros.ubicacion}
              onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}
            />

            <Select
              value={filtros.especialidad}
              onValueChange={(value) => setFiltros({ ...filtros, especialidad: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="powerlifting">Powerlifting</SelectItem>
                <SelectItem value="fuerza">Fuerza</SelectItem>
                <SelectItem value="tecnica">Técnica</SelectItem>
                <SelectItem value="competencia">Competencia</SelectItem>
                <SelectItem value="rehabilitacion">Rehabilitación</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.modalidad} onValueChange={(value) => setFiltros({ ...filtros, modalidad: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.ordenar} onValueChange={(value) => setFiltros({ ...filtros, ordenar: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nombre">Nombre</SelectItem>
                <SelectItem value="calificacion">Calificación</SelectItem>
                <SelectItem value="experiencia">Experiencia</SelectItem>
                <SelectItem value="atletas">Atletas Entrenados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de entrenadores */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entrenadores.map((entrenador) => (
            <Card key={entrenador.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                {/* Header del entrenador */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={entrenador.foto_url || "/placeholder.svg"}
                      alt={`${entrenador.nombre} ${entrenador.apellido}`}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                      {getInitials(entrenador.nombre, entrenador.apellido)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">
                      {entrenador.nombre} {entrenador.apellido}
                    </h3>

                    {/* Calificación */}
                    {entrenador.calificacion_promedio && (
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(Math.round(entrenador.calificacion_promedio))}
                        <span className="text-sm text-gray-600 ml-1">
                          ({entrenador.calificacion_promedio.toFixed(1)})
                        </span>
                      </div>
                    )}

                    {/* Ubicación */}
                    {entrenador.ubicacion && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{entrenador.ubicacion}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experiencia */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Experiencia:</span>
                    <Badge variant="outline">
                      {entrenador.anos_experiencia ? `${entrenador.anos_experiencia} años` : "N/A"}
                    </Badge>
                  </div>

                  {entrenador.experiencia && (
                    <p className="text-sm text-gray-600 line-clamp-2">{entrenador.experiencia}</p>
                  )}
                </div>

                {/* Especialidades */}
                {entrenador.especialidades && entrenador.especialidades.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Especialidades:</span>
                    <div className="flex flex-wrap gap-1">
                      {entrenador.especialidades.slice(0, 3).map((especialidad, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {especialidad}
                        </Badge>
                      ))}
                      {entrenador.especialidades.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entrenador.especialidades.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Modalidades de entrenamiento */}
                {entrenador.modalidad_entrenamiento && entrenador.modalidad_entrenamiento.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Modalidades:</span>
                    <div className="flex flex-wrap gap-1">
                      {entrenador.modalidad_entrenamiento.map((modalidad, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {modalidad}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="space-y-2 mb-4 text-sm">
                  {entrenador.total_atletas_entrenados !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Atletas entrenados:
                      </span>
                      <span className="font-medium">{entrenador.total_atletas_entrenados}</span>
                    </div>
                  )}

                  {entrenador.tarifa_por_hora && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Tarifa/hora:
                      </span>
                      <span className="font-medium">${entrenador.tarifa_por_hora}</span>
                    </div>
                  )}

                  {entrenador.idiomas && entrenador.idiomas.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Idiomas:
                      </span>
                      <span className="font-medium text-xs">
                        {entrenador.idiomas.slice(0, 2).join(", ")}
                        {entrenador.idiomas.length > 2 && "..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Certificaciones */}
                {entrenador.certificaciones && entrenador.certificaciones.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                      <Award className="h-3 w-3" />
                      Certificaciones:
                    </span>
                    <div className="text-xs text-gray-600">
                      {entrenador.certificaciones.slice(0, 2).map((cert, index) => (
                        <div key={index} className="truncate">
                          • {cert}
                        </div>
                      ))}
                      {entrenador.certificaciones.length > 2 && (
                        <div className="text-gray-500">+{entrenador.certificaciones.length - 2} más</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contacto rápido */}
                <div className="flex gap-2 mb-4">
                  {entrenador.email && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  )}
                  {entrenador.telefono && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Llamar
                    </Button>
                  )}
                </div>

                {/* Botón de ver perfil completo */}
                <Link href={`/entrenadores/${entrenador.id}`}>
                  <Button variant="default" className="w-full group-hover:bg-purple-600">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Perfil Completo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {paginacion.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPaginacion((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={paginacion.page === 1}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, paginacion.pages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={paginacion.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaginacion((prev) => ({ ...prev, page: pageNum }))}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setPaginacion((prev) => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
            disabled={paginacion.page === paginacion.pages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {!loading && entrenadores.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron entrenadores</h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros de búsqueda o agregar nuevos entrenadores al sistema.
            </p>
            <Link href="/entrenadores">
              <Button>Gestionar Entrenadores</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
