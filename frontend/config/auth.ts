// Configuración de autenticación y 2FA
export const AUTH_CONFIG = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  // 2FA Configuration
  TWO_FA: {
    APP_NAME: "Powerlifting Federation",
    ISSUER: "Powerlifting Federation",
    CODE_LENGTH: 6,
    WINDOW: 2, // Ventana de tiempo para códigos TOTP
    BACKUP_CODES_COUNT: 8,
  },

  // Temporary codes (SMS/Email)
  TEMP_CODES: {
    LENGTH: 6,
    EXPIRY_MINUTES: 5,
    MAX_ATTEMPTS: 3,
  },

  // Security settings
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15,
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_2FA_ROLES: ["Administrador", "Entrenador", "Organizador"],
  },

  // Email settings
  EMAIL: {
    FROM: process.env.EMAIL_FROM || "noreply@powerlifting.com",
    SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
    SMTP_PORT: Number.parseInt(process.env.SMTP_PORT || "587"),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  },

  // SMS settings (Twilio)
  SMS: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  },
} as const

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    VERIFY_2FA: "/api/auth/verify-2fa",
    SETUP_2FA: "/api/auth/setup-2fa",
    SEND_CODE: "/api/auth/send-code",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
  },
  USERS: {
    BASE: "/api/usuarios",
    BY_ID: (id: number) => `/api/usuarios/${id}`,
    PROFILE: "/api/usuarios/profile",
    CHANGE_PASSWORD: "/api/usuarios/change-password",
  },
  ATLETAS: {
    BASE: "/api/atletas",
    BY_ID: (id: number) => `/api/atletas/${id}`,
    SEARCH: "/api/atletas/search",
    STATS: (id: number) => `/api/atletas/${id}/stats`,
  },
  ENTRENADORES: {
    BASE: "/api/entrenadores",
    BY_ID: (id: number) => `/api/entrenadores/${id}`,
    SEARCH: "/api/entrenadores/search",
    ATLETAS: (id: number) => `/api/entrenadores/${id}/atletas`,
  },
  ORGANIZADORES: {
    BASE: "/api/organizadores",
    BY_ID: (id: number) => `/api/organizadores/${id}`,
    SEARCH: "/api/organizadores/search",
    COMPETENCIAS: (id: number) => `/api/organizadores/${id}/competencias`,
  },
} as const
