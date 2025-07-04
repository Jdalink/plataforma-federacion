import nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('Faltan credenciales SMTP en .env. El servicio de email no funcionará. Se usará un transportador de prueba.');
      this.transporter = nodemailer.createTransport({ jsonTransport: true });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: (process.env.SMTP_PORT || "587") === "465", // true for 465, false for other ports
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    }
  }

  async send2FACode(to: string, code: string) {
    const mailOptions = {
      from: `"Powerlifting Fed." <${process.env.EMAIL_FROM || 'noreply@powerlifting.com'}>`,
      to,
      subject: 'Tu Código de Verificación',
      html: `<p>Tu código de verificación es: <b>${code}</b>. Expira en 10 minutos.</p>`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Email de 2FA enviado a ${to}`);
    } catch (error) {
      logger.error('Error enviando email de 2FA', error);
      throw new Error('No se pudo enviar el código de verificación.');
    }
  }
}
export const emailService = new EmailService();