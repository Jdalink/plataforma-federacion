import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/config/database';
import { logger } from '@/utils/logger';

export class AuthService {
  public async login(email: string, contrasena: string) {
    const usuario = await db('usuarios')
      .select('usuarios.*', 'roles.nombre as rol_nombre')
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.email', email)
      .first();

    if (!usuario || !usuario.activo) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }

    const isValidPassword = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    await db('usuarios').where({ id: usuario.id }).update({ ultimo_login: new Date() });

    const payload = { userId: usuario.id, email: usuario.email, rol: usuario.rol_nombre };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT Secret no está definido');

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    return {
      token,
      user: { id: usuario.id, email: usuario.email, rol: usuario.rol_nombre },
    };
  }
}