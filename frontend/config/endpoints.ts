// Configuración centralizada de endpoints de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const ENDPOINTS = {
  // Atletas
  ATLETAS: {
    GET_ALL: "/api/atletas",
    GET_BY_ID: (id: number) => `/api/atletas/${id}`,
    CREATE: "/api/atletas",
    UPDATE: (id: number) => `/api/atletas/${id}`,
    DELETE: (id: number) => `/api/atletas/${id}`,
    SEARCH: "/api/atletas/search",
  },

  // Competencias
  COMPETENCIAS: {
    GET_ALL: "/api/competencias",
    GET_BY_ID: (id: number) => `/api/competencias/${id}`,
    CREATE: "/api/competencias",
    UPDATE: (id: number) => `/api/competencias/${id}`,
    DELETE: (id: number) => `/api/competencias/${id}`,
    GET_BY_DATE_RANGE: "/api/competencias/date-range",
  },

  // Entrenamientos
  ENTRENAMIENTOS: {
    GET_ALL: "/api/entrenamientos",
    GET_BY_ID: (id: number) => `/api/entrenamientos/${id}`,
    GET_BY_ATLETA: (atletaId: number) => `/api/entrenamientos/atleta/${atletaId}`,
    CREATE: "/api/entrenamientos",
    UPDATE: (id: number) => `/api/entrenamientos/${id}`,
    DELETE: (id: number) => `/api/entrenamientos/${id}`,
    GET_BY_DATE: "/api/entrenamientos/date",
  },

  // Entrenadores
  ENTRENADORES: {
    GET_ALL: "/api/entrenadores",
    GET_BY_ID: (id: number) => `/api/entrenadores/${id}`,
    CREATE: "/api/entrenadores",
    UPDATE: (id: number) => `/api/entrenadores/${id}`,
    DELETE: (id: number) => `/api/entrenadores/${id}`,
    ASSIGN_ATLETA: "/api/entrenadores/assign",
  },

  // Resultados
  RESULTADOS: {
    GET_ALL: "/api/resultados",
    GET_BY_ID: (id: number) => `/api/resultados/${id}`,
    GET_BY_ATLETA: (atletaId: number) => `/api/resultados/atleta/${atletaId}`,
    GET_BY_EVENTO: (eventoId: number) => `/api/resultados/evento/${eventoId}`,
    CREATE: "/api/resultados",
    UPDATE: (id: number) => `/api/resultados/${id}`,
    DELETE: (id: number) => `/api/resultados/${id}`,
    GET_RANKINGS: "/api/resultados/rankings",
  },

  // Eventos
  EVENTOS: {
    GET_ALL: "/api/eventos",
    GET_BY_ID: (id: number) => `/api/eventos/${id}`,
    GET_BY_COMPETENCIA: (competenciaId: number) => `/api/eventos/competencia/${competenciaId}`,
    CREATE: "/api/eventos",
    UPDATE: (id: number) => `/api/eventos/${id}`,
    DELETE: (id: number) => `/api/eventos/${id}`,
  },

  // Usuarios
  USUARIOS: {
    GET_ALL: "/api/usuarios",
    GET_BY_ID: (id: number) => `/api/usuarios/${id}`,
    CREATE: "/api/usuarios",
    UPDATE: (id: number) => `/api/usuarios/${id}`,
    DELETE: (id: number) => `/api/usuarios/${id}`,
    CHANGE_PASSWORD: (id: number) => `/api/usuarios/${id}/password`,
    TOGGLE_STATUS: (id: number) => `/api/usuarios/${id}/status`,
  },

  // Roles
  ROLES: {
    GET_ALL: "/api/roles",
    GET_BY_ID: (id: number) => `/api/roles/${id}`,
    CREATE: "/api/roles",
    UPDATE: (id: number) => `/api/roles/${id}`,
    DELETE: (id: number) => `/api/roles/${id}`,
  },

  // Rendimiento
  RENDIMIENTO: {
    GET_BY_ATLETA: (atletaId: number) => `/api/rendimiento/${atletaId}`,
    CREATE: "/api/rendimiento",
    UPDATE: (id: number) => `/api/rendimiento/${id}`,
    DELETE: (id: number) => `/api/rendimiento/${id}`,
    GET_STATS: (atletaId: number) => `/api/rendimiento/${atletaId}/stats`,
    GET_PROGRESS: (atletaId: number) => `/api/rendimiento/${atletaId}/progress`,
  },

  // Planes de Entrenamiento
  PLANES_ENTRENAMIENTO: {
    GET_BY_ATLETA: (atletaId: number) => `/api/planes-entrenamiento/${atletaId}`,
    GET_BY_ID: (id: string) => `/api/planes-entrenamiento/plan/${id}`,
    CREATE: "/api/planes-entrenamiento",
    UPDATE: (id: string) => `/api/planes-entrenamiento/${id}`,
    DELETE: (id: string) => `/api/planes-entrenamiento/${id}`,
    DUPLICATE: (id: string) => `/api/planes-entrenamiento/${id}/duplicate`,
  },

  // Planes de Alimentación
  PLANES_ALIMENTACION: {
    GET_BY_ATLETA: (atletaId: number) => `/api/planes-alimentacion/${atletaId}`,
    GET_BY_ID: (id: string) => `/api/planes-alimentacion/plan/${id}`,
    CREATE: "/api/planes-alimentacion",
    UPDATE: (id: string) => `/api/planes-alimentacion/${id}`,
    DELETE: (id: string) => `/api/planes-alimentacion/${id}`,
    DUPLICATE: (id: string) => `/api/planes-alimentacion/${id}/duplicate`,
  },

  // IA - Generación de Planes
  AI: {
    GENERATE_TRAINING_PLAN: "/api/ai/generate-training-plan",
    GENERATE_NUTRITION_PLAN: "/api/ai/generate-nutrition-plan",
    ANALYZE_PERFORMANCE: "/api/ai/analyze-performance",
    SUGGEST_IMPROVEMENTS: "/api/ai/suggest-improvements",
  },

  // Autenticación
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    VERIFY_2FA: "/api/auth/verify-2fa",
    SETUP_2FA: "/api/auth/setup-2fa",
    SEND_CODE: "/api/auth/send-code",
    REFRESH_TOKEN: "/api/auth/refresh",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
  },

  // Dashboard y Estadísticas
  DASHBOARD: {
    GET_STATS: "/api/dashboard/stats",
    GET_RECENT_ACTIVITY: "/api/dashboard/recent-activity",
    GET_UPCOMING_EVENTS: "/api/dashboard/upcoming-events",
    GET_TOP_PERFORMERS: "/api/dashboard/top-performers",
  },

  // Reportes
  REPORTES: {
    EXPORT_ATLETAS: "/api/reportes/atletas/export",
    EXPORT_RESULTADOS: "/api/reportes/resultados/export",
    EXPORT_PLANES: "/api/reportes/planes/export",
    GENERATE_PERFORMANCE_REPORT: (atletaId: number) => `/api/reportes/performance/${atletaId}`,
  },

  // Configuración
  CONFIG: {
    GET_SETTINGS: "/api/config/settings",
    UPDATE_SETTINGS: "/api/config/settings",
    GET_CATEGORIES: "/api/config/categories",
    UPDATE_CATEGORIES: "/api/config/categories",
  },
} as const

// Tipos para los endpoints
export type EndpointKey = keyof typeof ENDPOINTS
export type EndpointValue = (typeof ENDPOINTS)[EndpointKey]

// Helper para construir URLs completas
export const buildUrl = (endpoint: string, params?: Record<string, string | number>) => {
  let url = `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString())
    })
    url += `?${searchParams.toString()}`
  }

  return url
}

// Configuración de headers por defecto
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

// Configuración de timeouts
export const REQUEST_TIMEOUT = 30000 // 30 segundos

// Configuración de reintentos
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 segundo
  retryOn: [408, 429, 500, 502, 503, 504],
}
