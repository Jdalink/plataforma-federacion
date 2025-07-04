"use client"

import type React from "react"
import { useState, useEffect } from "react"
// CORRECCIÓN DE RUTAS
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, UserCheck, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Entrenador {
  id: number
  nombre: string
  apellido: string
  experiencia: string
  email?: string
  telefono?: string
  atleta_id?: number
}

export default function EntrenadoresPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntrenador, setEditingEntrenador] = useState<Entrenador | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    experiencia: "",
    email: "",
    telefono: "",
  })

  useEffect(() => {
    fetchEntrenadores()
  }, [])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:3001/api";

  const fetchEntrenadores = async () => {
    try {
      const response = await fetch(`${API_URL}/entrenadores`)
      const data = await response.json()
      setEntrenadores(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching entrenadores:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingEntrenador ? `${API_URL}/entrenadores/${editingEntrenador.id}` : `${API_URL}/entrenadores`
      const method = editingEntrenador ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchEntrenadores()
        setIsDialogOpen(false)
        setEditingEntrenador(null)
        setFormData({
          nombre: "",
          apellido: "",
          experiencia: "",
          email: "",
          telefono: "",
        })
      }
    } catch (error) {
      console.error("Error saving entrenador:", error)
    }
  }

  const handleEdit = (entrenador: Entrenador) => {
    setEditingEntrenador(entrenador)
    setFormData({
      nombre: entrenador.nombre,
      apellido: entrenador.apellido,
      experiencia: entrenador.experiencia,
      email: entrenador.email || "",
      telefono: entrenador.telefono || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este entrenador?")) {
      try {
        await fetch(`${API_URL}/entrenadores/${id}`, { method: "DELETE" })
        fetchEntrenadores()
      } catch (error) {
        console.error("Error deleting entrenador:", error)
      }
    }
  }

  const filteredEntrenadores = entrenadores.filter(
    (entrenador) =>
      entrenador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrenador.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrenador.experiencia.toLowerCase().includes(searchTerm.toLowerCase()),
  )


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-purple-600" />
            Gestión de Entrenadores
          </h1>
          <p className="text-gray-600">Administra el equipo de entrenadores y su experiencia</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Entrenadores Registrados</CardTitle>
          <CardDescription>Lista de todos los entrenadores en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entrenadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingEntrenador(null)
                    setFormData({
                      nombre: "",
                      apellido: "",
                      experiencia: "",
                      email: "",
                      telefono: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Entrenador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingEntrenador ? "Editar Entrenador" : "Nuevo Entrenador"}</DialogTitle>
                  <DialogDescription>
                    {editingEntrenador
                      ? "Modifica la información del entrenador"
                      : "Ingresa la información del nuevo entrenador"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                          id="apellido"
                          value={formData.apellido}
                          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="experiencia">Experiencia</Label>
                      <Textarea
                        id="experiencia"
                        value={formData.experiencia}
                        onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                        placeholder="Describe la experiencia del entrenador..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingEntrenador ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Experiencia</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntrenadores.map((entrenador) => (
                <TableRow key={entrenador.id}>
                  <TableCell className="font-medium">{entrenador.nombre}</TableCell>
                  <TableCell>{entrenador.apellido}</TableCell>
                  <TableCell className="max-w-xs truncate">{entrenador.experiencia}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {entrenador.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {entrenador.email}
                        </div>
                      )}
                      {entrenador.telefono && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {entrenador.telefono}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(entrenador)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(entrenador.id)}>
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
