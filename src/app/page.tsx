import Link from 'next/link'
import SearchBar from '@/components/ui/SearchBar'
import CategoryCard from '@/components/ui/CategoryCard'
import BrandCarousel from '@/components/ui/BrandCarousel'

import { generateSlug } from '@/lib/utils'

// Mock data for featured categories (in a real app, this would come from the database)
const featuredCategories = [
  {
    name: 'Venta de Patinetas Eléctricas',
    description: 'Encuentra las mejores tiendas para comprar tu patineta eléctrica nueva',
    count: 45,
    slug: generateSlug('Venta de Patinetas Eléctricas'),
    featured: true
  },
  {
    name: 'Reparación y Mantenimiento',
    description: 'Servicios técnicos especializados para mantener tu patineta en perfecto estado',
    count: 32,
    slug: generateSlug('Reparación y Mantenimiento'),
    featured: true
  },
  {
    name: 'Repuestos y Accesorios',
    description: 'Todo lo que necesitas para personalizar y reparar tu patineta eléctrica',
    count: 28,
    slug: generateSlug('Repuestos y Accesorios'),
    featured: true
  },
  {
    name: 'Alquiler de Patinetas',
    description: 'Alquila patinetas eléctricas por horas, días o semanas',
    count: 15,
    slug: generateSlug('Alquiler de Patinetas'),
    featured: false
  }
]

const stats = [
  { name: 'Negocios Registrados', value: '150+' },
  { name: 'Ciudades Cubiertas', value: '25+' },
  { name: 'Categorías Disponibles', value: '10+' },
  { name: 'Usuarios Activos', value: '5K+' },
]

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Encuentra las Mejores{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Patinetas Eléctricas
              </span>{' '}
              en Colombia
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              El directorio más completo de patinetas eléctricas en Colombia.
              Descubre tiendas, servicios técnicos, repuestos y todo lo que necesitas
              para tu movilidad eléctrica sostenible.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar
                size="lg"
                showFilters={true}
                placeholder="Buscar tiendas, servicios, repuestos..."
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.name} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {stat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Categorías Principales
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Explora las diferentes categorías de negocios especializados en patinetas eléctricas
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                description={category.description}
                count={category.count}
                slug={category.slug}
                featured={category.featured}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/categorias"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              Ver Todas las Categorías
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Carousel Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Marcas Destacadas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Descubre las mejores marcas de patinetas eléctricas disponibles en Colombia
            </p>
          </div>

          <BrandCarousel
            autoPlay={true}
            autoPlayInterval={4000}
            showNavigation={true}
            showDots={true}
            className="mb-8"
          />

          <div className="text-center">
            <Link
              href="/catalogo/marcas"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              Ver Todas las Marcas
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Tienes un Negocio de Patinetas Eléctricas?
            </h2>
            <p className="mt-4 text-lg text-primary-light">
              Únete a nuestro directorio y llega a miles de clientes potenciales en toda Colombia
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/agregar-negocio"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-50 transition-colors"
              >
                Agregar Mi Negocio
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-primary transition-colors"
              >
                Contactar Soporte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
