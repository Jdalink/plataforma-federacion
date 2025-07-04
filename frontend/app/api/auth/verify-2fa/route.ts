import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, code, method } = await request.json()

    // Simulamos validación de códigos 2FA
    const validCodes = {
      app: ["123456", "654321"],
      sms: ["111111", "222222"],
      email: ["333333", "444444"],
    }

    const isValidCode = validCodes[method as keyof typeof validCodes]?.includes(code)

    if (!isValidCode) {
      return NextResponse.json({ error: "Código inválido" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Autenticación exitosa",
      user: {
        nombre_usuario: username,
        rol: "Administrador",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
