import { Request, Response } from 'express';
import { db } from '@/config/database';
import bcrypt from 'bcryptjs';

export class UsuariosController {
  // Obtener todos los usuarios con la información de su rol
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await db('usuarios')
        .select('usuarios.id', 'usuarios.nombre_usuario', 'usuarios.email', 'usuarios.activo', 'roles.nombre as rol_nombre')
        .leftJoin('roles', 'usuarios.rol_id', 'roles.id');
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }

  // Crear un nuevo usuario
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nombre_usuario, email, contrasena, rol_id } = req.body;
      if (!nombre_usuario || !email || !contrasena || !rol_id) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
      }
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const [newUsuario] = await db('usuarios').insert({
        nombre_usuario,
        email,
        contrasena_hash: hashedPassword,
        rol_id,
      }).returning('*');
      return res.status(201).json(newUsuario);
    } catch (error: any) {
        // Maneja el error si el email o usuario ya existen
        if (error.code === '23505') { 
           return res.status(409).json({ error: 'El email o nombre de usuario ya existe.' });
        }
        return res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }

  // Actualizar un usuario existente
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { nombre_usuario, email, rol_id, activo, contrasena } = req.body;
      const updateData: { [key: string]: any } = { nombre_usuario, email, rol_id, activo };

      // Solo actualiza la contraseña si se proporciona una nueva
      if (contrasena) {
        updateData.contrasena_hash = await bcrypt.hash(contrasena, 10);
      }

      const [updatedUsuario] = await db('usuarios').where({ id }).update(updateData).returning('*');
      if (!updatedUsuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      return res.json(updatedUsuario);
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  }

  // Eliminar un usuario
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deletedCount = await db('usuarios').where({ id }).del();
      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      return res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }
}