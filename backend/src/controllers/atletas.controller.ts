import { Request, Response, NextFunction } from 'express';
// Por ahora, creamos funciones vacías para que compile
export class AtletasController {
    async getAll(req: Request, res: Response, next: NextFunction) { res.json([]); }
    async getById(req: Request, res: Response, next: NextFunction) { res.json({}); }
    async create(req: Request, res: Response, next: NextFunction) { res.status(201).json({}); }
    async update(req: Request, res: Response, next: NextFunction) { res.json({}); }
    async delete(req: Request, res: Response, next: NextFunction) { res.json({ message: 'deleted' }); }
}