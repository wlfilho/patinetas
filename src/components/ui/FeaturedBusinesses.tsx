'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BusinessCard from '@/components/ui/BusinessCard'
import { NegocioDirectorio } from '@/types'
import { negociosService } from '@/lib/supabase'

interface FeaturedBusinessesProps {
  limit?: number
  className?: string
}

export default function FeaturedBusinesses({ limit = 8, className = '' }: FeaturedBusinessesProps) {
  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      try {
        setLoading(true)
        setError(null)
        const featuredBusinesses = await negociosService.getFeatured(limit)
        setBusinesses(featuredBusinesses)
      } catch (err) {
        console.error('Error fetching featured businesses:', err)
        setError('Error al cargar los negocios destacados')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedBusinesses()
  }, [limit])

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium">{error}</p>
        </div>
        <Link
          href="/directorio"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          Ver Directorio Completo
        </Link>
      </div>
    )
  }

  return (
    <section className={`py-16 sm:py-24 bg-gray-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Negocios Destacados
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Descubre los mejores negocios de patinetas eléctricas recomendados por nuestra comunidad
          </p>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit > 8 ? 8 : limit)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length > 0 ? (
          <>
            {/* Business Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  featured={true}
                  location="home_featured"
                />
              ))}
            </div>

            {/* View More Button */}
            <div className="mt-12 text-center">
              <Link
                href="/directorio"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
              >
                Ver Más Negocios
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          // Empty state
          <div className="mt-12 text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No hay negocios destacados disponibles</p>
              <p className="text-gray-600">Explora nuestro directorio completo para encontrar negocios de patinetas eléctricas</p>
            </div>
            <Link
              href="/directorio"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              Ver Directorio Completo
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
