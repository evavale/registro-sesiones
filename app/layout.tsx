import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Registro de sesiones",
  description: "Registro de sesiones de apoyo escolar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <Link href="/">
            <h1>Registro de sesiones</h1>
          </Link>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}