import { type NextRequest, NextResponse } from "next/server"

// Simulamos una base de datos en memoria
const atletas = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    fecha_nacimiento: "1995-03-15",
    genero: "Masculino",
    pais: "México",
    ciudad: "Ciudad de México",
    email: "juan.perez@email.com",
    telefono: "+52 555 123 4567",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    fecha_nacimiento: "1998-07-22",
    genero: "Femenino",
    pais: "España",
    ciudad: "Madrid",
    email: "maria.gonzalez@email.com",
    telefono: "+34 612 345 678",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Silva",
    fecha_nacimiento: "1992-11-08",
    genero: "Masculino",
    pais: "Brasil",
    ciudad: "São Paulo",
    email: "carlos.silva@email.com",
    telefono: "+55 11 98765 4321",
  },
]

let nextId = 4

export async function GET() {
  return NextResponse.json(atletas)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newAtleta = {
      id: nextId++,
      ...body,
    }
    atletas.push(newAtleta)
    return NextResponse.json(newAtleta, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating atleta" }, { status: 500 })
  }
}
