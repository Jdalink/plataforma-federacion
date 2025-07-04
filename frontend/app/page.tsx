import Link from "next/link"
import { getApiUrl } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Trophy, BarChart3, Target, UserCheck, Flame, Brain, Utensils, Weight } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Federación de Powerlifting</h1>
          <p className="text-lg text-gray-600">Gestiona atletas, competencias y rendimiento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Atletas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320</div>
              <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Competencias Activas</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 nacionales, 3 regionales</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Levantamientos Hoy</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1200</div>
              <p className="text-xs text-muted-foreground">Total de Kg levantados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/atletas">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Gestión de Atletas
                </CardTitle>
                <CardDescription>
                  Administra información personal, física y de rendimiento de los atletas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/competencias">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Competencias
                </CardTitle>
                <CardDescription>Organiza competencias, eventos y gestiona resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/entrenamientos">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Entrenamientos
                </CardTitle>
                <CardDescription>Planifica y registra sesiones de entrenamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/entrenadores">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Entrenadores
                </CardTitle>
                <CardDescription>Gestiona el equipo de entrenadores y su experiencia</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/resultados">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-red-600" />
                  Resultados
                </CardTitle>
                <CardDescription>Analiza resultados y rendimiento de competencias</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/usuarios">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Usuarios
                </CardTitle>
                <CardDescription>Administra usuarios del sistema y permisos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rendimiento">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Rendimiento
                </CardTitle>
                <CardDescription>Visualiza el rendimiento de los atletas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/planes-entrenamiento">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-sky-600" />
                  Planes de Entrenamiento IA
                </CardTitle>
                <CardDescription>Genera planes de entrenamiento con IA</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/planes-alimentacion">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-lime-600" />
                  Planes de Alimentación IA
                </CardTitle>
                <CardDescription>Genera planes de alimentación con IA</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}