import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo de Patinetas Eléctricas | Patinetas Eléctricas Colombia',
  description: 'Descubre las mejores marcas y modelos de patinetas eléctricas disponibles en Colombia. Compara especificaciones, precios y encuentra la patineta perfecta para ti.',
  keywords: 'catálogo patinetas eléctricas, modelos patinetas eléctricas Colombia, marcas patinetas eléctricas, Xiaomi, Segway, Razor, Ninebot, precios patinetas eléctricas',
  openGraph: {
    title: 'Catálogo de Patinetas Eléctricas Colombia',
    description: 'Descubre las mejores marcas y modelos de patinetas eléctricas disponibles en Colombia.',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo de Patinetas Eléctricas Colombia',
    description: 'Descubre las mejores marcas y modelos de patinetas eléctricas disponibles en Colombia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
