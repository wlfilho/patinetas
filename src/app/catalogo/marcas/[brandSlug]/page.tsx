import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brandService, modelService } from '@/lib/supabase'
import { isValidSlug } from '@/lib/slugs'
import BrandCatalogClient from './BrandCatalogClient'

interface BrandCatalogPageProps {
  params: Promise<{ brandSlug: string }>
}

async function getBrandBySlug(slug: string) {
  try {
    console.log(`[DEBUG] Attempting to fetch brand for slug: ${slug}`)
    console.log(`[DEBUG] Environment: ${process.env.NODE_ENV}`)
    console.log(`[DEBUG] Supabase URL exists: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL}`)
    console.log(`[DEBUG] Supabase Key exists: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`)

    if (!isValidSlug(slug)) {
      console.log(`[DEBUG] Invalid slug: ${slug}`)
      return null
    }

    const brand = await brandService.getBySlug(slug)
    console.log(`[DEBUG] Brand found:`, brand ? `${brand.nombre} (${brand.id})` : 'null')
    return brand
  } catch (error) {
    console.error('[ERROR] Error fetching brand by slug:', error)
    console.error('[ERROR] Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('[ERROR] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return null
  }
}

async function getModelsByBrand(brandId: string) {
  try {
    const models = await modelService.getAll()
    return models.filter(model => model.marca_id === brandId && model.activo)
  } catch (error) {
    console.error('Error fetching models by brand:', error)
    return []
  }
}

export async function generateMetadata({ params }: BrandCatalogPageProps): Promise<Metadata> {
  const { brandSlug } = await params
  const brand = await getBrandBySlug(brandSlug)

  if (!brand) {
    return {
      title: 'Marca no encontrada | Patinetas Eléctricas Colombia',
    }
  }


  // Use custom SEO data if available, otherwise fall back to defaults
  const title = brand.seo_title || `${brand.nombre} - Patinetas Eléctricas | Catálogo Colombia`
  const description = brand.seo_description || `Descubre todos los modelos de patinetas eléctricas ${brand.nombre} disponibles en Colombia. Especificaciones, precios y dónde comprar ${brand.nombre}.`
  const keywords = brand.seo_keywords || `${brand.nombre}, patinetas eléctricas ${brand.nombre}, scooters eléctricos ${brand.nombre}, ${brand.nombre} Colombia, modelos ${brand.nombre}`
  const canonicalUrl = brand.seo_canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/catalogo/marcas/${brandSlug}`
  const robotsDirective = brand.seo_robots || 'index,follow'

  // OpenGraph data
  const ogTitle = brand.og_title || `${brand.nombre} - Catálogo de Patinetas Eléctricas`
  const ogDescription = brand.og_description || brand.descripcion || description
  const ogImage = brand.og_image_url || brand.logo_url

  // Parse robots directive
  const robotsParts = robotsDirective.split(',').map(part => part.trim())
  const shouldIndex = robotsParts.includes('index')
  const shouldFollow = robotsParts.includes('follow')

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Patinetas Eléctricas Colombia' }],
    creator: 'Patinetas Eléctricas Colombia',
    publisher: 'Patinetas Eléctricas Colombia',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'Patinetas Eléctricas Colombia',
      locale: 'es_CO',
      type: 'website',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${brand.nombre} - Patinetas Eléctricas Colombia`,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: {
        index: shouldIndex,
        follow: shouldFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BrandCatalogPage({ params }: BrandCatalogPageProps) {
  const { brandSlug } = await params
  console.log(`[DEBUG] BrandCatalogPage called with brandSlug: ${brandSlug}`)

  // Always use client-side fallback to ensure consistent behavior
  // The client will detect query parameters and load data via API
  console.log(`[DEBUG] Using client-side fallback for brandSlug: ${brandSlug}`)
  return (
    <BrandCatalogClient
      brand={null}
      initialModels={[]}
      slug={brandSlug}
    />
  )

  // Removed server-side logic - all data loading now happens client-side
  // This ensures consistent behavior across all environments
}

// Enable dynamic params for brands not in generateStaticParams
export const dynamicParams = true

// Force dynamic rendering to ensure routes work in production
export const dynamic = 'force-dynamic'

// Generate static params for popular brands to ensure they work in production
export async function generateStaticParams() {
  console.log('[DEBUG] generateStaticParams called - generating static paths for known brands')

  try {
    // Try to generate static paths, but don't fail the build if it doesn't work
    const knownBrandSlugs = [
      'xiaomi',
      'segway',
      'ninebot',
      'kugoo',
      'dualtron',
      'zero',
      'inokim',
      'kaabo',
      'vsett',
      'minimotors'
    ]

    console.log('[DEBUG] Generating static params for brands:', knownBrandSlugs)

    return knownBrandSlugs.map((slug) => ({
      brandSlug: slug,
    }))
  } catch (error) {
    console.error('[DEBUG] Error in generateStaticParams:', error)
    // Return empty array if there's an error to prevent build failure
    return []
  }
}
