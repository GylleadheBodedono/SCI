import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
  title: "SCI - Sistema de Contestações",
  description: "Gerenciamento estratégico de contestações iFood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
