import { MetadataRoute } from 'next'
import { negociosService } from '@/lib/supabase'
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
    // Dynamic business pages - NEW URL STRUCTURE: /[categoria]/[cidade]/[negocio]
    const businesses = await negociosService.getAll()
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

    // Category pages
    const categories = await negociosService.getCategories()
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categorias/${generateSlug(category.nombre)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // City pages
    const cities = await negociosService.getCities()
    const cityPages = cities.map(city => ({
      url: `${baseUrl}/ciudades/${generateSlug(city)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [
      ...staticPages,
      ...businessPages,
      ...categoryPages,
      ...cityPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if dynamic content fails
    return staticPages
  }
}
