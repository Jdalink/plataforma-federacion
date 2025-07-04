import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ======================================================================
// MODO DESARROLLO SIN AUTENTICACIÓN
// Este middleware ahora permite el acceso a todas las páginas directamente.
// ======================================================================
export function middleware(request: NextRequest) {
  // Simplemente dejamos pasar todas las peticiones sin verificar ningún token.
  return NextResponse.next();
}

// Mantenemos el matcher para que no interfiera con archivos de API o estáticos.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};