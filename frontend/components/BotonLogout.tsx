"use client"

import { useRouter } from "next/navigation"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

export function BotonLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Llama a la ruta API que creamos para destruir la cookie de sesión
      await fetch('/api/auth/logout', { method: 'POST' });

      // Redirige al usuario a la página de login y refresca para asegurar
      // que el estado de autenticación se actualice completamente.
      router.push('/login');
      router.refresh();

    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Cerrar Sesión</span>
    </DropdownMenuItem>
  );
}