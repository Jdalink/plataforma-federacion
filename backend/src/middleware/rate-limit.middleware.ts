import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

const rateLimiter = new RateLimiterMemory({
  points: 100, // Peticiones
  duration: 60, // por segundo
});

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.ip) {
    // Si no hay IP, no podemos aplicar el límite, así que devolvemos un error.
    res.status(400).json({ error: 'Dirección IP no reconocida.' });
    return;
  }
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({ error: 'Demasiadas peticiones.' });
  }
};