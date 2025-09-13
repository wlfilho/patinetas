'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBar from '@/components/ui/SearchBar'
import BusinessCard from '@/components/ui/BusinessCard'
import { NegocioDirectorio } from '@/types'
import { negociosService } from '@/lib/supabase'

function DirectorioContent() {
  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{nombre: string, icono: string}[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [sortBy, setSortBy] = useState<'nombre' | 'categoria' | 'ciudad'>('nombre')

  const searchParams = useSearchParams()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [businessesData, categoriesData, citiesData] = await Promise.all([
        negociosService.getAll(),
        negociosService.getCategories(),
        negociosService.getCities()
      ])

      setBusinesses(businessesData)
      setCategories(categoriesData)
      setCities(citiesData)
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intenta de nuevo.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadBusinesses = useCallback(async () => {
    try {
      setLoading(true)
      let businessesData: NegocioDirectorio[]

      if (selectedCategory && selectedCity) {
        // Filter by both category and city (we'll need to implement this)
        const allBusinesses = await negociosService.getAll()
        businessesData = allBusinesses.filter(b =>
          b.categoria === selectedCategory && b.ciudad === selectedCity
        )
      } else if (selectedCategory) {
        businessesData = await negociosService.getByCategory(selectedCategory)
      } else if (selectedCity) {
        businessesData = await negociosService.getByCity(selectedCity)
      } else {
        businessesData = await negociosService.getAll()
      }

      setBusinesses(businessesData)
    } catch (err) {
      setError('Error al cargar los negocios. Por favor, intenta de nuevo.')
      console.error('Error loading businesses:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedCity])

  useEffect(() => {
    // Handle URL search parameters
    const categoria = searchParams.get('categoria')
    const ciudad = searchParams.get('ciudad')

    if (categoria) setSelectedCategory(categoria)
    if (ciudad) setSelectedCity(ciudad)
  }, [searchParams])

  useEffect(() => {
    if (selectedCategory || selectedCity) {
      loadBusinesses()
    }
  }, [selectedCategory, selectedCity, loadBusinesses])

  const sortedBusinesses = [...businesses].sort((a, b) => {
    switch (sortBy) {
      case 'categoria':
        return a.categoria.localeCompare(b.categoria)
      case 'ciudad':
        return a.ciudad.localeCompare(b.ciudad)
      default:
        return a.nombre.localeCompare(b.nombre)
    }
  })

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedCity('')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el directorio</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadInitialData}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Directorio de Patinetas Eléctricas
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Encuentra los mejores negocios de patinetas eléctricas en Colombia
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar showFilters={true} />
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.nombre} value={category.nombre}>
                      {category.icono} {category.nombre}
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Sort By */}
              <div className="mb-6">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'nombre' | 'categoria' | 'ciudad')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="nombre">Nombre</option>
                  <option value="categoria">Categoría</option>
                  <option value="ciudad">Ciudad</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedCity) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? 'Cargando...' : `${sortedBusinesses.length} negocios encontrados`}
                </h2>
                {(selectedCategory || selectedCity) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedCategory && `Categoría: ${selectedCategory}`}
                    {selectedCategory && selectedCity && ' • '}
                    {selectedCity && `Ciudad: ${selectedCity}`}
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
            ) : sortedBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron negocios
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar los filtros o realizar una nueva búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Ver todos los negocios
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DirectorioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando directorio...</p>
        </div>
      </div>
    }>
      <DirectorioContent />
    </Suspense>
  )
}
