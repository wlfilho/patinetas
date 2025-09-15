'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MarcaPatineta, ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug, generateUniqueModelSlug } from '@/lib/slugs'

import CatalogNavigation from '@/components/ui/CatalogNavigation'
import { BrandCatalogStructuredData } from '@/components/seo/BrandCatalogStructuredData'

interface BrandCatalogClientProps {
  brand: MarcaPatineta | null
  initialModels: ModeloPatineta[]
  slug?: string // For client-side fallback
}

interface CatalogFilters {
  priceMin: string
  priceMax: string
  speedMin: string
  speedMax: string
  rangeMin: string
  rangeMax: string
}

function BrandCatalogClientInner({ brand, initialModels, slug }: BrandCatalogClientProps) {
  const searchParams = useSearchParams()
  const querySlug = searchParams.get('slug')

  // Use query parameter slug if available, otherwise use prop slug
  // Filter out invalid slugs like '[slug]' which might come from URL encoding issues
  const cleanSlug = slug && slug !== '[slug]' && !slug.includes('%5B') && !slug.includes('[') ? slug : null
  const effectiveSlug = querySlug || cleanSlug

  console.log(`[CLIENT] BrandCatalogClientInner props:`, { brand: brand?.nombre, slug, cleanSlug, querySlug, effectiveSlug })

  // Force use of query parameter if we detect routing issues
  const urlSlug = typeof window !== 'undefined' ?
    window.location.pathname.split('/').pop() : null

  const finalSlug = querySlug ||
    (typeof window !== 'undefined' && window.location.search.includes('slug=') ?
      new URLSearchParams(window.location.search).get('slug') : null) ||
    (urlSlug && urlSlug !== '[slug]' && !urlSlug.includes('%5B') ? urlSlug : null) ||
    cleanSlug

  console.log(`[CLIENT] Final slug to use:`, finalSlug, { querySlug, urlSlug, cleanSlug })
  const [models, setModels] = useState<ModeloPatineta[]>(initialModels)
  const [filteredModels, setFilteredModels] = useState<ModeloPatineta[]>(initialModels)
  const [currentBrand, setCurrentBrand] = useState<MarcaPatineta | null>(brand)
  const [loading, setLoading] = useState(!brand && !!finalSlug)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'speed' | 'range'>('name')
  const [filters, setFilters] = useState<CatalogFilters>({
    priceMin: '',
    priceMax: '',
    speedMin: '',
    speedMax: '',
    rangeMin: '',
    rangeMax: ''
  })

  // Client-side data fetching fallback
  useEffect(() => {
    if (!currentBrand && finalSlug && loading) {
      console.log(`[CLIENT] Fetching brand data for slug: ${finalSlug}`)
      fetch(`/api/brands/${finalSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.brand && data.models) {
            console.log(`[CLIENT] Successfully fetched brand: ${data.brand.nombre}`)
            setCurrentBrand(data.brand)
            setModels(data.models)
            setFilteredModels(data.models)

            // Update URL to clean format if we used query parameter
            if (querySlug && typeof window !== 'undefined') {
              const newUrl = `/catalogo/marcas/${finalSlug}`
              window.history.replaceState({}, '', newUrl)
              console.log(`[CLIENT] Updated URL to: ${newUrl}`)
            }
          } else {
            console.log(`[CLIENT] Brand not found for slug: ${finalSlug}`)
          }
        })
        .catch(error => {
          console.error(`[CLIENT] Error fetching brand data:`, error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [currentBrand, finalSlug, loading, querySlug])

  // Apply filters and search
  useEffect(() => {
    const filtered = models.filter(model => {
      // Search filter
      const matchesSearch = !searchQuery || 
        model.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (model.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      // Price filter
      const matchesPrice = (!filters.priceMin || (model.precio_min && model.precio_min >= parseInt(filters.priceMin))) &&
                          (!filters.priceMax || (model.precio_max && model.precio_max <= parseInt(filters.priceMax)))

      // Speed filter
      const matchesSpeed = (!filters.speedMin || (model.velocidad_maxima && model.velocidad_maxima >= parseInt(filters.speedMin))) &&
                          (!filters.speedMax || (model.velocidad_maxima && model.velocidad_maxima <= parseInt(filters.speedMax)))

      // Range filter
      const matchesRange = (!filters.rangeMin || (model.autonomia && model.autonomia >= parseInt(filters.rangeMin))) &&
                          (!filters.rangeMax || (model.autonomia && model.autonomia <= parseInt(filters.rangeMax)))

      return matchesSearch && matchesPrice && matchesSpeed && matchesRange
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nombre.localeCompare(b.nombre)
        case 'price':
          return (a.precio_min || 0) - (b.precio_min || 0)
        case 'speed':
          return (b.velocidad_maxima || 0) - (a.velocidad_maxima || 0)
        case 'range':
          return (b.autonomia || 0) - (a.autonomia || 0)
        default:
          return 0
      }
    })

    setFilteredModels(filtered)
  }, [models, searchQuery, filters, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      priceMin: '',
      priceMax: '',
      speedMin: '',
      speedMax: '',
      rangeMin: '',
      rangeMax: ''
    })
  }



  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la marca...</p>
        </div>
      </div>
    )
  }

  // Error state - brand not found
  if (!currentBrand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.87 0-5.43 1.51-6.84 3.891M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Marca no encontrada</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, no pudimos encontrar información sobre esta marca de patinetas eléctricas.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Ver todas las marcas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <BrandCatalogStructuredData brand={currentBrand} models={filteredModels} />
      <div className="min-h-screen bg-gray-50">
        <CatalogNavigation />
        
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    Inicio
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href="/catalogo" className="ml-4 text-gray-400 hover:text-gray-500">
                      Catálogo
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-gray-500">{currentBrand.nombre}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Brand Header */}
        <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center mb-6">
                {currentBrand.logo_url ? (
                  <img
                    src={currentBrand.logo_url}
                    alt={`Logo de ${currentBrand.nombre}`}
                    className="h-20 w-auto object-contain"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {currentBrand.nombre.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Patinetas Eléctricas{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {currentBrand.nombre}
                </span>
              </h1>

              {currentBrand.descripcion && (
                <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                  {currentBrand.descripcion}
                </p>
              )}
              
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <span>{models.length} modelo{models.length !== 1 ? 's' : ''} disponible{models.length !== 1 ? 's' : ''}</span>
                {currentBrand.pais_origen && (
                  <>
                    <span>•</span>
                    <span>Origen: {currentBrand.pais_origen}</span>
                  </>
                )}
                {currentBrand.sitio_web && (
                  <>
                    <span>•</span>
                    <a
                      href={currentBrand.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      Sitio web oficial
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={`Buscar modelos de ${currentBrand.nombre}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Sort and Filter Controls */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'speed' | 'range')}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="name">Ordenar por nombre</option>
                  <option value="price">Ordenar por precio</option>
                  <option value="speed">Ordenar por velocidad</option>
                  <option value="range">Ordenar por autonomía</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  Filtros {showFilters ? '▲' : '▼'}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio mínimo (COP)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.priceMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo (COP)</label>
                    <input
                      type="number"
                      placeholder="10000000"
                      value={filters.priceMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Velocidad mín. (km/h)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.speedMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, speedMin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Autonomía mín. (km)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.rangeMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, rangeMin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredModels.length} modelo{filteredModels.length !== 1 ? 's' : ''} encontrado{filteredModels.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {filteredModels.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron modelos</h3>
                <p className="text-gray-600 mb-4">
                  No hay modelos de {currentBrand.nombre} que coincidan con tus criterios de búsqueda.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Model Image */}
                    <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                      {model.imagen_url ? (
                        <img
                          src={model.imagen_url}
                          alt={`${currentBrand.nombre} ${model.nombre}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-4xl text-gray-400">🛴</span>
                        </div>
                      )}
                    </div>

                    {/* Model Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {model.nombre}
                      </h3>
                      
                      {model.descripcion && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {model.descripcion}
                        </p>
                      )}

                      {/* Specs */}
                      <div className="space-y-2 mb-4">
                        {model.velocidad_maxima && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Velocidad:</span>
                            <span className="font-medium">{model.velocidad_maxima} km/h</span>
                          </div>
                        )}
                        {model.autonomia && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Autonomía:</span>
                            <span className="font-medium">{model.autonomia} km</span>
                          </div>
                        )}
                        {model.peso && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Peso:</span>
                            <span className="font-medium">{model.peso} kg</span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      {(model.precio_min || model.precio_max) && (
                        <div className="mb-4">
                          <span className="text-lg font-bold text-primary">
                            {model.precio_min && model.precio_max && model.precio_min !== model.precio_max
                              ? `$${model.precio_min.toLocaleString()} - $${model.precio_max.toLocaleString()}`
                              : model.precio_min
                              ? `Desde $${model.precio_min.toLocaleString()}`
                              : `Hasta $${model.precio_max?.toLocaleString()}`
                            }
                          </span>
                        </div>
                      )}

                      {/* Action Button */}
                      <Link
                        href={`/catalogo/marcas/${getBrandSlug(currentBrand.nombre)}/${generateUniqueModelSlug(model.nombre, currentBrand.nombre, filteredModels)}`}
                        className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default function BrandCatalogClient(props: BrandCatalogClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo de marca...</p>
        </div>
      </div>
    }>
      <BrandCatalogClientInner {...props} />
    </Suspense>
  )
}
