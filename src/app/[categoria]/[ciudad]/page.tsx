import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { categoryService, negociosService } from '@/lib/supabase'
import { getCategorySlug, getCitySlug } from '@/lib/slugs'
import BusinessCard from '@/components/ui/BusinessCard'

interface CategoryCityPageProps {
  params: Promise<{ categoria: string; ciudad: string }>
}

export async function generateMetadata({ params }: CategoryCityPageProps): Promise<Metadata> {
  const { categoria, ciudad } = await params
  
  try {
    const category = await categoryService.getBySlug(categoria)
    
    if (!category) {
      return {
        title: 'Categoría no encontrada',
        description: 'La categoría que buscas no existe o ha sido eliminada.'
      }
    }

    // Get all businesses to find the city name
    const allBusinesses = await negociosService.getAll()
    const cityBusiness = allBusinesses.find(b => getCitySlug(b.ciudad) === ciudad)
    const cityName = cityBusiness?.ciudad || ciudad

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

    return {
      title: `${category.nombre} en ${cityName} | Patinetas Eléctricas Colombia`,
      description: `Encuentra los mejores negocios de ${category.nombre.toLowerCase()} en ${cityName}, Colombia. Directorio completo con información verificada, ubicaciones y contactos.`,
      keywords: `${category.nombre.toLowerCase()}, ${cityName}, patinetas eléctricas, Colombia, directorio`,
      openGraph: {
        title: `${category.nombre} en ${cityName}`,
        description: `Directorio de ${category.nombre.toLowerCase()} en ${cityName}, Colombia`,
        url: `${baseUrl}/${categoria}/${ciudad}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.nombre} en ${cityName}`,
        description: `Directorio de ${category.nombre.toLowerCase()} en ${cityName}, Colombia`,
      },
      alternates: {
        canonical: `${baseUrl}/${categoria}/${ciudad}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata for category-city page:', error)
    return {
      title: 'Error - Patinetas Eléctricas Colombia',
      description: 'Error al cargar la página solicitada.'
    }
  }
}

export default async function CategoryCityPage({ params }: CategoryCityPageProps) {
  const { categoria, ciudad } = await params

  try {
    // Validate that the category exists
    const category = await categoryService.getBySlug(categoria)
    
    if (!category) {
      notFound()
    }

    // Get all businesses for this category
    const allBusinesses = await negociosService.getByCategory(category.nombre)
    
    // Filter by city slug
    const businesses = allBusinesses.filter(business => {
      const businessCitySlug = business.ciudad_slug || getCitySlug(business.ciudad)
      return businessCitySlug === ciudad
    })

    // If no businesses found, check if the city exists at all
    if (businesses.length === 0) {
      const allCities = await negociosService.getCities()
      const cityExists = allCities.some(c => getCitySlug(c) === ciudad)
      
      if (!cityExists) {
        notFound()
      }
    }

    const cityName = businesses[0]?.ciudad || ciudad
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-6xl">{category.icono}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {category.nombre} en {cityName}
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  {businesses.length > 0 
                    ? `Encuentra los mejores negocios de ${category.nombre.toLowerCase()} en ${cityName}.`
                    : `Actualmente no hay negocios de ${category.nombre.toLowerCase()} registrados en ${cityName}.`
                  }
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <Link
                    href={`/${categoria}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    ← Ver todos los negocios de {category.nombre}
                  </Link>
                  <Link
                    href="/categorias"
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Ver todas las categorías
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {businesses.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {businesses.length} negocio{businesses.length !== 1 ? 's' : ''} encontrado{businesses.length !== 1 ? 's' : ''}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard key={business.id} business={business} location="category_city_page" />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron negocios
                </h3>
                <p className="text-gray-600 mb-4">
                  Actualmente no hay negocios de {category.nombre.toLowerCase()} registrados en {cityName}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${categoria}`}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Ver todos los negocios de {category.nombre}
                  </Link>
                  <Link
                    href="/directorio"
                    className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    Ver directorio completo
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Breadcrumb Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": baseUrl
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": category.nombre,
                    "item": `${baseUrl}/${categoria}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": cityName,
                    "item": `${baseUrl}/${categoria}/${ciudad}`
                  }
                ]
              })
            }}
          />

          {/* Collection Page Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": `${category.nombre} en ${cityName}`,
                "description": `Directorio de ${category.nombre.toLowerCase()} en ${cityName}, Colombia`,
                "url": `${baseUrl}/${categoria}/${ciudad}`,
                "mainEntity": {
                  "@type": "ItemList",
                  "numberOfItems": businesses.length,
                  "itemListElement": businesses.map((business, index) => ({
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
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading category-city page:', error)
    notFound()
  }
}

