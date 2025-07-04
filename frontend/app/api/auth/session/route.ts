import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ message: 'Token no proporcionado.' }, { status: 400 });
    }

    // Serializa la cookie con los flags de seguridad correctos
    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    });

    // Devuelve una respuesta exitosa con la cookie en las cabeceras
    return NextResponse.json(
      { message: 'Sesión iniciada correctamente.' },
      {
        status: 200,
        headers: { 'Set-Cookie': serialized },
      }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Error en el servidor al crear la sesión.' }, { status: 500 });
  }
}