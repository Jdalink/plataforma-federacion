"use client"

import type React from "react"
import { useState, useEffect } from "react"
// CORRECCIÓN DE RUTAS
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Trophy } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Competencia {
  id: number
  nombre: string
  fecha: string
  ubicacion: string
  tipo: string
  organizador?: string
}

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState<Competencia[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompetencia, setEditingCompetencia] = useState<Competencia | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    ubicacion: "",
    tipo: "",
    organizador: "",
  })

  useEffect(() => {
    fetchCompetencias()
  }, [])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:3001/api";

  const fetchCompetencias = async () => {
    try {
      const response = await fetch(`${API_URL}/competencias`)
      const data = await response.json()
      setCompetencias(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching competencias:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCompetencia ? `${API_URL}/competencias/${editingCompetencia.id}` : `${API_URL}/competencias`
      const method = editingCompetencia ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchCompetencias()
        setIsDialogOpen(false)
        setEditingCompetencia(null)
        setFormData({
          nombre: "",
          fecha: "",
          ubicacion: "",
          tipo: "",
          organizador: "",
        })
      }
    } catch (error) {
      console.error("Error saving competencia:", error)
    }
  }

  const handleEdit = (competencia: Competencia) => {
    setEditingCompetencia(competencia)
    setFormData({
      nombre: competencia.nombre,
      fecha: new Date(competencia.fecha).toISOString().split('T')[0],
      ubicacion: competencia.ubicacion,
      tipo: competencia.tipo,
      organizador: competencia.organizador || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta competencia?")) {
      try {
        await fetch(`${API_URL}/competencias/${id}`, { method: "DELETE" })
        fetchCompetencias()
      } catch (error) {
        console.error("Error deleting competencia:", error)
      }
    }
  }

  const filteredCompetencias = competencias.filter(
    (competencia) =>
      competencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competencia.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competencia.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Gestión de Competencias
          </h1>
          <p className="text-gray-600">Organiza y administra competencias deportivas</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Competencias Registradas</CardTitle>
          <CardDescription>Lista de todas las competencias en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar competencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCompetencia(null)
                    setFormData({
                      nombre: "",
                      fecha: "",
                      ubicacion: "",
                      tipo: "",
                      organizador: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Competencia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingCompetencia ? "Editar Competencia" : "Nueva Competencia"}</DialogTitle>
                  <DialogDescription>
                    {editingCompetencia
                      ? "Modifica la información de la competencia"
                      : "Ingresa la información de la nueva competencia"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
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
                      <Label htmlFor="ubicacion">Ubicación</Label>
                      <Input
                        id="ubicacion"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nacional">Nacional</SelectItem>
                          <SelectItem value="Internacional">Internacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="organizador">Organizador</Label>
                      <Input
                        id="organizador"
                        value={formData.organizador}
                        onChange={(e) => setFormData({ ...formData, organizador: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingCompetencia ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Organizador</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetencias.map((competencia) => (
                <TableRow key={competencia.id}>
                  <TableCell className="font-medium">{competencia.nombre}</TableCell>
                  <TableCell>{new Date(competencia.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{competencia.ubicacion}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        competencia.tipo === "Internacional"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {competencia.tipo}
                    </span>
                  </TableCell>
                  <TableCell>{competencia.organizador || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(competencia)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(competencia.id)}>
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
