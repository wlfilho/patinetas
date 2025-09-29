'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CategoriaPatineta, NegocioDirectorio, negociosService } from '@/lib/supabase'
import BusinessCard from '@/components/ui/BusinessCard'

interface DirectorioCategoryClientProps {
  category: CategoriaPatineta
  initialBusinesses: NegocioDirectorio[]
  categorySlug: string
}

export default function DirectorioCategoryClient({ 
  category, 
  initialBusinesses, 
  categorySlug 
}: DirectorioCategoryClientProps) {
  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>(initialBusinesses)
  const [loading, setLoading] = useState(false)
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
            <div className="mt-6">
              <Link
                href="/directorio"
                className="text-primary hover:text-primary-dark font-medium"
              >
                ← Volver al directorio completo
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
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
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
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/directorio/${categorySlug}`,
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
