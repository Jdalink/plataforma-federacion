import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, method, phone, email } = await request.json()

    // Simulamos envío de código
    const codes = {
      sms: "111111",
      email: "333333",
    }

    const code = codes[method as keyof typeof codes]

    if (method === "sms") {
      console.log(`Código SMS enviado a ${phone}: ${code}`)
    } else if (method === "email") {
      console.log(`Código email enviado a ${email}: ${code}`)
    }

    return NextResponse.json({
      success: true,
      message: `Código enviado por ${method}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
