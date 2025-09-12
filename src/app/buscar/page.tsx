'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SearchBar from '@/components/ui/SearchBar'
import BusinessCard from '@/components/ui/BusinessCard'
import { NegocioDirectorio } from '@/types'
import { negociosService } from '@/lib/supabase'

function BuscarContent() {
  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [hasSearched, setHasSearched] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get('q')
    const categoria = searchParams.get('categoria')
    const ciudad = searchParams.get('ciudad')

    if (query || categoria || ciudad) {
      performSearch(query, categoria, ciudad)
    }
  }, [searchParams])

  const performSearch = async (query?: string | null, categoria?: string | null, ciudad?: string | null) => {
    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      let results: NegocioDirectorio[] = []

      if (query) {
        // Text search
        results = await negociosService.search(query)
      } else {
        // Filter-based search
        results = await negociosService.getAll()
      }

      // Apply additional filters
      if (categoria) {
        results = results.filter(business => business.categoria === categoria)
      }

      if (ciudad) {
        results = results.filter(business => business.ciudad === ciudad)
      }

      setBusinesses(results)
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor, intenta de nuevo.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSearchSummary = () => {
    const query = searchParams.get('q')
    const categoria = searchParams.get('categoria')
    const ciudad = searchParams.get('ciudad')

    const parts = []
    if (query) parts.push(`"${query}"`)
    if (categoria) parts.push(`categoría: ${categoria}`)
    if (ciudad) parts.push(`ciudad: ${ciudad}`)

    return parts.join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Buscar Negocios
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Encuentra exactamente lo que necesitas para tu patineta eléctrica
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar showFilters={true} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasSearched && (
          <>
            {/* Search Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {loading ? 'Buscando...' : `${businesses.length} resultados encontrados`}
                  </h2>
                  {getSearchSummary() && (
                    <p className="text-sm text-gray-600 mt-1">
                      Búsqueda: {getSearchSummary()}
                    </p>
                  )}
                </div>
                
                <Link
                  href="/directorio"
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  Ver todo el directorio →
                </Link>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-center">
                  <div className="text-red-500 text-2xl mr-3">⚠️</div>
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Error en la búsqueda</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
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
            )}

            {/* Results Grid */}
            {!loading && !error && businesses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && businesses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-6">
                  No encontramos negocios que coincidan con tu búsqueda.
                  <br />
                  Intenta con términos diferentes o explora nuestras categorías.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/directorio"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Ver todo el directorio
                  </Link>
                  <Link
                    href="/categorias"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Explorar categorías
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Initial State - No Search Yet */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Realiza una búsqueda
            </h3>
            <p className="text-gray-600 mb-6">
              Usa la barra de búsqueda para encontrar negocios de patinetas eléctricas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/directorio"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Ver todo el directorio
              </Link>
              <Link
                href="/categorias"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Explorar categorías
              </Link>
            </div>
          </div>
        )}

        {/* Search Suggestions */}
        {!hasSearched && (
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Búsquedas populares
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'patinetas eléctricas',
                'reparación',
                'repuestos',
                'alquiler',
                'servicio técnico',
                'baterías',
                'llantas',
                'cargadores'
              ].map((term) => (
                <Link
                  key={term}
                  href={`/buscar?q=${encodeURIComponent(term)}`}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando búsqueda...</p>
        </div>
      </div>
    }>
      <BuscarContent />
    </Suspense>
  )
}
