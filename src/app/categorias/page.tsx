'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CategoryCard from '@/components/ui/CategoryCard'

import { generateSlug } from '@/lib/utils'
import { negociosService } from '@/lib/supabase'

interface CategoryWithCount {
  name: string
  description: string
  count: number
  slug: string
  featured: boolean
  icon?: string
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const [allBusinesses, availableCategories] = await Promise.all([
        negociosService.getAll(),
        negociosService.getCategories()
      ])

      // Count businesses per category
      const categoryCounts = availableCategories.reduce((acc, category) => {
        acc[category.nombre] = allBusinesses.filter(b => b.categoria === category.nombre).length
        return acc
      }, {} as Record<string, number>)

      // Create category data with descriptions
      const categoryDescriptions: Record<string, string> = {
        'Venta de Patinetas Eléctricas': 'Encuentra las mejores tiendas para comprar tu patineta eléctrica nueva con garantía y servicio postventa.',
        'Reparación y Mantenimiento': 'Servicios técnicos especializados para mantener tu patineta en perfecto estado y prolongar su vida útil.',
        'Repuestos y Accesorios': 'Todo lo que necesitas para personalizar, reparar y mejorar tu patineta eléctrica.',
        'Alquiler de Patinetas': 'Alquila patinetas eléctricas por horas, días o semanas para probar antes de comprar.',
        'Servicio Técnico Especializado': 'Técnicos certificados en reparación y mantenimiento de patinetas eléctricas de todas las marcas.',
        'Importadores y Distribuidores': 'Empresas que importan y distribuyen patinetas eléctricas al por mayor y menor.',
        'Tiendas Multimarca': 'Tiendas que ofrecen múltiples marcas y modelos de patinetas eléctricas.',
        'Servicio de Delivery': 'Servicios de entrega a domicilio usando patinetas eléctricas como medio de transporte.',
        'Escuelas de Conducción': 'Aprende a manejar tu patineta eléctrica de forma segura con instructores certificados.',
        'Seguros para Patinetas': 'Protege tu inversión con seguros especializados para patinetas eléctricas.'
      }

      const categoriesWithData = availableCategories.map(category => ({
        name: category.nombre,
        description: categoryDescriptions[category.nombre] || `Servicios relacionados con ${category.nombre.toLowerCase()}.`,
        count: categoryCounts[category.nombre] || 0,
        slug: generateSlug(category.nombre),
        featured: ['Venta de Patinetas Eléctricas', 'Reparación y Mantenimiento', 'Repuestos y Accesorios'].includes(category.nombre),
        icon: category.icono
      }))

      // Sort by count (descending) and then by name
      categoriesWithData.sort((a, b) => {
        if (a.count !== b.count) {
          return b.count - a.count
        }
        return a.name.localeCompare(b.name)
      })

      setCategories(categoriesWithData)
    } catch (err) {
      setError('Error al cargar las categorías. Por favor, intenta de nuevo.')
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar las categorías</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCategories}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Categorías de Negocios
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explora todas las categorías de negocios especializados en patinetas eléctricas. 
              Encuentra exactamente lo que necesitas para tu movilidad eléctrica.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <>
            {/* Featured Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Categorías Principales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.filter(cat => cat.featured).map((category) => (
                  <CategoryCard
                    key={category.slug}
                    name={category.name}
                    description={category.description}
                    count={category.count}
                    slug={category.slug}
                    featured={true}
                    icon={category.icon}
                  />
                ))}
              </div>
            </div>

            {/* All Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Todas las Categorías
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.slug}
                    name={category.name}
                    description={category.description}
                    count={category.count}
                    slug={category.slug}
                    featured={category.featured}
                    icon={category.icon}
                  />
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-primary-light mb-6 max-w-2xl mx-auto">
                Usa nuestra búsqueda avanzada para encontrar exactamente lo que necesitas 
                o explora todo nuestro directorio de negocios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/buscar"
                  className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Búsqueda Avanzada
                </Link>
                <Link
                  href="/directorio"
                  className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-medium"
                >
                  Ver Todo el Directorio
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              Aún no hay negocios registrados en el directorio.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
