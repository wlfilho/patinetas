'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { brandService, MarcaPatineta } from '@/lib/supabase'
import { BrandsStructuredData } from '@/components/seo/CatalogStructuredData'
import CatalogNavigation from '@/components/ui/CatalogNavigation'

interface BrandWithModelCount extends MarcaPatineta {
  modelCount: number
}

export default function BrandsDirectoryPage() {
  const [brands, setBrands] = useState<BrandWithModelCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'models'>('name')
  const [filterByCountry, setFilterByCountry] = useState('')

  // Force route precedence - this should be the brands page, not dynamic [id]
  console.log('BrandsDirectoryPage loaded - this is /catalogo/marcas')

  // Debug: Log to confirm this is the correct component
  console.log('Route params should be empty for static route:', window?.location?.pathname)

  useEffect(() => {
    loadBrands()
  }, [])

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
                  href={`/catalogo/marcas/${brand.slug}`}
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
