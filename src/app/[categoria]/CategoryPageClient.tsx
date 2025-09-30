'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoriaPatineta, NegocioDirectorio } from '@/lib/supabase'
import BusinessCard from '@/components/ui/BusinessCard'
import { getCitySlug } from '@/lib/slugs'

interface CategoryPageClientProps {
  category: CategoriaPatineta
  initialBusinesses: NegocioDirectorio[]
  categorySlug: string
}

export default function CategoryPageClient({ 
  category, 
  initialBusinesses, 
  categorySlug 
}: CategoryPageClientProps) {
  const [businesses] = useState<NegocioDirectorio[]>(initialBusinesses)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [sortBy, setSortBy] = useState<'nombre' | 'ciudad'>('nombre')

  // Get unique cities from businesses
  const cities = Array.from(new Set(businesses.map(b => b.ciudad))).sort()

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter(business => !selectedCity || business.ciudad === selectedCity)
    .sort((a, b) => {
      switch (sortBy) {
        case 'ciudad':
          return a.ciudad.localeCompare(b.ciudad)
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

  const clearFilters = () => {
    setSelectedCity('')
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl">{category.icono}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {category.nombre}
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {category.descripcion || `Encuentra los mejores negocios de ${category.nombre.toLowerCase()} en Colombia.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link
                href="/categorias"
                className="text-primary hover:text-primary-dark font-medium"
              >
                ← Ver todas las categorías
              </Link>
              <Link
                href="/directorio"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Ver directorio completo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* City Filter */}
              <div className="mb-6">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Todas las ciudades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick City Links */}
              {cities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Acceso rápido por ciudad</h4>
                  <div className="space-y-2">
                    {cities.slice(0, 5).map((city) => {
                      const citySlug = getCitySlug(city)
                      const businessCount = businesses.filter(b => b.ciudad === city).length
                      return (
                        <Link
                          key={city}
                          href={`/${categorySlug}/${citySlug}`}
                          className="block text-sm text-primary hover:text-primary-dark hover:underline"
                        >
                          {city} ({businessCount})
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Sort */}
              <div className="mb-6">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'nombre' | 'ciudad')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="nombre">Nombre</option>
                  <option value="ciudad">Ciudad</option>
                </select>
              </div>

              {/* Clear Filters */}
              {selectedCity && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? 's' : ''} encontrado{filteredBusinesses.length !== 1 ? 's' : ''}
                  {selectedCity && ` en ${selectedCity}`}
                </h2>
                {selectedCity && (
                  <p className="text-sm text-gray-600 mt-1">
                    Filtrando por ciudad: <span className="font-medium">{selectedCity}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Business Grid */}
            {filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} location="category_page" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron negocios
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedCity 
                    ? `No hay negocios de ${category.nombre.toLowerCase()} en ${selectedCity}.`
                    : `No hay negocios registrados en la categoría ${category.nombre.toLowerCase()}.`
                  }
                </p>
                {selectedCity && (
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Ver todos los negocios de esta categoría
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category.nombre} en Colombia`,
            "description": category.descripcion || `Directorio de ${category.nombre.toLowerCase()} en Colombia`,
            "url": `${baseUrl}/${categorySlug}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredBusinesses.length,
              "itemListElement": filteredBusinesses.map((business, index) => ({
                "@type": "LocalBusiness",
                "position": index + 1,
                "name": business.nombre,
                "description": business.descripcion,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": business.ciudad,
                  "addressRegion": business.departamento,
                  "addressCountry": "CO"
                }
              }))
            }
          })
        }}
      />
    </>
  )
}

