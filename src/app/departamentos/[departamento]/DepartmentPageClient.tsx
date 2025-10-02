'use client'

import Link from 'next/link'
import { NegocioDirectorio } from '@/types'
import BusinessCard from '@/components/ui/BusinessCard'
import CityCard from '@/components/ui/CityCard'
import LazyDepartmentMapNavigation from '@/components/ui/LazyDepartmentMapNavigation'
import { getCitySlug } from '@/lib/slugs'

interface DepartmentPageClientProps {
  departmentName: string
  businesses: NegocioDirectorio[]
  businessesByCity: Record<string, NegocioDirectorio[]>
  cities: string[]
  topCities: string[]
}

export default function DepartmentPageClient({
  departmentName,
  businesses,
  businessesByCity,
  cities,
  topCities,
}: DepartmentPageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-white to-purple-50 border-b border-gray-200 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl mb-6">
              <span className="text-4xl sm:text-5xl">🏛️</span>
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Negocios de Patinetas Eléctricas en {departmentName}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Su Guía Completa de negocios especializados en Patinetas Eléctricas. Encuentre las mejores empresas, tiendas, talleres y asistencias técnicas en {departmentName}
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {/* Total Businesses */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {businesses.length}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base text-gray-600 font-medium">
                  <span className="text-xl sm:text-2xl">🏢</span>
                  <span>{businesses.length === 1 ? 'Negocio' : 'Negocios'}</span>
                </div>
              </div>

              {/* Total Cities */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {cities.length}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base text-gray-600 font-medium">
                  <span className="text-xl sm:text-2xl">🏙️</span>
                  <span>{cities.length === 1 ? 'Ciudad' : 'Ciudades'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* SEO Optimized Introductory Section */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Directorio de Patinetas Eléctricas en {departmentName}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Bienvenido al directorio de patinetas eléctricas en <strong>{departmentName}</strong>.
            {topCities.length > 0 && (
              <>
                {' '}Encuentre las mejores tiendas, talleres y servicios técnicos en{' '}
                {topCities.map((city, index) => (
                  <span key={city}>
                    <strong>{city}</strong>
                    {index < topCities.length - 2 && ', '}
                    {index === topCities.length - 2 && ' y '}
                  </span>
                ))}
                {cities.length > 3 && ` y otras ciudades`}
                .{' '}
              </>
            )}
            Nuestro directorio incluye <strong>{businesses.length} {businesses.length === 1 ? 'negocio verificado' : 'negocios verificados'}</strong> que ofrecen venta, reparación, mantenimiento y accesorios para patinetas eléctricas.
          </p>
        </div>

        {/* Cities Grid - Hidden for Bogotá D.C. since it only has one city */}
        {departmentName !== 'Bogotá D.C.' && (
          <div className="mb-12 sm:mb-16">
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Ciudades en {departmentName}
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Seleccione su ciudad para ver los negocios disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {cities.map(city => (
                <CityCard
                  key={city}
                  city={city}
                  businessCount={businessesByCity[city].length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Map and Quick Navigation - Lazy Loaded */}
        <LazyDepartmentMapNavigation
          businesses={businesses}
          businessesByCity={businessesByCity}
          departmentName={departmentName}
          departmentSlug={getCitySlug(departmentName)}
        />

        {/* All Businesses Title */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            🏢 {businesses.length === 1 ? 'Todo el' : 'Todos los'} {businesses.length} {businesses.length === 1 ? 'negocio' : 'negocios'} de patinetas eléctricas en {departmentName}
          </h2>
        </div>

        {/* Businesses by City */}
        <div className="space-y-12 sm:space-y-16">
          {cities.map(city => {
            const citySlug = getCitySlug(city)
            return (
              <section key={city} id={`ciudad-${citySlug}`} className="scroll-mt-20">
                {/* City Header */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl font-bold text-2xl sm:text-3xl shadow-md">
                      🏙️
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {city}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        {businessesByCity[city].length} {businessesByCity[city].length === 1 ? 'negocio' : 'negocios'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businessesByCity[city].map(business => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Back to Departments Link */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/departamentos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ver todos los departamentos
          </Link>
        </div>
      </div>
    </>
  )
}

