"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api";


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
}

export default function AtletasPage() {
  const API_URL = getApiUrl();
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAtleta, setEditingAtleta] = useState<Atleta | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    pais: "",
    ciudad: "",
    email: "",
    telefono: "",
  })

  useEffect(() => {
    fetchAtletas()
  }, [])

  const fetchAtletas = async () => {
    try {
      // CORRECCIÓN: URL de fetch apuntando al backend de Docker
      const response = await fetch(`${API_URL}/atletas`);
      const data = await response.json()
      // Asumiendo que tu API devuelve un array directamente o un objeto con una propiedad 'data'
      setAtletas(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching atletas:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAtleta ? `http://backend:3001/api/atletas/${editingAtleta.id}` : "http://backend:3001/api/atletas"
      const method = editingAtleta ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchAtletas()
        setIsDialogOpen(false)
        setEditingAtleta(null)
        setFormData({
          nombre: "",
          apellido: "",
          fecha_nacimiento: "",
          genero: "",
          pais: "",
          ciudad: "",
          email: "",
          telefono: "",
        })
      }
    } catch (error) {
      console.error("Error saving atleta:", error)
    }
  }

  const handleEdit = (atleta: Atleta) => {
    setEditingAtleta(atleta)
    setFormData({
      nombre: atleta.nombre,
      apellido: atleta.apellido,
      fecha_nacimiento: new Date(atleta.fecha_nacimiento).toISOString().split('T')[0], // Formato YYYY-MM-DD
      genero: atleta.genero,
      pais: atleta.pais,
      ciudad: atleta.ciudad || "",
      email: atleta.email || "",
      telefono: atleta.telefono || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este atleta?")) {
      try {
        await fetch(`http://backend:3001/api/atletas/${id}`, { method: "DELETE" })
        fetchAtletas()
      } catch (error) {
        console.error("Error deleting atleta:", error)
      }
    }
  }

  const filteredAtletas = atletas.filter(
    (atleta) =>
      atleta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atleta.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atleta.pais.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* El resto del JSX se mantiene igual, ya era correcto. */}
      {/* ... Pega el resto de tu JSX aquí ... */}
    </div>
  )
}