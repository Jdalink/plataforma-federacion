import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { UserNav } from '@/components/UserNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Federación de Powerlifting',
  description: 'Sistema de Gestión para la Federación de Powerlifting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full flex-col">
            {/* CORRECCIÓN: Se muestra el header siempre para poder navegar */}
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
              <nav className="flex-1">
                <Link href="/" className="text-lg font-bold">
                  Powerlifting Fed.
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                {/* El menú de usuario ahora será un placeholder */}
                <UserNav />
              </div>
            </header>

            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}