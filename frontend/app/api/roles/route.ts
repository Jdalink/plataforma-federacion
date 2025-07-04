import { NextResponse } from "next/server"

// Simulamos una base de datos en memoria
const roles = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
  },
  {
    id: 2,
    nombre: "Entrenador",
    descripcion: "Gestión de atletas y entrenamientos",
  },
  {
    id: 3,
    nombre: "Atleta",
    descripcion: "Acceso limitado a información personal",
  },
  {
    id: 4,
    nombre: "Gerencia",
    descripcion: "Acceso a reportes y estadísticas",
  },
]

export async function GET() {
  return NextResponse.json(roles)
}
