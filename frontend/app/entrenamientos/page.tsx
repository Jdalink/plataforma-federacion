"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Target, Clock } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Entrenamiento {
  id: number
  atleta_id: number
  fecha: string
  descripcion: string
  duracion: number
  intensidad: string
  atleta_nombre?: string
}

interface Atleta {
  id: number
  nombre: string
  apellido: string
}

export default function EntrenamientosPage() {
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntrenamiento, setEditingEntrenamiento] = useState<Entrenamiento | null>(null)
  const [formData, setFormData] = useState({
    atleta_id: "",
    fecha: "",
    descripcion: "",
    duracion: "",
    intensidad: "",
  })

  useEffect(() => {
    fetchEntrenamientos()
    fetchAtletas()
  }, [])

  const fetchEntrenamientos = async () => {
    try {
      const response = await fetch("http://backend:3001/api/entrenamientos")
      const data = await response.json()
      setEntrenamientos(data)
    } catch (error) {
      console.error("Error fetching entrenamientos:", error)
    }
  }

  const fetchAtletas = async () => {
    try {
      const response = await fetch("http://backend:3001/api/atletas")
      const data = await response.json()
      setAtletas(data)
    } catch (error) {
      console.error("Error fetching atletas:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingEntrenamiento ? `/api/entrenamientos/${editingEntrenamiento.id}` : "/api/entrenamientos"
      const method = editingEntrenamiento ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          atleta_id: Number.parseInt(formData.atleta_id),
          duracion: Number.parseInt(formData.duracion),
        }),
      })

      if (response.ok) {
        fetchEntrenamientos()
        setIsDialogOpen(false)
        setEditingEntrenamiento(null)
        setFormData({
          atleta_id: "",
          fecha: "",
          descripcion: "",
          duracion: "",
          intensidad: "",
        })
      }
    } catch (error) {
      console.error("Error saving entrenamiento:", error)
    }
  }

  const handleEdit = (entrenamiento: Entrenamiento) => {
    setEditingEntrenamiento(entrenamiento)
    setFormData({
      atleta_id: entrenamiento.atleta_id.toString(),
      fecha: entrenamiento.fecha,
      descripcion: entrenamiento.descripcion,
      duracion: entrenamiento.duracion.toString(),
      intensidad: entrenamiento.intensidad,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este entrenamiento?")) {
      try {
        await fetch(`/api/entrenamientos/${id}`, { method: "DELETE" })
        fetchEntrenamientos()
      } catch (error) {
        console.error("Error deleting entrenamiento:", error)
      }
    }
  }

  const getAtletaNombre = (atletaId: number) => {
    const atleta = atletas.find((a) => a.id === atletaId)
    return atleta ? `${atleta.nombre} ${atleta.apellido}` : "N/A"
  }

  const getIntensidadColor = (intensidad: string) => {
    switch (intensidad) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredEntrenamientos = entrenamientos.filter(
    (entrenamiento) =>
      entrenamiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAtletaNombre(entrenamiento.atleta_id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-green-600" />
            Gestión de Entrenamientos
          </h1>
          <p className="text-gray-600">Planifica y registra sesiones de entrenamiento</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Entrenamientos Registrados</CardTitle>
          <CardDescription>Lista de todas las sesiones de entrenamiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entrenamientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingEntrenamiento(null)
                    setFormData({
                      atleta_id: "",
                      fecha: "",
                      descripcion: "",
                      duracion: "",
                      intensidad: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Entrenamiento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingEntrenamiento ? "Editar Entrenamiento" : "Nuevo Entrenamiento"}</DialogTitle>
                  <DialogDescription>
                    {editingEntrenamiento
                      ? "Modifica la información del entrenamiento"
                      : "Registra una nueva sesión de entrenamiento"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="atleta_id">Atleta</Label>
                      <Select
                        value={formData.atleta_id}
                        onValueChange={(value) => setFormData({ ...formData, atleta_id: value })}
                      >
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
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Describe el entrenamiento..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duracion">Duración (minutos)</Label>
                      <Input
                        id="duracion"
                        type="number"
                        value={formData.duracion}
                        onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="intensidad">Intensidad</Label>
                      <Select
                        value={formData.intensidad}
                        onValueChange={(value) => setFormData({ ...formData, intensidad: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona intensidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baja">Baja</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingEntrenamiento ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atleta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Intensidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntrenamientos.map((entrenamiento) => (
                <TableRow key={entrenamiento.id}>
                  <TableCell className="font-medium">{getAtletaNombre(entrenamiento.atleta_id)}</TableCell>
                  <TableCell>{new Date(entrenamiento.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{entrenamiento.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {entrenamiento.duracion} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getIntensidadColor(entrenamiento.intensidad)}`}>
                      {entrenamiento.intensidad}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(entrenamiento)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(entrenamiento.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
