import { MetadataRoute } from 'next'
import { negociosService } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable for base URL, fallback to production URL
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
    // Dynamic business pages
    const businesses = await negociosService.getAll()
    const businessPages = businesses.map(business => ({
      url: `${baseUrl}/negocio/${business.id}`,
      lastModified: new Date(business.fecha_actualizacion),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

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
