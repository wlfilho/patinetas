import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { categoryService, negociosService } from '@/lib/supabase'
import { getCategorySlug } from '@/lib/slugs'
import DirectorioCategoryClient from './DirectorioCategoryClient'

interface CategoryPageProps {
  params: Promise<{ 'slug-da-categoria': string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { 'slug-da-categoria': categorySlug } = await params
  
  try {
    const category = await categoryService.getBySlug(categorySlug)
    
    if (!category) {
      return {
        title: 'Categoría no encontrada',
        description: 'La categoría que buscas no existe o ha sido eliminada.'
      }
    }

    const businessCount = await categoryService.getBusinessCount(category.id)
    
    return {
      title: `${category.nombre} en Colombia | Patinetas Eléctricas`,
      description: category.descripcion || `Encuentra los mejores negocios de ${category.nombre.toLowerCase()} en Colombia. Directorio completo de patinetas eléctricas con ${businessCount} opciones disponibles.`,
      keywords: `${category.nombre}, patinetas eléctricas, Colombia, ${category.nombre.toLowerCase()}, directorio, negocios`,
      openGraph: {
        title: `${category.nombre} en Colombia`,
        description: category.descripcion || `Directorio de ${category.nombre.toLowerCase()} en Colombia`,
        type: 'website',
        locale: 'es_CO',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.nombre} en Colombia`,
        description: category.descripcion || `Directorio de ${category.nombre.toLowerCase()} en Colombia`,
      },
      alternates: {
        canonical: `https://staging.motoselectricas.com.co/directorio/${categorySlug}`
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
  const { 'slug-da-categoria': categorySlug } = await params
  
  try {
    // Try to get category by slug first
    let category = await categoryService.getBySlug(categorySlug)
    
    // If not found by slug, try to find by generated slug from name
    if (!category) {
      const allCategories = await categoryService.getAll(false) // Only active categories
      const foundCategory = allCategories.find(cat =>
        getCategorySlug(cat.nombre) === categorySlug
      )

      if (!foundCategory) {
        notFound()
      }

      category = foundCategory
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
          <DirectorioCategoryClient 
            category={category}
            initialBusinesses={businesses}
            categorySlug={categorySlug}
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
        'slug-da-categoria': category.slug,
      }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    return []
  }
}
