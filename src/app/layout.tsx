import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GA4 Realtime Dashboard",
  description: "Dashboard online para Google Analytics 4 con realtime e historico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
