import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';
import { db } from '@/config/database';

interface JwtPayload { userId: number; email: string; rol: string; }

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Token de acceso requerido' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) { throw new Error("JWT_SECRET no está definido"); }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const usuario = await db('usuarios')
      .select('usuarios.*', 'roles.nombre as rol_nombre', 'roles.permisos')
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.id', decoded.userId).first();

    if (!usuario || !usuario.activo) {
      res.status(401).json({ error: 'Usuario no válido o inactivo' });
      return;
    }

    // Forma Segura: Guardamos el usuario en res.locals
    res.locals.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol_nombre,
      permisos: usuario.permisos || {},
    };

    next();
  } catch (error) {
    logger.error('Error en middleware de autenticación:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};