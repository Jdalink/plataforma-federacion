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
  MapPin,
  Building,
  Trophy,
  Calendar,
  Globe,
  Eye,
  Mail,
  Phone,
  ExternalLink,
  Award,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Organizador {
  id: number
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  organizacion?: string
  cargo?: string
  pais?: string
  ciudad?: string
  experiencia?: string
  certificaciones?: string[]
  foto_url?: string
  sitio_web?: string
  redes_sociales?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  activo: boolean
  total_competencias?: number
  competencias_recientes?: Array<{
    nombre: string
    fecha: string
    tipo: string
  }>
}

export default function OrganizadoresVisualizacionPage() {
  const [organizadores, setOrganizadores] = useState<Organizador[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState({
    pais: "",
    organizacion: "",
    cargo: "",
    ordenar: "nombre",
  })
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchOrganizadores()
  }, [searchTerm, filtros, paginacion.page])

  const fetchOrganizadores = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: paginacion.page.toString(),
        limit: paginacion.limit.toString(),
        search: searchTerm,
        ...filtros,
      })

      const response = await fetch(`/api/organizadores?${params}`)
      const data = await response.json()

      setOrganizadores(data.data || [])
      setPaginacion((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      }))
    } catch (error) {
      console.error("Error fetching organizadores:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "📘"
      case "instagram":
        return "📷"
      case "twitter":
        return "🐦"
      case "linkedin":
        return "💼"
      default:
        return "🌐"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-green-600" />
            Directorio de Organizadores
          </h1>
          <p className="text-gray-600">Conoce a los organizadores de competencias de powerlifting</p>
        </div>
        <Link href="/organizadores" className="text-blue-600 hover:underline">
          ← Volver a Gestión
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Organizadores</p>
                <p className="text-2xl font-bold">{paginacion.total}</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">{organizadores.filter((o) => o.activo).length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Organizaciones</p>
                <p className="text-2xl font-bold">
                  {new Set(organizadores.map((o) => o.organizacion).filter(Boolean)).size}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Países</p>
                <p className="text-2xl font-bold">{new Set(organizadores.map((o) => o.pais).filter(Boolean)).size}</p>
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
                placeholder="Buscar organizadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Input
              placeholder="País"
              value={filtros.pais}
              onChange={(e) => setFiltros({ ...filtros, pais: e.target.value })}
            />

            <Input
              placeholder="Organización"
              value={filtros.organizacion}
              onChange={(e) => setFiltros({ ...filtros, organizacion: e.target.value })}
            />

            <Input
              placeholder="Cargo"
              value={filtros.cargo}
              onChange={(e) => setFiltros({ ...filtros, cargo: e.target.value })}
            />

            <Select value={filtros.ordenar} onValueChange={(value) => setFiltros({ ...filtros, ordenar: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nombre">Nombre</SelectItem>
                <SelectItem value="organizacion">Organización</SelectItem>
                <SelectItem value="competencias">Competencias</SelectItem>
                <SelectItem value="pais">País</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de organizadores */}
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
          {organizadores.map((organizador) => (
            <Card key={organizador.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                {/* Header del organizador */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={organizador.foto_url || "/placeholder.svg"}
                      alt={`${organizador.nombre} ${organizador.apellido}`}
                    />
                    <AvatarFallback className="bg-green-100 text-green-600 text-lg">
                      {getInitials(organizador.nombre, organizador.apellido)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">
                      {organizador.nombre} {organizador.apellido}
                    </h3>

                    {/* Cargo y organización */}
                    {organizador.cargo && <p className="text-sm font-medium text-gray-700 mb-1">{organizador.cargo}</p>}

                    {organizador.organizacion && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <Building className="h-3 w-3" />
                        <span className="truncate">{organizador.organizacion}</span>
                      </div>
                    )}

                    {/* Ubicación */}
                    {(organizador.pais || organizador.ciudad) && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {[organizador.ciudad, organizador.pais].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experiencia */}
                {organizador.experiencia && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Experiencia:</span>
                    <p className="text-sm text-gray-600 line-clamp-3">{organizador.experiencia}</p>
                  </div>
                )}

                {/* Certificaciones */}
                {organizador.certificaciones && organizador.certificaciones.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                      <Award className="h-3 w-3" />
                      Certificaciones:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {organizador.certificaciones.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {organizador.certificaciones.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{organizador.certificaciones.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Estadísticas */}
                <div className="space-y-2 mb-4 text-sm">
                  {organizador.total_competencias !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Competencias organizadas:
                      </span>
                      <span className="font-medium">{organizador.total_competencias}</span>
                    </div>
                  )}
                </div>

                {/* Competencias recientes */}
                {organizador.competencias_recientes && organizador.competencias_recientes.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                      <Calendar className="h-3 w-3" />
                      Competencias recientes:
                    </span>
                    <div className="space-y-1">
                      {organizador.competencias_recientes.slice(0, 2).map((comp, index) => (
                        <div key={index} className="text-xs text-gray-600 flex justify-between">
                          <span className="truncate flex-1">{comp.nombre}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {comp.tipo}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Redes sociales */}
                {organizador.redes_sociales && Object.keys(organizador.redes_sociales).length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Redes sociales:</span>
                    <div className="flex gap-2">
                      {Object.entries(organizador.redes_sociales).map(
                        ([platform, url]) =>
                          url && (
                            <a
                              key={platform}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg hover:scale-110 transition-transform"
                              title={platform}
                            >
                              {getSocialIcon(platform)}
                            </a>
                          ),
                      )}
                    </div>
                  </div>
                )}

                {/* Sitio web */}
                {organizador.sitio_web && (
                  <div className="mb-4">
                    <a
                      href={organizador.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Sitio web
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Contacto rápido */}
                <div className="flex gap-2 mb-4">
                  {organizador.email && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  )}
                  {organizador.telefono && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Llamar
                    </Button>
                  )}
                </div>

                {/* Botón de ver perfil completo */}
                <Link href={`/organizadores/${organizador.id}`}>
                  <Button variant="default" className="w-full group-hover:bg-green-600">
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
      {!loading && organizadores.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron organizadores</h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros de búsqueda o agregar nuevos organizadores al sistema.
            </p>
            <Link href="/organizadores">
              <Button>Gestionar Organizadores</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
