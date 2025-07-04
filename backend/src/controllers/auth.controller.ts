import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, contrasena } = req.body;
      if (!email || !contrasena) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }
      const result = await this.authService.login(email, contrasena);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}