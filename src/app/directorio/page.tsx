'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SearchBar from '@/components/ui/SearchBar'
import BusinessCard from '@/components/ui/BusinessCard'
import Pagination from '@/components/ui/Pagination'
import ItemsPerPageSelector from '@/components/ui/ItemsPerPageSelector'
import PaginationInfo from '@/components/ui/PaginationInfo'
// import { BreadcrumbStructuredData } from '@/components/ui/Breadcrumb'

import { NegocioDirectorio } from '@/types'
import { negociosService } from '@/lib/supabase'

// Create a simple mock data for testing pagination
const mockBusinesses: NegocioDirectorio[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  nombre: `Business ${i + 1}`,
  descripcion: `Description for business ${i + 1}`,
  categoria: i % 2 === 0 ? 'Venta de Patinetas Eléctricas' : 'Reparación',
  telefono: `+57 300 000 00${i.toString().padStart(2, '0')}`,
  email: `business${i + 1}@example.com`,
  direccion: `Address ${i + 1}`,
  ciudad: i % 3 === 0 ? 'Bogotá' : i % 3 === 1 ? 'Medellín' : 'Cali',
  departamento: i % 3 === 0 ? 'Bogotá D.C.' : i % 3 === 1 ? 'Antioquia' : 'Valle del Cauca',
  sitio_web: `https://business${i + 1}.com`,
  whatsapp: `+57 300 000 00${i.toString().padStart(2, '0')}`,
  instagram: `https://instagram.com/business${i + 1}`,
  facebook: `https://facebook.com/business${i + 1}`,
  horario_atencion: undefined,
  servicios: [],
  imagen_url: undefined,
  activo: true,
  fecha_creacion: new Date().toISOString(),
  fecha_actualizacion: new Date().toISOString(),
  category_id: undefined,
  slug: undefined,
  ciudad_slug: undefined,
  youtube: '',
  tiktok: '',
  google_business_url: '',
  numero_resenhas: Math.floor(Math.random() * 50) + 1,
  valoracion: Math.round((Math.random() * 4 + 1) * 10) / 10,
  horarios_funcionamento: undefined,
  outras_especialidades: []
}))

interface DirectorioContentProps {
  initialPage?: number
}

