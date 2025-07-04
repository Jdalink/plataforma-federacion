"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Users, Shield } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Usuario { id: number; nombre_usuario: string; email: string; rol_nombre: string; rol_id: number; activo: boolean; }
interface Rol { id: number; nombre: string; }

export default function UsuariosPage() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({ nombre_usuario: "", email: "", contrasena: "", rol_id: "", activo: true });

  const API_URL = getApiUrl();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/roles`)
      ]);

      if (!usersResponse.ok) throw new Error("No se pudieron cargar los usuarios.");
      if (!rolesResponse.ok) throw new Error("No se pudieron cargar los roles.");

      setUsuarios(await usersResponse.json());
      setRoles(await rolesResponse.json());
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error de Carga", description: error.message });
    }
  };

  const resetForm = () => {
    setEditingUsuario(null);
    setFormData({ nombre_usuario: "", email: "", contrasena: "", rol_id: "", activo: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUsuario ? `${API_URL}/usuarios/${editingUsuario.id}` : `${API_URL}/usuarios`;
    const method = editingUsuario ? "PUT" : "POST";

    let submitData: any = { ...formData, rol_id: Number(formData.rol_id) };
    if (editingUsuario && !formData.contrasena) {
      delete submitData.contrasena;
    }

    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitData) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({ title: "Éxito", description: `Usuario ${editingUsuario ? 'actualizado' : 'creado'} correctamente.` });
      fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleEditClick = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        contrasena: '',
        rol_id: roles.find(r => r.nombre === usuario.rol_nombre)?.id.toString() || '',
        activo: usuario.activo
    });
    setIsDialogOpen(true);
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <Link href="/" className="text-sm text-blue-600">← Volver al Dashboard</Link>
        </div>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <Input placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Nuevo Usuario</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div><Label htmlFor="nombre_usuario">Nombre de Usuario</Label><Input id="nombre_usuario" value={formData.nombre_usuario} onChange={e => setFormData({...formData, nombre_usuario: e.target.value})} required/></div>
                                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/></div>
                                <div><Label htmlFor="contrasena">Contraseña {editingUsuario && '(dejar vacío para mantener)'}</Label><Input id="contrasena" type="password" value={formData.contrasena} onChange={e => setFormData({...formData, contrasena: e.target.value})} required={!editingUsuario}/></div>
                                <div>
                                    <Label htmlFor="rol_id">Rol</Label>
                                    <Select value={formData.rol_id} onValueChange={value => setFormData({...formData, rol_id: value})} required>
                                        <SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger>
                                        <SelectContent>
                                            {roles.map(rol => (<SelectItem key={rol.id} value={rol.id.toString()}>{rol.nombre}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="activo" checked={formData.activo} onCheckedChange={checked => setFormData({...formData, activo: checked})} />
                                    <Label htmlFor="activo">Activo</Label>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">{editingUsuario ? 'Actualizar' : 'Crear Usuario'}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                       {/* ... Encabezados de la tabla ... */}
                    </TableHeader>
                    <TableBody>
                        {filteredUsuarios.map(usuario => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.nombre_usuario}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell><Badge>{usuario.rol_nombre}</Badge></TableCell>
                                <TableCell>{usuario.activo ? 'Activo' : 'Inactivo'}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(usuario)}><Edit className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}