import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, code, phone, email } = await request.json()

    // Simulamos validación del código de configuración
    const validSetupCodes = ["123456", "111111", "333333"]

    if (!validSetupCodes.includes(code)) {
      return NextResponse.json({ error: "Código de configuración inválido" }, { status: 401 })
    }

    // Simulamos guardar la configuración 2FA
    console.log(`2FA configurado para ${username}:`, { phone, email })

    return NextResponse.json({
      success: true,
      message: "Autenticación de dos factores configurada exitosamente",
    })
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
