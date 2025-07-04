# Guía de Implementación de Autenticación 2FA Open Source

Esta guía detalla la implementación completa del sistema de autenticación con doble factor usando tecnologías open source.

## 📋 Tecnologías Utilizadas

### Frontend
- **React/Next.js** - Framework principal
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Estilos

### Backend (Node.js/Express)
- **speakeasy** - Generación y verificación de códigos TOTP
- **qrcode** - Generación de códigos QR
- **nodemailer** - Envío de emails
- **twilio** - Envío de SMS (opcional)
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Tokens JWT

## 🚀 Pasos de Implementación

### 1. Instalación de Dependencias

\`\`\`bash
# Backend
npm install speakeasy qrcode nodemailer twilio bcryptjs jsonwebtoken
npm install -D @types/speakeasy @types/qrcode @types/nodemailer

# Frontend (ya incluido en el proyecto)
npm install @radix-ui/react-tabs @radix-ui/react-alert-dialog
\`\`\`

### 2. Configuración del Backend

#### Servicio de 2FA
\`\`\`typescript
// src/services/twofa.service.ts
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { prisma } from '../config/database'

export class TwoFAService {
  // Generar secret para nueva configuración
  async generateSecret(userId: number, email: string) {
    const secret = speakeasy.generateSecret({
      name: `Powerlifting Federation (${email})`,
      issuer: 'Powerlifting Federation',
      length: 32
    })

    // Guardar secret temporal
    await prisma.auth2FA.upsert({
      where: { usuarioId: userId },
      create: {
        usuarioId: userId,
        tempSecret: secret.base32,
        activo: false
      },
      update: {
        tempSecret: secret.base32,
        setupCompletado: false
      }
    })

    // Generar QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)
    
    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes: this.generateBackupCodes()
    }
  }

  // Verificar código TOTP
  verifyTOTP(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2 // Permite códigos de ±2 intervalos de tiempo
    })
  }

  // Generar códigos de respaldo
  generateBackupCodes(): string[] {
    const codes = []
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase())
    }
    return codes
  }

  // Activar 2FA después de verificación exitosa
  async activate2FA(userId: number, verifiedSecret: string, backupCodes: string[]) {
    await prisma.auth2FA.update({
      where: { usuarioId: userId },
      data: {
        secret: verifiedSecret,
        backupCodes,
        activo: true,
        setupCompletado: true,
        tempSecret: null
      }
    })
  }
}
\`\`\`

#### Servicio de Email
\`\`\`typescript
// src/services/email.service.ts
import nodemailer from 'nodemailer'
import { AUTH_CONFIG } from '../config/auth'

export class EmailService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: AUTH_CONFIG.EMAIL.SMTP_HOST,
      port: AUTH_CONFIG.EMAIL.SMTP_PORT,
      secure: false,
      auth: {
        user: AUTH_CONFIG.EMAIL.SMTP_USER,
        pass: AUTH_CONFIG.EMAIL.SMTP_PASS
      }
    })
  }

  async send2FACode(email: string, code: string) {
    const mailOptions = {
      from: AUTH_CONFIG.EMAIL.FROM,
      to: email,
      subject: 'Código de verificación 2FA - Powerlifting Federation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Código de Verificación</h2>
          <p>Tu código de verificación de dos factores es:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>Este código expira en 5 minutos.</p>
          <p>Si no solicitaste este código, ignora este email.</p>
        </div>
      `
    }

    await this.transporter.sendMail(mailOptions)
  }
}
\`\`\`

#### Servicio de SMS (Twilio)
\`\`\`typescript
// src/services/sms.service.ts
import twilio from 'twilio'
import { AUTH_CONFIG } from '../config/auth'

export class SMSService {
  private client

  constructor() {
    this.client = twilio(
      AUTH_CONFIG.SMS.ACCOUNT_SID,
      AUTH_CONFIG.SMS.AUTH_TOKEN
    )
  }

  async sendCode(phoneNumber: string, code: string) {
    await this.client.messages.create({
      body: `Tu código de verificación Powerlifting Federation es: ${code}. Expira en 5 minutos.`,
      from: AUTH_CONFIG.SMS.PHONE_NUMBER,
      to: phoneNumber
    })
  }
}
\`\`\`

### 3. Controladores de Autenticación

\`\`\`typescript
// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { TwoFAService } from '../services/twofa.service'
import { EmailService } from '../services/email.service'
import { SMSService } from '../services/sms.service'
import { prisma } from '../config/database'

export class AuthController {
  private twoFAService = new TwoFAService()
  private emailService = new EmailService()
  private smsService = new SMSService()

  async login(req: Request, res: Response) {
    try {
      const { nombre_usuario, contrasena } = req.body

      // Buscar usuario
      const usuario = await prisma.usuario.findUnique({
        where: { nombreUsuario: nombre_usuario },
        include: { rol: true, auth2fa: true }
      })

      if (!usuario || !usuario.activo) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(contrasena, usuario.contrasenaHash)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
      }

      // Verificar si requiere 2FA
      const requires2FA = AUTH_CONFIG.SECURITY.REQUIRE_2FA_ROLES.includes(usuario.rol.nombre)

      if (requires2FA) {
        if (usuario.auth2fa?.activo) {
          // 2FA ya configurado
          return res.json({
            requires2FA: true,
            has2FASetup: true,
            userId: usuario.id
          })
        } else {
          // Configurar 2FA por primera vez
          const setup = await this.twoFAService.generateSecret(usuario.id, usuario.email)
          return res.json({
            requires2FA: true,
            has2FASetup: false,
            qrCode: setup.qrCode,
            secret: setup.secret,
            backupCodes: setup.backupCodes,
            userId: usuario.id
          })
        }
      }

      // Login sin 2FA
      const tokens = this.generateTokens(usuario)
      res.json({ tokens, user: this.sanitizeUser(usuario) })

    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' })
    }
  }

  async setup2FA(req: Request, res: Response) {
    try {
      const { username, code, phone, email, method } = req.body

      const usuario = await prisma.usuario.findUnique({
        where: { nombreUsuario: username },
        include: { auth2fa: true }
      })

      if (!usuario || !usuario.auth2fa?.tempSecret) {
        return res.status(400).json({ error: 'Configuración inválida' })
      }

      let isValidCode = false

      switch (method) {
        case 'app':
          isValidCode = this.twoFAService.verifyTOTP(usuario.auth2fa.tempSecret, code)
          break
        case 'sms':
          isValidCode = await this.verifyTemporaryCode(usuario.id, code, 'sms')
          break
        case 'email':
          isValidCode = await this.verifyTemporaryCode(usuario.id, code, 'email')
          break
      }

      if (!isValidCode) {
        return res.status(401).json({ error: 'Código inválido' })
      }

      // Activar 2FA
      const backupCodes = this.twoFAService.generateBackupCodes()
      await this.twoFAService.activate2FA(usuario.id, usuario.auth2fa.tempSecret, backupCodes)

      // Actualizar información adicional
      await prisma.auth2FA.update({
        where: { usuarioId: usuario.id },
        data: {
          phone: phone || null,
          email2fa: email || null,
          metodoPreferido: method
        }
      })

      const tokens = this.generateTokens(usuario)
      res.json({ 
        success: true, 
        tokens, 
        user: this.sanitizeUser(usuario),
        message: '2FA configurado exitosamente'
      })

    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' })
    }
  }

  async verify2FA(req: Request, res: Response) {
    try {
      const { username, code, method } = req.body

      const usuario = await prisma.usuario.findUnique({
        where: { nombreUsuario: username },
        include: { rol: true, auth2fa: true }
      })

      if (!usuario || !usuario.auth2fa?.activo) {
        return res.status(400).json({ error: 'Usuario no encontrado' })
      }

      let isValidCode = false

      switch (method) {
        case 'app':
          isValidCode = this.twoFAService.verifyTOTP(usuario.auth2fa.secret!, code)
          break
        case 'backup':
          isValidCode = usuario.auth2fa.backupCodes.includes(code)
          if (isValidCode) {
            // Remover código usado
            const updatedCodes = usuario.auth2fa.backupCodes.filter(c => c !== code)
            await prisma.auth2FA.update({
              where: { usuarioId: usuario.id },
              data: { backupCodes: updatedCodes }
            })
          }
          break
        case 'sms':
        case 'email':
          isValidCode = await this.verifyTemporaryCode(usuario.id, code, method)
          break
      }

      if (!isValidCode) {
        return res.status(401).json({ error: 'Código inválido' })
      }

      const tokens = this.generateTokens(usuario)
      res.json({ 
        success: true, 
        tokens, 
        user: this.sanitizeUser(usuario) 
      })

    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' })
    }
  }

  async sendCode(req: Request, res: Response) {
    try {
      const { username, method, phone, email } = req.body

      const usuario = await prisma.usuario.findUnique({
        where: { nombreUsuario: username }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString()

      // Guardar código temporal
      await prisma.codigoTemporal.create({
        data: {
          usuarioId: usuario.id,
          codigo: code,
          tipo: method,
          expiraEn: new Date(Date.now() + 5 * 60 * 1000) // 5 minutos
        }
      })

      if (method === 'sms' && phone) {
        await this.smsService.sendCode(phone, code)
      } else if (method === 'email') {
        await this.emailService.send2FACode(email || usuario.email, code)
      }

      res.json({ success: true, message: `Código enviado por ${method}` })

    } catch (error) {
      res.status(500).json({ error: 'Error del servidor' })
    }
  }

  private async verifyTemporaryCode(userId: number, code: string, type: string): Promise<boolean> {
    const tempCode = await prisma.codigoTemporal.findFirst({
      where: {
        usuarioId: userId,
        codigo: code,
        tipo: type,
        usado: false,
        expiraEn: { gt: new Date() }
      }
    })

    if (tempCode) {
      await prisma.codigoTemporal.update({
        where: { id: tempCode.id },
        data: { usado: true }
      })
      return true
    }

    return false
  }

  private generateTokens(usuario: any) {
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre
    }

    const accessToken = jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
      expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN
    })

    const refreshToken = jwt.sign(payload, AUTH_CONFIG.JWT_REFRESH_SECRET, {
      expiresIn: AUTH_CONFIG.JWT_REFRESH_EXPIRES_IN
    })

    return { accessToken, refreshToken }
  }

  private sanitizeUser(usuario: any) {
    return {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol.nombre
    }
  }
}
\`\`\`

### 4. Rutas de Autenticación

\`\`\`typescript
// src/routes/auth.routes.ts
import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware'

const router = Router()
const authController = new AuthController()

// Aplicar rate limiting a rutas de auth
router.use(rateLimitMiddleware)

router.post('/login', authController.login.bind(authController))
router.post('/setup-2fa', authController.setup2FA.bind(authController))
router.post('/verify-2fa', authController.verify2FA.bind(authController))
router.post('/send-code', authController.sendCode.bind(authController))

export default router
\`\`\`

### 5. Middleware de Rate Limiting

\`\`\`typescript
// src/middleware/rate-limit.middleware.ts
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'

const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 5, // Número de intentos
  duration: 900, // Por 15 minutos
})

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip)
    next()
  } catch (rejRes) {
    res.status(429).json({
      error: 'Demasiados intentos. Intenta de nuevo en
