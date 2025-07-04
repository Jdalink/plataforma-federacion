import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Crea una cookie expirada para eliminar la existente
  const seralized = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Expira inmediatamente
    path: '/',
  });

  return NextResponse.json(
    { message: 'Sesión cerrada' },
    {
      status: 200,
      headers: { 'Set-Cookie': seralized },
    }
  );
}