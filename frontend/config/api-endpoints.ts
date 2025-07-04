/**
 * Configuración centralizada de endpoints de la API
 *
 * ¿Por qué necesitamos esto?
 * - Evita duplicar URLs en múltiples archivos
 * - Facilita cambios de endpoints sin buscar en todo el código
 * - Proporciona tipado TypeScript para mayor seguridad
 * - Permite diferentes configuraciones para desarrollo/producción
 */

// URL base de la API - cambia automáticamente según el entorno
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Configuración de timeouts y reintentos
export const API_CONFIG = {
  timeout: 30000, // 30 segundos
  retries: 3,
  retryDelay: 1000, // 1 segundo entre reintentos
}

// Headers por defecto para todas las peticiones
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

/**
 * Endpoints organizados por módulo
 * Cada módulo tiene sus operaciones CRUD básicas
 */
export const ENDPOINTS = {
  // ==========================================
  // AUTENTICACIÓN Y SEGURIDAD
  // ==========================================
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    VERIFY_2FA: "/auth/verify-2fa",
    SETUP_2FA: "/auth/setup-2fa",
    SEND_CODE: "/auth/send-code",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // ==========================================
  // GESTIÓN DE ATLETAS
  // ==========================================
  ATLETAS: {
    // Operaciones básicas CRUD
    GET_ALL: "/atletas",
    GET_BY_ID: (id: number) => `/atletas/${id}`,
    CREATE: "/atletas",
    UPDATE: (id: number) => `/atletas/${id}`,
    DELETE: (id: number) => `/atletas/${id}`,

    // Operaciones específicas
    SEARCH: "/atletas/search",
    GET_BY_ENTRENADOR: (entrenadorId: number) => `/atletas/entrenador/${entrenadorId}`,
    GET_STATISTICS: (id: number) => `/atletas/${id}/statistics`,
    UPLOAD_PHOTO: (id: number) => `/atletas/${id}/photo`,
    GET_RANKINGS: "/atletas/rankings",
    EXPORT: "/atletas/export",
  },

  // ==========================================
  // GESTIÓN DE ENTRENADORES
  // ==========================================
  ENTRENADORES: {
    GET_ALL: "/entrenadores",
    GET_BY_ID: (id: number) => `/entrenadores/${id}`,
    CREATE: "/entrenadores",
    UPDATE: (id: number) => `/entrenadores/${id}`,
    DELETE: (id: number) => `/entrenadores/${id}`,

    // Asignación de atletas
    ASSIGN_ATLETA: "/entrenadores/assign-atleta",
    UNASSIGN_ATLETA: "/entrenadores/unassign-atleta",
    GET_ATLETAS: (id: number) => `/entrenadores/${id}/atletas`,

    // Estadísticas
    GET_PERFORMANCE: (id: number) => `/entrenadores/${id}/performance`,
  },

  // ==========================================
  // COMPETENCIAS Y EVENTOS
  // ==========================================
  COMPETENCIAS: {
    GET_ALL: "/competencias",
    GET_BY_ID: (id: number) => `/competencias/${id}`,
    CREATE: "/competencias",
    UPDATE: (id: number) => `/competencias/${id}`,
    DELETE: (id: number) => `/competencias/${id}`,

    // Filtros y búsquedas
    GET_BY_DATE_RANGE: "/competencias/date-range",
    GET_UPCOMING: "/competencias/upcoming",
    GET_BY_TYPE: (tipo: string) => `/competencias/tipo/${tipo}`,

    // Inscripciones
    REGISTER_ATLETA: (id: number) => `/competencias/${id}/register`,
    UNREGISTER_ATLETA: (id: number) => `/competencias/${id}/unregister`,
    GET_PARTICIPANTS: (id: number) => `/competencias/${id}/participants`,
  },

  // ==========================================
  // EVENTOS (dentro de competencias)
  // ==========================================
  EVENTOS: {
    GET_ALL: "/eventos",
    GET_BY_ID: (id: number) => `/eventos/${id}`,
    GET_BY_COMPETENCIA: (competenciaId: number) => `/eventos/competencia/${competenciaId}`,
    CREATE: "/eventos",
    UPDATE: (id: number) => `/eventos/${id}`,
    DELETE: (id: number) => `/eventos/${id}`,

    // Gestión de eventos
    START_EVENT: (id: number) => `/eventos/${id}/start`,
    FINISH_EVENT: (id: number) => `/eventos/${id}/finish`,
    GET_LIVE_RESULTS: (id: number) => `/eventos/${id}/live-results`,
  },

  // ==========================================
  // RESULTADOS DE POWERLIFTING
  // ==========================================
  RESULTADOS: {
    GET_ALL: "/resultados",
    GET_BY_ID: (id: number) => `/resultados/${id}`,
    GET_BY_ATLETA: (atletaId: number) => `/resultados/atleta/${atletaId}`,
    GET_BY_EVENTO: (eventoId: number) => `/resultados/evento/${eventoId}`,
    CREATE: "/resultados",
    UPDATE: (id: number) => `/resultados/${id}`,
    DELETE: (id: number) => `/resultados/${id}`,

    // Rankings y estadísticas
    GET_RANKINGS: "/resultados/rankings",
    GET_RECORDS: "/resultados/records",
    GET_BY_CATEGORY: (categoria: string) => `/resultados/categoria/${categoria}`,
    CALCULATE_WILKS: "/resultados/calculate-wilks",

    // Exportación
    EXPORT_RESULTS: (eventoId: number) => `/resultados/evento/${eventoId}/export`,
  },

  // ==========================================
  // ENTRENAMIENTOS
  // ==========================================
  ENTRENAMIENTOS: {
    GET_ALL: "/entrenamientos",
    GET_BY_ID: (id: number) => `/entrenamientos/${id}`,
    GET_BY_ATLETA: (atletaId: number) => `/entrenamientos/atleta/${atletaId}`,
    GET_BY_ENTRENADOR: (entrenadorId: number) => `/entrenamientos/entrenador/${entrenadorId}`,
    CREATE: "/entrenamientos",
    UPDATE: (id: number) => `/entrenamientos/${id}`,
    DELETE: (id: number) => `/entrenamientos/${id}`,

    // Filtros por fecha
    GET_BY_DATE: "/entrenamientos/date",
    GET_BY_DATE_RANGE: "/entrenamientos/date-range",

    // Estadísticas
    GET_VOLUME_STATS: (atletaId: number) => `/entrenamientos/atleta/${atletaId}/volume`,
    GET_INTENSITY_STATS: (atletaId: number) => `/entrenamientos/atleta/${atletaId}/intensity`,
  },

  // ==========================================
  // ANÁLISIS DE RENDIMIENTO
  // ==========================================
  RENDIMIENTO: {
    GET_BY_ATLETA: (atletaId: number) => `/rendimiento/atleta/${atletaId}`,
    CREATE: "/rendimiento",
    UPDATE: (id: number) => `/rendimiento/${id}`,
    DELETE: (id: number) => `/rendimiento/${id}`,

    // Análisis y estadísticas
    GET_PROGRESS: (atletaId: number) => `/rendimiento/atleta/${atletaId}/progress`,
    GET_PRs: (atletaId: number) => `/rendimiento/atleta/${atletaId}/prs`,
    GET_TRENDS: (atletaId: number) => `/rendimiento/atleta/${atletaId}/trends`,
    COMPARE_ATHLETES: "/rendimiento/compare",

    // Predicciones
    PREDICT_PERFORMANCE: (atletaId: number) => `/rendimiento/atleta/${atletaId}/predict`,
  },

  // ==========================================
  // PLANES DE ENTRENAMIENTO (IA)
  // ==========================================
  PLANES_ENTRENAMIENTO: {
    GET_BY_ATLETA: (atletaId: number) => `/planes-entrenamiento/atleta/${atletaId}`,
    GET_BY_ID: (id: string) => `/planes-entrenamiento/${id}`,
    CREATE: "/planes-entrenamiento",
    UPDATE: (id: string) => `/planes-entrenamiento/${id}`,
    DELETE: (id: string) => `/planes-entrenamiento/${id}`,

    // Funciones específicas
    DUPLICATE: (id: string) => `/planes-entrenamiento/${id}/duplicate`,
    ACTIVATE: (id: string) => `/planes-entrenamiento/${id}/activate`,
    DEACTIVATE: (id: string) => `/planes-entrenamiento/${id}/deactivate`,

    // Generación con IA
    GENERATE_AI: "/planes-entrenamiento/generate-ai",
    REGENERATE: (id: string) => `/planes-entrenamiento/${id}/regenerate`,
  },

  // ==========================================
  // PLANES DE ALIMENTACIÓN (IA)
  // ==========================================
  PLANES_ALIMENTACION: {
    GET_BY_ATLETA: (atletaId: number) => `/planes-alimentacion/atleta/${atletaId}`,
    GET_BY_ID: (id: string) => `/planes-alimentacion/${id}`,
    CREATE: "/planes-alimentacion",
    UPDATE: (id: string) => `/planes-alimentacion/${id}`,
    DELETE: (id: string) => `/planes-alimentacion/${id}`,

    // Funciones específicas
    DUPLICATE: (id: string) => `/planes-alimentacion/${id}/duplicate`,
    ACTIVATE: (id: string) => `/planes-alimentacion/${id}/activate`,
    DEACTIVATE: (id: string) => `/planes-alimentacion/${id}/deactivate`,

    // Generación con IA
    GENERATE_AI: "/planes-alimentacion/generate-ai",
    REGENERATE: (id: string) => `/planes-alimentacion/${id}/regenerate`,
    CALCULATE_MACROS: "/planes-alimentacion/calculate-macros",
  },

  // ==========================================
  // SERVICIOS DE IA
  // ==========================================
  AI: {
    GENERATE_TRAINING_PLAN: "/ai/generate-training-plan",
    GENERATE_NUTRITION_PLAN: "/ai/generate-nutrition-plan",
    ANALYZE_PERFORMANCE: "/ai/analyze-performance",
    SUGGEST_IMPROVEMENTS: "/ai/suggest-improvements",
    PREDICT_RESULTS: "/ai/predict-results",
    CHAT_ASSISTANT: "/ai/chat",
  },

  // ==========================================
  // USUARIOS Y ROLES
  // ==========================================
  USUARIOS: {
    GET_ALL: "/usuarios",
    GET_BY_ID: (id: number) => `/usuarios/${id}`,
    CREATE: "/usuarios",
    UPDATE: (id: number) => `/usuarios/${id}`,
    DELETE: (id: number) => `/usuarios/${id}`,

    // Gestión de estado
    TOGGLE_STATUS: (id: number) => `/usuarios/${id}/toggle-status`,
    RESET_PASSWORD: (id: number) => `/usuarios/${id}/reset-password`,

    // Permisos
    UPDATE_PERMISSIONS: (id: number) => `/usuarios/${id}/permissions`,
  },

  ROLES: {
    GET_ALL: "/roles",
    GET_BY_ID: (id: number) => `/roles/${id}`,
    CREATE: "/roles",
    UPDATE: (id: number) => `/roles/${id}`,
    DELETE: (id: number) => `/roles/${id}`,
    GET_PERMISSIONS: "/roles/permissions",
  },

  // ==========================================
  // DASHBOARD Y ESTADÍSTICAS
  // ==========================================
  DASHBOARD: {
    GET_OVERVIEW: "/dashboard/overview",
    GET_STATS: "/dashboard/stats",
    GET_RECENT_ACTIVITY: "/dashboard/recent-activity",
    GET_UPCOMING_EVENTS: "/dashboard/upcoming-events",
    GET_TOP_PERFORMERS: "/dashboard/top-performers",
    GET_CHARTS_DATA: "/dashboard/charts",
  },

  // ==========================================
  // REPORTES Y EXPORTACIÓN
  // ==========================================
  REPORTES: {
    EXPORT_ATLETAS: "/reportes/atletas/export",
    EXPORT_RESULTADOS: "/reportes/resultados/export",
    EXPORT_ENTRENAMIENTOS: "/reportes/entrenamientos/export",
    GENERATE_PERFORMANCE_REPORT: (atletaId: number) => `/reportes/performance/${atletaId}`,
    GENERATE_COMPETITION_REPORT: (competenciaId: number) => `/reportes/competencia/${competenciaId}`,
    GET_ANALYTICS: "/reportes/analytics",
  },

  // ==========================================
  // CONFIGURACIÓN DEL SISTEMA
  // ==========================================
  CONFIG: {
    GET_SETTINGS: "/config/settings",
    UPDATE_SETTINGS: "/config/settings",
    GET_CATEGORIES: "/config/weight-categories",
    UPDATE_CATEGORIES: "/config/weight-categories",
    GET_SYSTEM_INFO: "/config/system-info",
    BACKUP_DATABASE: "/config/backup",
    RESTORE_DATABASE: "/config/restore",
  },

  // ==========================================
  // UPLOADS Y ARCHIVOS
  // ==========================================
  UPLOADS: {
    UPLOAD_IMAGE: "/uploads/image",
    UPLOAD_DOCUMENT: "/uploads/document",
    DELETE_FILE: (filename: string) => `/uploads/${filename}`,
    GET_FILE: (filename: string) => `/uploads/${filename}`,
  },

  // ==========================================
  // NOTIFICACIONES
  // ==========================================
  NOTIFICATIONS: {
    GET_ALL: "/notifications",
    MARK_AS_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: (id: number) => `/notifications/${id}`,
    GET_UNREAD_COUNT: "/notifications/unread-count",
  },
} as const

/**
 * Helper para construir URLs completas con parámetros de consulta
 *
 * @param endpoint - El endpoint a usar
 * @param params - Parámetros de consulta opcionales
 * @returns URL completa
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number | boolean>) => {
  let url = `${API_BASE_URL}${endpoint}`

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  return url
}

/**
 * Helper para obtener headers con autenticación
 *
 * @param token - Token JWT opcional
 * @returns Headers con autenticación
 */
export const getAuthHeaders = (token?: string) => {
  const headers = { ...DEFAULT_HEADERS }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

/**
 * Tipos TypeScript para mayor seguridad
 */
export type EndpointKey = keyof typeof ENDPOINTS
export type EndpointValue = (typeof ENDPOINTS)[EndpointKey]

/**
 * Configuración específica por entorno
 */
export const ENV_CONFIG = {
  development: {
    apiUrl: "http://localhost:3001/api",
    timeout: 30000,
    retries: 3,
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.powerlifting-federation.com/api",
    timeout: 15000,
    retries: 2,
  },
  test: {
    apiUrl: "http://localhost:3002/api",
    timeout: 5000,
    retries: 1,
  },
}

/**
 * Obtener configuración según el entorno actual
 */
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || "development"
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development
}
