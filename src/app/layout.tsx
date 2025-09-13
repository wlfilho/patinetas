import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patinetas Eléctricas Colombia | Directorio Completo",
  description: "Encuentra las mejores patinetas eléctricas en Colombia. Directorio completo de tiendas, servicios técnicos, repuestos y más. Movilidad eléctrica sostenible.",
  keywords: "patinetas eléctricas, scooters eléctricos, Colombia, movilidad eléctrica, tiendas, repuestos, servicio técnico",
  authors: [{ name: "Patinetas Eléctricas Colombia" }],
  creator: "Patinetas Eléctricas Colombia",
  publisher: "Patinetas Eléctricas Colombia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://staging.motoselectricas.com.co'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Patinetas Eléctricas Colombia | Directorio Completo",
    description: "Encuentra las mejores patinetas eléctricas en Colombia. Directorio completo de tiendas, servicios técnicos, repuestos y más.",
    url: 'https://staging.motoselectricas.com.co',
    siteName: 'Patinetas Eléctricas Colombia',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Patinetas Eléctricas Colombia | Directorio Completo",
    description: "Encuentra las mejores patinetas eléctricas en Colombia. Directorio completo de tiendas, servicios técnicos, repuestos y más.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#10b981" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
