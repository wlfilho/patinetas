import { MetadataRoute } from 'next'
import { negociosService, categoryService } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { getCategorySlug, getCitySlug } from '@/lib/slugs'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/directorio`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  try {
    // Get all data
    const businesses = await negociosService.getAll()
    const allCategories = await categoryService.getAll(false) // Only active categories

    // 1. Category pages - NEW CANONICAL URL: /:categoria (Priority: 0.8)
    const categoryPages = allCategories
      .filter(category => category.slug)
      .map(category => ({
        url: `${baseUrl}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    // 2. Category + City pages - NEW URL: /:categoria/:ciudad (Priority: 0.7)
    // Generate unique category-city combinations from businesses
    const categoryCityCombinations = new Map<string, { categorySlug: string; citySlug: string; cityName: string }>()

    businesses.forEach(business => {
      const categorySlug = getCategorySlug(business.categoria)
      const citySlug = business.ciudad_slug || getCitySlug(business.ciudad)
      const key = `${categorySlug}/${citySlug}`

      if (!categoryCityCombinations.has(key)) {
        categoryCityCombinations.set(key, {
          categorySlug,
          citySlug,
          cityName: business.ciudad
        })
      }
    })

    const categoryCityPages = Array.from(categoryCityCombinations.values()).map(combo => ({
      url: `${baseUrl}/${combo.categorySlug}/${combo.citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 3. Business detail pages - URL: /:categoria/:cidade/:negocio (Priority: 0.6)
    const businessPages = businesses.map(business => {
      const categorySlug = getCategorySlug(business.categoria)
      const citySlug = business.ciudad_slug || getCitySlug(business.ciudad)
      const businessSlug = business.slug || business.id.toString()

      return {
        url: `${baseUrl}/${categorySlug}/${citySlug}/${businessSlug}`,
        lastModified: new Date(business.fecha_actualizacion),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    })

    return [
      ...staticPages,
      ...categoryPages,
      ...categoryCityPages,
      ...businessPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if dynamic content fails
    return staticPages
  }
}
