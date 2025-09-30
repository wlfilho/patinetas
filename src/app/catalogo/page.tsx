'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { brandService, modelService, MarcaPatineta, ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug, generateUniqueModelSlug } from '@/lib/slugs'
import { CatalogStructuredData } from '@/components/seo/CatalogStructuredData'
import CatalogNavigation from '@/components/ui/CatalogNavigation'
import AdvancedFilters, { AdvancedFilterOptions, createEmptyFilters } from '@/components/catalog/AdvancedFilters'
import { applyAdvancedFilters, countActiveFilters, getFilterSummary } from '@/lib/filterUtils'
import Link from 'next/link'

function CatalogoPageContent() {
  const searchParams = useSearchParams()
  const [brands, setBrands] = useState<MarcaPatineta[]>([])
  const [models, setModels] = useState<ModeloPatineta[]>([])
  const [filteredModels, setFilteredModels] = useState<ModeloPatineta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterOptions>(createEmptyFilters())

  // Handle URL parameters for backward compatibility
  useEffect(() => {
    const marcaParam = searchParams.get('marca')
    if (marcaParam && marcaParam !== selectedBrand) {
      setSelectedBrand(marcaParam)
    }
  }, [searchParams, selectedBrand])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [models, searchQuery, selectedBrand, advancedFilters])

  const loadData = async () => {
    try {
      setLoading(true)
      const [brandsData, modelsData] = await Promise.all([
        brandService.getAll(),
        modelService.getAll()
      ])
      setBrands(brandsData)
      setModels(modelsData)
    } catch (error) {
      console.error('Error loading catalog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = models

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(model =>
        model.nombre.toLowerCase().includes(query) ||
        model.descripcion?.toLowerCase().includes(query) ||
        model.marca?.nombre.toLowerCase().includes(query)
      )
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(model => model.marca_id === selectedBrand)
    }

    // Apply advanced filters
    filtered = applyAdvancedFilters(filtered, advancedFilters)

    setFilteredModels(filtered)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedBrand('')
    setAdvancedFilters(createEmptyFilters())
  }

  const activeFilterCount = countActiveFilters(advancedFilters)
  const filterSummary = getFilterSummary(advancedFilters)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <CatalogStructuredData models={filteredModels} />
      <div className="min-h-screen bg-gray-50">
        <CatalogNavigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Catálogo de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Patinetas Eléctricas
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Descubre las mejores marcas y modelos de patinetas eléctricas disponibles en Colombia. 
              Compara especificaciones, precios y encuentra la patineta perfecta para ti.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-500"
                  placeholder="Buscar por marca, modelo o características..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Todas las marcas</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                  showFilters
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>🔍</span>
                  Filtros Avanzados
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
              </button>

              {(searchQuery || selectedBrand || activeFilterCount > 0) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors"
                >
                  Limpiar Todo
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6">
              <AdvancedFilters
                filters={advancedFilters}
                onChange={setAdvancedFilters}
                onClear={() => setAdvancedFilters(createEmptyFilters())}
                models={models}
              />
            </div>
          )}
        </div>
      </section>

      {/* Active Filters Summary */}
      {(activeFilterCount > 0 || searchQuery || selectedBrand) && (
        <section className="py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Filtros activos:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                  <span>🔍</span>
                  <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                  <span>🏷️</span>
                  <span className="font-medium">{brands.find(b => b.id === selectedBrand)?.nombre}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('')}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {filterSummary.map((summary, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                  {summary}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Summary */}
      <section className="py-6 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredModels.length}</span> de {models.length} modelos
              {activeFilterCount > 0 && (
                <span className="ml-2 text-sm text-primary">
                  ({activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} activo{activeFilterCount !== 1 ? 's' : ''})
                </span>
              )}
            </p>
            <div className="text-sm text-gray-500">
              {brands.length} marcas disponibles
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {filteredModels.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron modelos</h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
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
                      <Image
                        src={model.imagen_url}
                        alt={`${model.marca?.nombre} ${model.nombre}`}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-6xl text-gray-400">🛴</div>
                      </div>
                    )}
                  </div>

                  {/* Model Info */}
                  <div className="p-6">
                    {/* Brand and Model Name */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-primary mb-1">{model.marca?.nombre}</p>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {model.nombre}
                      </h3>
                    </div>

                    {/* Description */}
                    {model.descripcion && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {model.descripcion}
                      </p>
                    )}

                    {/* Key Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      {model.velocidad_maxima && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-1">⚡</span>
                          <span>{model.velocidad_maxima} km/h</span>
                        </div>
                      )}
                      {model.autonomia && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-1">🔋</span>
                          <span>{model.autonomia} km</span>
                        </div>
                      )}
                      {model.peso && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-1">⚖️</span>
                          <span>{model.peso} kg</span>
                        </div>
                      )}
                      {model.potencia && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-1">🔧</span>
                          <span>{model.potencia}W</span>
                        </div>
                      )}
                    </div>

                    {/* Price Range */}
                    {(model.precio_min || model.precio_max) && (
                      <div className="mb-4">
                        <p className="text-lg font-bold text-gray-900">
                          {model.precio_min && model.precio_max ? (
                            model.precio_min === model.precio_max ? (
                              formatPrice(model.precio_min)
                            ) : (
                              `${formatPrice(model.precio_min)} - ${formatPrice(model.precio_max)}`
                            )
                          ) : model.precio_min ? (
                            `Desde ${formatPrice(model.precio_min)}`
                          ) : (
                            `Hasta ${formatPrice(model.precio_max!)}`
                          )}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      href={model.marca ? `/catalogo/marcas/${getBrandSlug(model.marca.nombre)}/${generateUniqueModelSlug(model.nombre, model.marca.nombre, filteredModels)}` : `/modelo/${model.id}`}
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

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Marcas Destacadas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Las mejores marcas de patinetas eléctricas disponibles en Colombia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                  selectedBrand === brand.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                }`}
              >
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.nombre}
                    width={64}
                    height={64}
                    className="w-16 h-16 mx-auto mb-3 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {brand.nombre.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">{brand.nombre}</h3>
                {brand.pais_origen && (
                  <p className="text-sm text-gray-500 mt-1">{brand.pais_origen}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div>Cargando catálogo...</div>}>
      <CatalogoPageContent />
    </Suspense>
  )
}