function DirectorioContent({ initialPage = 1 }: DirectorioContentProps) {


  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle backward compatibility - redirect old query parameter URLs to SEO-friendly URLs
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam && !window.location.pathname.includes('/p/')) {
      const pageNumber = parseInt(pageParam, 10)
      if (pageNumber > 1) {
        // Redirect to SEO-friendly URL
        router.replace(`/directorio/p/${pageNumber}`)
        return
      } else if (pageNumber === 1) {
        // Redirect page=1 to clean URL
        router.replace('/directorio')
        return
      }
    }
  }, [searchParams, router])

  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>([])
  const [allBusinesses, setAllBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{nombre: string, icono: string}[]>([
    { nombre: 'Venta de Patinetas Eléctricas', icono: '🛒' },
    { nombre: 'Reparación', icono: '⚙️' }
  ])
  const [cities, setCities] = useState<string[]>(['Bogotá', 'Medellín', 'Cali'])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [sortBy, setSortBy] = useState<'nombre' | 'categoria' | 'ciudad'>('nombre')





  // Load real Supabase data
  useEffect(() => {
    let isMounted = true

    const loadAllData = async () => {
      try {
        setLoading(true)

        const data = await negociosService.getAll()

        if (!isMounted) return

        if (data && data.length > 0) {
          // Store all businesses for filtering
          setAllBusinesses(data)
          // Initially show all businesses
          setBusinesses(data)

          // Extract categories and cities from real data
          const uniqueCategories = [...new Set(data.map(b => b.categoria))]
            .map(cat => ({
              nombre: cat,
              icono: cat === 'Venta de Patinetas Eléctricas' ? '🛒' : '⚙️'
            }))

          const uniqueCities = [...new Set(data.map(b => b.ciudad))]

          setCategories(uniqueCategories)
          setCities(uniqueCities)
        }
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAllData()

    return () => {
      isMounted = false
    }
  }, [])

  // Pagination hook
  // Use initialPage directly instead of complex hook
  const currentPage = initialPage
  const itemsPerPage = 10

  // Simple URL generation function
  const generatePaginationUrl = (page: number) => {
    if (page <= 1) {
      return '/directorio'
    }
    return `/directorio/p/${page}`
  }





  // Data loading is now handled directly in component body above







  useEffect(() => {
    // Handle URL search parameters
    const categoria = searchParams.get('categoria')
    const ciudad = searchParams.get('ciudad')

    if (categoria) setSelectedCategory(categoria)
    if (ciudad) setSelectedCity(ciudad)
  }, [searchParams])

  // Filter businesses based on selected filters
  useEffect(() => {
    if (allBusinesses.length === 0) return

    let filteredBusinesses = allBusinesses

    if (selectedCategory) {
      filteredBusinesses = filteredBusinesses.filter(b => b.categoria === selectedCategory)
    }

    if (selectedCity) {
      filteredBusinesses = filteredBusinesses.filter(b => b.ciudad === selectedCity)
    }

    console.log('🔍 Filtering businesses:', {
      total: allBusinesses.length,
      filtered: filteredBusinesses.length,
      category: selectedCategory,
      city: selectedCity
    })

    setBusinesses(filteredBusinesses)
  }, [allBusinesses, selectedCategory, selectedCity])

  // Note: In this simplified approach, filters will reset to page 1 automatically
  // since we're using the initialPage prop directly

  // Sorted and paginated businesses
  const sortedBusinesses = useMemo(() => {
    return [...businesses].sort((a, b) => {
      switch (sortBy) {
        case 'categoria':
          return a.categoria.localeCompare(b.categoria)
        case 'ciudad':
          return a.ciudad.localeCompare(b.ciudad)
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })
  }, [businesses, sortBy])

  // Pagination calculations
  const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBusinesses = sortedBusinesses.slice(startIndex, endIndex)











  // Handle items per page changes (simplified - just reload page)
  const handleItemsPerPageChange = useCallback((items: number) => {
    // For now, just reload the page - in a full implementation this would update the URL
    window.location.reload()
  }, [])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedCity('')
    // For now, just reload the page - in a full implementation this would update the URL
    window.location.href = '/directorio'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el directorio</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  // Breadcrumb structured data
  const breadcrumbStructuredData = [
    { name: 'Inicio', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co' },
    { name: 'Directorio', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/directorio` }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Structured Data */}
      {/* <BreadcrumbStructuredData items={breadcrumbStructuredData} /> */}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-sm font-medium text-gray-400 hover:text-gray-500">
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">Directorio</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

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
          <div className="flex-1" id="business-results">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
                {!loading && sortedBusinesses.length > 0 && (
                  <PaginationInfo
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={sortedBusinesses.length}
                    className="mt-1"
                  />
                )}
              </div>

              {/* Items per page selector */}
              {!loading && sortedBusinesses.length > 10 && (
                <ItemsPerPageSelector
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="flex-shrink-0"
                />
              )}
            </div>

            {/* Business Grid */}
            <div id="business-results">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(itemsPerPage > 6 ? 6 : itemsPerPage)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedBusinesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <PaginationInfo
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      totalItems={sortedBusinesses.length}
                      className="order-2 sm:order-1"
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      generatePaginationUrl={generatePaginationUrl}
                      className="order-1 sm:order-2"
                    />
                  </div>
                )}
              </>
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
    </div>
  )
}

interface DirectorioPageProps {
  initialPage?: number
}

export default function DirectorioPage({ initialPage = 1 }: DirectorioPageProps = {}) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DirectorioContent initialPage={initialPage} />
    </Suspense>
  )
}
