"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({ email: "", contrasena: "" });
  const API_URL = getApiUrl();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Llama al backend para autenticar
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginResult.error || "Credenciales inválidas");

      // 2. Llama a la API interna para establecer la cookie de sesión
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: loginResult.token }),
      });

      const sessionResult = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(sessionResult.message || "Error al crear la sesión");

      // 3. LA SOLUCIÓN DEFINITIVA: Redirección Forzada
      // Esto obliga al navegador a recargar la página desde la raíz.
      // Al hacerlo, la nueva cookie se envía y el middleware te deja pasar.
      window.location.href = '/';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Shield className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <CardTitle className="text-xl font-bold">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" autoComplete="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="contrasena">Contraseña</Label>
              <Input id="contrasena" type="password" autoComplete="current-password" value={loginData.contrasena} onChange={(e) => setLoginData({ ...loginData, contrasena: e.target.value })} required />
            </div>
            {error && (<Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>)}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Iniciando..." : "Entrar"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}