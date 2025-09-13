'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { brandService, modelService, MarcaPatineta, ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug } from '@/lib/slugs'
import { BrandsStructuredData } from '@/components/seo/CatalogStructuredData'
import CatalogNavigation from '@/components/ui/CatalogNavigation'
import BrandCatalogClient from './[slug]/BrandCatalogClient'

interface BrandWithModelCount extends MarcaPatineta {
  modelCount: number
}

export default function BrandsDirectoryPage() {
  const searchParams = useSearchParams()
  const [brands, setBrands] = useState<BrandWithModelCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'models'>('name')
  const [filterByCountry, setFilterByCountry] = useState('')

  // Brand-specific state for fallback handling
  const [selectedBrand, setSelectedBrand] = useState<MarcaPatineta | null>(null)
  const [brandModels, setBrandModels] = useState<ModeloPatineta[]>([])
  const [brandLoading, setBrandLoading] = useState(false)

  // Check if we're viewing a specific brand via query params (fallback for dynamic routes)
  const brandId = searchParams.get('marca')
  const slug = searchParams.get('slug')
  const isViewingBrand = !!(brandId || slug)

  console.log('BrandsDirectoryPage loaded - checking for brand params:', { brandId, slug, isViewingBrand })

  useEffect(() => {
    if (isViewingBrand) {
      loadSpecificBrand()
    } else {
      loadBrands()
    }
  }, [brandId, slug, isViewingBrand])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const brandsData = await brandService.getAll(false) // Only active brands

      // Get model count for each brand
      const brandsWithCounts = await Promise.all(
        brandsData.map(async (brand) => {
          const modelCount = await brandService.getModelCount(brand.id)
          return { ...brand, modelCount }
        })
      )

      setBrands(brandsWithCounts)
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSpecificBrand = async () => {
    try {
      setBrandLoading(true)
      let targetBrand: MarcaPatineta | null = null

      if (slug) {
        // Try to find brand by slug
        console.log(`[FALLBACK] Loading brand by slug: ${slug}`)
        const brands = await brandService.getAll()
        targetBrand = brands.find(b => getBrandSlug(b.nombre) === slug) || null
      } else if (brandId) {
        // Try to find brand by ID
        console.log(`[FALLBACK] Loading brand by ID: ${brandId}`)
        targetBrand = await brandService.getById(brandId)
      }

      if (targetBrand) {
        setSelectedBrand(targetBrand)
        console.log(`[FALLBACK] Brand loaded: ${targetBrand.nombre}`)

        // Load models for this brand
        const allModels = await modelService.getAll()
        const brandModels = allModels.filter(model =>
          model.marca_id === targetBrand.id && model.activo
        )
        setBrandModels(brandModels)
        console.log(`[FALLBACK] Found ${brandModels.length} models for ${targetBrand.nombre}`)

        // Update URL to use slug format if we have a brand
        const brandSlug = getBrandSlug(targetBrand.nombre)
        if (typeof window !== 'undefined') {
          const expectedPath = `/catalogo/marcas/${brandSlug}`
          if (window.location.pathname !== expectedPath) {
            window.history.replaceState({}, '', expectedPath)
          }
        }
      }
    } catch (error) {
      console.error('[FALLBACK] Error loading brand data:', error)
    } finally {
      setBrandLoading(false)
    }
  }

  // Get unique countries for filter
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(brands.map(brand => brand.pais_origen).filter(Boolean))]
    return uniqueCountries.sort()
  }, [brands])

  // Filter and sort brands
  const filteredAndSortedBrands = useMemo(() => {
    const filtered = brands.filter(brand => {
      const matchesSearch = brand.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (brand.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesCountry = !filterByCountry || brand.pais_origen === filterByCountry
      return matchesSearch && matchesCountry
    })

    // Sort brands
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nombre.localeCompare(b.nombre)
        case 'country':
          return (a.pais_origen || '').localeCompare(b.pais_origen || '')
        case 'models':
          return b.modelCount - a.modelCount
        default:
          return 0
      }
    })

    return filtered
  }, [brands, searchQuery, sortBy, filterByCountry])

  // If viewing a specific brand, render the brand catalog
  if (isViewingBrand) {
    if (brandLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la marca...</p>
          </div>
        </div>
      )
    }

    if (!selectedBrand) {
      return (
        <div className="min-h-screen bg-gray-50">
          <CatalogNavigation />
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="mb-6">
                <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.87 0-5.43 1.51-6.84 3.891M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9-4.03-9-9-9z" />
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
        </div>
      )
    }

    return <BrandCatalogClient brand={selectedBrand} initialModels={brandModels} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Marcas de Patinetas Eléctricas en Colombia | Directorio Completo</title>
        <meta
          name="description"
          content="Descubre todas las marcas de patinetas eléctricas disponibles en Colombia. Encuentra Xiaomi, Segway, Razor y más marcas reconocidas con modelos y especificaciones completas."
        />
        <meta name="keywords" content="marcas patinetas eléctricas Colombia, Xiaomi, Segway, Razor, scooter eléctrico marcas" />
        <meta property="og:title" content="Marcas de Patinetas Eléctricas en Colombia" />
        <meta property="og:description" content="Directorio completo de marcas de patinetas eléctricas disponibles en Colombia con modelos y especificaciones." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://patinetas-electricas.vercel.app/catalogo/marcas" />
        <link rel="canonical" href="https://patinetas-electricas.vercel.app/catalogo/marcas" />
      </Head>

      <BrandsStructuredData brands={brands} />

      <div className="min-h-screen bg-gray-50">
        <CatalogNavigation />
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Marcas de Patinetas Eléctricas en Colombia
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Descubre todas las marcas disponibles en Colombia. Encuentra la patineta eléctrica perfecta 
                para tu estilo de vida y necesidades de movilidad.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar marcas
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Country Filter */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por país
                </label>
                <select
                  id="country"
                  value={filterByCountry}
                  onChange={(e) => setFilterByCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todos los países</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'country' | 'models')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name">Nombre A-Z</option>
                  <option value="country">País</option>
                  <option value="models">Número de modelos</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredAndSortedBrands.length} marca{filteredAndSortedBrands.length !== 1 ? 's' : ''} encontrada{filteredAndSortedBrands.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Brands Grid */}
          {filteredAndSortedBrands.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron marcas</h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda para encontrar más resultados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogo/marcas?slug=${getBrandSlug(brand.nombre)}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group-hover:scale-105">
                    {/* Brand Logo */}
                    <div className="aspect-square relative mb-4 bg-gray-50 rounded-lg overflow-hidden">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt={`Logo de ${brand.nombre}`}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-4xl text-gray-400">🛴</div>
                        </div>
                      )}
                    </div>

                    {/* Brand Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors mb-2">
                        {brand.nombre}
                      </h3>
                      
                      {brand.pais_origen && (
                        <p className="text-sm text-gray-500 mb-2">
                          📍 {brand.pais_origen}
                        </p>
                      )}

                      <p className="text-sm text-primary font-medium mb-3">
                        {brand.modelCount} modelo{brand.modelCount !== 1 ? 's' : ''} disponible{brand.modelCount !== 1 ? 's' : ''}
                      </p>

                      {brand.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {brand.descripcion}
                        </p>
                      )}
                    </div>

                    {/* View Models Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary-dark">
                          Ver Modelos
                          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
