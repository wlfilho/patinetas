import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { categoryService, negociosService } from '@/lib/supabase'
import { getCategorySlug } from '@/lib/slugs'
import CategoryPageClient from './CategoryPageClient'

interface CategoryPageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoria } = await params
  
  try {
    const category = await categoryService.getBySlug(categoria)
    
    if (!category) {
      return {
        title: 'Categoría no encontrada',
        description: 'La categoría que buscas no existe o ha sido eliminada.'
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

    return {
      title: `${category.nombre} en Colombia | Patinetas Eléctricas`,
      description: category.descripcion || `Encuentra los mejores negocios de ${category.nombre.toLowerCase()} en Colombia. Directorio completo con información verificada.`,
      keywords: `${category.nombre.toLowerCase()}, patinetas eléctricas, Colombia, directorio`,
      openGraph: {
        title: `${category.nombre} en Colombia`,
        description: category.descripcion || `Directorio de ${category.nombre.toLowerCase()} en Colombia`,
        url: `${baseUrl}/${categoria}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.nombre} en Colombia`,
        description: category.descripcion || `Directorio de ${category.nombre.toLowerCase()} en Colombia`,
      },
      alternates: {
        canonical: `${baseUrl}/${categoria}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata for category:', error)
    return {
      title: 'Error - Patinetas Eléctricas Colombia',
      description: 'Error al cargar la categoría solicitada.'
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoria } = await params

  try {
    // Validate that the category exists
    const category = await categoryService.getBySlug(categoria)
    
    if (!category) {
      notFound()
    }

    // Get businesses for this category
    const businesses = await negociosService.getByCategory(category.nombre)
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <CategoryPageClient 
            category={category}
            initialBusinesses={businesses}
            categorySlug={categoria}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}

// Generate static params for known categories
export async function generateStaticParams() {
  try {
    const categories = await categoryService.getAll(false) // Only active categories
    
    return categories
      .filter(category => category.slug) // Only categories with slugs
      .map((category) => ({
        categoria: category.slug,
      }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    return []
  }
}

