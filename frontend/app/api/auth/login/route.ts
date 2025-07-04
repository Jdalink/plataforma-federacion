import { type NextRequest, NextResponse } from "next/server"

// Simulamos usuarios con 2FA
const usuarios = [
  {
    id: 1,
    nombre_usuario: "admin",
    contrasena: "admin123",
    email: "admin@sistema.com",
    has2FA: true,
    rol: "Administrador",
  },
  {
    id: 2,
    nombre_usuario: "entrenador1",
    contrasena: "entrenador123",
    email: "entrenador1@sistema.com",
    has2FA: false,
    rol: "Entrenador",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { nombre_usuario, contrasena } = await request.json()

    const usuario = usuarios.find((u) => u.nombre_usuario === nombre_usuario && u.contrasena === contrasena)

    if (!usuario) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Simulamos que siempre requiere 2FA para demostración
    const requires2FA = true

    if (requires2FA) {
      // Simulamos códigos de respaldo y QR
      const backupCodes = ["ABC123", "DEF456", "GHI789", "JKL012", "MNO345", "PQR678", "STU901", "VWX234"]

      return NextResponse.json({
        requires2FA: true,
        has2FASetup: usuario.has2FA,
        qrCode:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // QR placeholder
        backupCodes: usuario.has2FA ? [] : backupCodes,
        message: usuario.has2FA ? "Ingresa tu código 2FA" : "Configura tu autenticación de dos factores",
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.rol,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
