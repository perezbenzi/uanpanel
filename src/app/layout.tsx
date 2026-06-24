import type { Metadata } from "next";
import { Inter, Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-face",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://admin-panel-au.vercel.app"),
  title: "AdminPanel - Tu negocio en un solo panel",
  description:
    "Panel de administración simple para emprendedores. Gestioná productos, pedidos y clientes desde un solo lugar, sin complicaciones.",
  openGraph: {
    title: "AdminPanel - Tu negocio en un solo panel",
    description:
      "Panel de administración simple para emprendedores. Gestioná productos, pedidos y clientes desde un solo lugar, sin complicaciones.",
    images: [{ url: "/og-image-adminpanel.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image-adminpanel.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
