import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PURE — Профессиональный клининг",
  description: "Профессиональный клининг-сервис для тех, кто ценит безупречность",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
