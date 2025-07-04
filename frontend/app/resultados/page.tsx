"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Search, Edit, Trash2, BarChart3, Weight, PercentIcon as Percentage, Calculator } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";

interface Resultado {
  id: number
  evento_id: number
  atleta_id: number
  sentadilla: number
  press_banca: number
  peso_muerto: number
  total: number
  categoria_peso: string
  wilks_score: number
  evento_nombre?: string
  atleta_nombre?: string
  competencia_nombre?: string
}

interface Evento {
  id: number
  nombre: string
  competencia_id: number
  categoria: string
  fecha: string
}

interface Atleta {
  id: number
  nombre: string
  apellido: string
  peso: number
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResultado, setEditingResultado] = useState<Resultado | null>(null)
  const [formData, setFormData] = useState({
    evento_id: "",
    atleta_id: "",
    sentadilla: "",
    press_banca: "",
    peso_muerto: "",
    categoria_peso: "",
  })

  useEffect(() => {
    fetchResultados()
    fetchEventos()
    fetchAtletas()
  }, [])

  const fetchResultados = async () => {
    try {
      const response = await fetch("http://backend:3001/api/resultados")
      const data = await response.json()
      setResultados(data)
    } catch (error) {
      console.error("Error fetching resultados:", error)
    }
  }

  const fetchEventos = async () => {
    try {
      const response = await fetch("http://backend:3001/api/eventos")
      const data = await response.json()
      setEventos(data)
    } catch (error) {
      console.error("Error fetching eventos:", error)
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

  const calculateTotal = (sentadilla: number, press_banca: number, peso_muerto: number) => {
    return sentadilla + press_banca + peso_muerto
  }

  const calculateWilks = (total: number, bodyweight: number, isMale: boolean) => {
    let wilksCoefficient

    if (isMale) {
      wilksCoefficient =
        500 /
        (-216.0475144 +
          16.2606339 * bodyweight -
          0.002388645 * bodyweight * bodyweight -
          0.000007141 * bodyweight * bodyweight * bodyweight +
          0.00000001291 * bodyweight * bodyweight * bodyweight * bodyweight -
          0.000000000000302 * bodyweight * bodyweight * bodyweight * bodyweight * bodyweight)
    } else {
      wilksCoefficient =
        500 /
        (-216.0475144 +
          16.2606339 * bodyweight -
          0.002388645 * bodyweight * bodyweight -
          0.000007141 * bodyweight * bodyweight * bodyweight +
          0.00000001291 * bodyweight * bodyweight * bodyweight * bodyweight -
          0.000000000000302 * bodyweight * bodyweight * bodyweight * bodyweight * bodyweight)
    }

    return total * wilksCoefficient
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const sentadilla = Number.parseFloat(formData.sentadilla)
      const press_banca = Number.parseFloat(formData.press_banca)
      const peso_muerto = Number.parseFloat(formData.peso_muerto)
      const total = calculateTotal(sentadilla, press_banca, peso_muerto)

      const atleta = atletas.find((a) => a.id === Number.parseInt(formData.atleta_id))
      const wilks_score = atleta ? calculateWilks(total, atleta.peso, true) : 0

      const url = editingResultado ? `/api/resultados/${editingResultado.id}` : "/api/resultados"
      const method = editingResultado ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          evento_id: Number.parseInt(formData.evento_id),
          atleta_id: Number.parseInt(formData.atleta_id),
          sentadilla: sentadilla,
          press_banca: press_banca,
          peso_muerto: peso_muerto,
          total: total,
          wilks_score: wilks_score,
        }),
      })

      if (response.ok) {
        fetchResultados()
        setIsDialogOpen(false)
        setEditingResultado(null)
        setFormData({
          evento_id: "",
          atleta_id: "",
          sentadilla: "",
          press_banca: "",
          peso_muerto: "",
          categoria_peso: "",
        })
      }
    } catch (error) {
      console.error("Error saving resultado:", error)
    }
  }

  const handleEdit = (resultado: Resultado) => {
    setEditingResultado(resultado)
    setFormData({
      evento_id: resultado.evento_id.toString(),
      atleta_id: resultado.atleta_id.toString(),
      sentadilla: resultado.sentadilla.toString(),
      press_banca: resultado.press_banca.toString(),
      peso_muerto: resultado.peso_muerto.toString(),
      categoria_peso: resultado.categoria_peso,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este resultado?")) {
      try {
        await fetch(`/api/resultados/${id}`, { method: "DELETE" })
        fetchResultados()
      } catch (error) {
        console.error("Error deleting resultado:", error)
      }
    }
  }

  const getEventoNombre = (eventoId: number) => {
    const evento = eventos.find((e) => e.id === eventoId)
    return evento ? evento.nombre : "N/A"
  }

  const getAtletaNombre = (atletaId: number) => {
    const atleta = atletas.find((a) => a.id === atletaId)
    return atleta ? `${atleta.nombre} ${atleta.apellido}` : "N/A"
  }

  const getLiftColor = (lift: string) => {
    switch (lift) {
      case "sentadilla":
        return "bg-blue-100 text-blue-800"
      case "press_banca":
        return "bg-green-100 text-green-800"
      case "peso_muerto":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredResultados = resultados.filter(
    (resultado) =>
      getAtletaNombre(resultado.atleta_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEventoNombre(resultado.evento_id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const categoriaPesoOptions = ["59", "66", "74", "83", "93", "105", "120", "120+"]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-red-600" />
            Gestión de Resultados Powerlifting
          </h1>
          <p className="text-gray-600">Registra y analiza resultados de competencias de Powerlifting</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resultados Registrados</CardTitle>
          <CardDescription>Lista de todos los resultados de competencias de Powerlifting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar resultados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingResultado(null)
                    setFormData({
                      evento_id: "",
                      atleta_id: "",
                      sentadilla: "",
                      press_banca: "",
                      peso_muerto: "",
                      categoria_peso: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Resultado
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingResultado ? "Editar Resultado" : "Nuevo Resultado"}</DialogTitle>
                  <DialogDescription>
                    {editingResultado
                      ? "Modifica la información del resultado"
                      : "Registra un nuevo resultado de competencia"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="evento_id">Evento</Label>
                      <Select
                        value={formData.evento_id}
                        onValueChange={(value) => setFormData({ ...formData, evento_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventos.map((evento) => (
                            <SelectItem key={evento.id} value={evento.id.toString()}>
                              {evento.nombre} - {evento.categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sentadilla">Sentadilla (kg)</Label>
                        <Input
                          id="sentadilla"
                          type="number"
                          step="0.01"
                          value={formData.sentadilla}
                          onChange={(e) => setFormData({ ...formData, sentadilla: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="press_banca">Press Banca (kg)</Label>
                        <Input
                          id="press_banca"
                          type="number"
                          step="0.01"
                          value={formData.press_banca}
                          onChange={(e) => setFormData({ ...formData, press_banca: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="peso_muerto">Peso Muerto (kg)</Label>
                      <Input
                        id="peso_muerto"
                        type="number"
                        step="0.01"
                        value={formData.peso_muerto}
                        onChange={(e) => setFormData({ ...formData, peso_muerto: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria_peso">Categoría de Peso</Label>
                      <Select
                        value={formData.categoria_peso}
                        onValueChange={(value) => setFormData({ ...formData, categoria_peso: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriaPesoOptions.map((categoria) => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria} kg
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingResultado ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atleta</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Sentadilla</TableHead>
                <TableHead>Press Banca</TableHead>
                <TableHead>Peso Muerto</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Wilks Score</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResultados.map((resultado) => (
                <TableRow key={resultado.id}>
                  <TableCell className="font-medium">{getAtletaNombre(resultado.atleta_id)}</TableCell>
                  <TableCell>{getEventoNombre(resultado.evento_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Weight className="h-4 w-4 text-blue-500" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getLiftColor("sentadilla")}`}>
                        {resultado.sentadilla} kg
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Weight className="h-4 w-4 text-green-500" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getLiftColor("press_banca")}`}>
                        {resultado.press_banca} kg
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Weight className="h-4 w-4 text-red-500" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getLiftColor("peso_muerto")}`}>
                        {resultado.peso_muerto} kg
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <Calculator className="h-4 w-4 text-gray-500" />
                      {resultado.total} kg
                    </div>
                  </TableCell>
                  <TableCell>{resultado.categoria_peso} kg</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <Percentage className="h-4 w-4 text-yellow-500" />
                      {resultado.wilks_score.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(resultado)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(resultado.id)}>
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
