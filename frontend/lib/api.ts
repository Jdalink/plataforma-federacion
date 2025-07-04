// frontend/lib/api.ts

/**
 * Devuelve la URL correcta de la API dependiendo de si el código
 * se está ejecutando en el servidor (build, SSR) o en el cliente (navegador).
 */
export const getApiUrl = (): string => {
  // Si `window` es undefined, significa que estamos en el entorno del servidor.
  if (typeof window === 'undefined') {
    return process.env.API_URL_SERVER || 'http://backend:3001/api';
  }

  // Si estamos en el navegador, usamos la variable pública.
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};