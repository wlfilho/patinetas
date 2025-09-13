import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brandService, modelService } from '@/lib/supabase'
import { isValidSlug } from '@/lib/slugs'
import BrandCatalogClient from './BrandCatalogClient'

interface BrandCatalogPageProps {
  params: Promise<{ slug: string }>
}

async function getBrandBySlug(slug: string) {
  try {
    console.log(`[DEBUG] Attempting to fetch brand for slug: ${slug}`)

    if (!isValidSlug(slug)) {
      console.log(`[DEBUG] Invalid slug: ${slug}`)
      return null
    }

    const brand = await brandService.getBySlug(slug)
    console.log(`[DEBUG] Brand found:`, brand ? `${brand.nombre} (${brand.id})` : 'null')
    return brand
  } catch (error) {
    console.error('[ERROR] Error fetching brand by slug:', error)
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
  const { slug } = await params
  const brand = await getBrandBySlug(slug)

  if (!brand) {
    return {
      title: 'Marca no encontrada | Patinetas Eléctricas Colombia',
    }
  }


  const title = `${brand.nombre} - Patinetas Eléctricas | Catálogo Colombia`
  const description = `Descubre todos los modelos de patinetas eléctricas ${brand.nombre} disponibles en Colombia. Especificaciones, precios y dónde comprar ${brand.nombre}.`

  return {
    title,
    description,
    keywords: `${brand.nombre}, patinetas eléctricas ${brand.nombre}, scooters eléctricos ${brand.nombre}, ${brand.nombre} Colombia, modelos ${brand.nombre}`,
    authors: [{ name: 'Patinetas Eléctricas Colombia' }],
    creator: 'Patinetas Eléctricas Colombia',
    publisher: 'Patinetas Eléctricas Colombia',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `/catalogo/marcas/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/catalogo/marcas/${slug}`,
      siteName: 'Patinetas Eléctricas Colombia',
      locale: 'es_CO',
      type: 'website',
      images: brand.logo_url ? [
        {
          url: brand.logo_url,
          width: 400,
          height: 400,
          alt: `Logo de ${brand.nombre}`,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: brand.logo_url ? [brand.logo_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BrandCatalogPage({ params }: BrandCatalogPageProps) {
  const { slug } = await params
  console.log(`[DEBUG] BrandCatalogPage called with slug: ${slug}`)

  try {
    const brand = await getBrandBySlug(slug)

    if (!brand) {
      console.log(`[DEBUG] Brand not found for slug: ${slug}, calling notFound()`)
      notFound()
    }

    console.log(`[DEBUG] Fetching models for brand: ${brand.nombre} (${brand.id})`)
    const models = await getModelsByBrand(brand.id)
    console.log(`[DEBUG] Found ${models.length} models for brand: ${brand.nombre}`)

    return (
      <BrandCatalogClient
        brand={brand}
        initialModels={models}
      />
    )
  } catch (error) {
    console.error(`[DEBUG] Error in BrandCatalogPage for slug ${slug}:`, error)
    // Fallback to client-side rendering if server-side fails
    return (
      <BrandCatalogClient
        brand={null}
        initialModels={[]}
        slug={slug}
      />
    )
  }
}

// Enable dynamic params for brands not in generateStaticParams
export const dynamicParams = true

// Generate static params for popular brands to ensure they work in production
export async function generateStaticParams() {
  console.log('[DEBUG] generateStaticParams called - generating static paths for known brands')

  // Return predefined slugs for popular brands to ensure they're statically generated
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
    slug: slug,
  }))
}
