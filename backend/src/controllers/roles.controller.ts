import { Request, Response } from 'express';
import { db } from '@/config/database';
import { logger } from '@/utils/logger';

export class RolesController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const roles = await db('roles').select('id', 'nombre').orderBy('id', 'asc');
      return res.json(roles);
    } catch (error) {
      logger.error('Error al obtener los roles', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}