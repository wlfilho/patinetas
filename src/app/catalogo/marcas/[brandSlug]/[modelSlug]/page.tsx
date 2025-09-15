import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { modelService } from '@/lib/supabase'
import { getBrandSlug, generateUniqueModelSlug, isValidSlug } from '@/lib/slugs'
import ModelDetailClient from './ModelDetailClient'

interface ModelPageProps {
  params: Promise<{ brandSlug: string; modelSlug: string }>
}

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Generate static params for popular brand/model combinations
export async function generateStaticParams() {
  console.log('[DEBUG] generateStaticParams called for model pages')
  
  try {
    // Get popular models for static generation
    const models = await modelService.getAll()
    const popularBrandSlugs = ['xiaomi', 'segway', 'ninebot', 'razor', 'swagtron']
    
    const staticParams = models
      .filter(model => model.marca && popularBrandSlugs.includes(getBrandSlug(model.marca.nombre)))
      .slice(0, 20) // Limit to first 20 popular models
      .map(model => {
        if (!model.marca) return null
        
        const brandSlug = getBrandSlug(model.marca.nombre)
        const modelSlug = generateUniqueModelSlug(model.nombre, model.marca.nombre, models)
        
        return {
          brandSlug,
          modelSlug
        }
      })
      .filter(Boolean)
    
    console.log(`[DEBUG] Generated ${staticParams.length} static params for model pages`)
    return staticParams
  } catch (error) {
    console.error('[DEBUG] Error in generateStaticParams for models:', error)
    return []
  }
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  try {
    const { brandSlug, modelSlug } = await params
    console.log(`[DEBUG] generateMetadata called for brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
    
    // Validate slug formats
    if (!isValidSlug(brandSlug) || !isValidSlug(modelSlug)) {
      return {
        title: 'Modelo no encontrado | Patinetas Eléctricas Colombia',
      }
    }
    
    const model = await modelService.getByBrandAndModelSlugs(brandSlug, modelSlug)
    
    if (!model || !model.marca) {
      return {
        title: 'Modelo no encontrado | Patinetas Eléctricas Colombia',
        description: 'El modelo de patineta eléctrica que buscas no se encuentra disponible.',
      }
    }

    const title = `${model.nombre} - ${model.marca.nombre} | Patinetas Eléctricas Colombia`
    const description = `Descubre el ${model.nombre} de ${model.marca.nombre}. ${model.descripcion || 'Especificaciones completas, precio y dónde comprarlo en Colombia.'}`
    
    return {
      title,
      description,
      keywords: `${model.nombre}, ${model.marca.nombre}, patineta eléctrica, scooter eléctrico, Colombia, ${brandSlug}, ${modelSlug}`,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'es_CO',
        url: `https://patinetaelectrica.com.co/catalogo/marcas/${brandSlug}/${modelSlug}`,
        images: model.imagen_url ? [
          {
            url: model.imagen_url,
            width: 800,
            height: 600,
            alt: `${model.nombre} - ${model.marca.nombre}`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: model.imagen_url ? [model.imagen_url] : [],
      },
      alternates: {
        canonical: `https://patinetaelectrica.com.co/catalogo/marcas/${brandSlug}/${modelSlug}`,
      },
    }
  } catch (error) {
    console.error('[DEBUG] Error in generateMetadata for model:', error)
    return {
      title: 'Error | Patinetas Eléctricas Colombia',
      description: 'Ocurrió un error al cargar la información del modelo.',
    }
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  try {
    const { brandSlug, modelSlug } = await params
    console.log(`[DEBUG] ModelPage called with brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
    
    // Validate slug formats
    if (!isValidSlug(brandSlug) || !isValidSlug(modelSlug)) {
      console.log(`[DEBUG] Invalid slug format - brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
      notFound()
    }
    
    // Try to get the model by slugs
    const model = await modelService.getByBrandAndModelSlugs(brandSlug, modelSlug)
    
    if (!model || !model.marca) {
      console.log(`[DEBUG] Model not found for brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
      
      // Check if this might be an old UUID-based URL that needs redirecting
      if (brandSlug.includes('-') && brandSlug.length > 20) {
        console.log(`[DEBUG] Possible UUID detected, checking for redirect`)
        try {
          const modelById = await modelService.getById(brandSlug)
          if (modelById && modelById.marca) {
            const correctBrandSlug = getBrandSlug(modelById.marca.nombre)
            const correctModelSlug = generateUniqueModelSlug(modelById.nombre, modelById.marca.nombre, [])
            const correctUrl = `/catalogo/marcas/${correctBrandSlug}/${correctModelSlug}`
            console.log(`[DEBUG] Redirecting to correct URL: ${correctUrl}`)
            redirect(correctUrl)
          }
        } catch (redirectError) {
          console.log(`[DEBUG] No redirect possible:`, redirectError)
        }
      }
      
      notFound()
    }
    
    console.log(`[DEBUG] Model found: ${model.nombre} by ${model.marca.nombre}`)
    
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del modelo...</p>
          </div>
        </div>
      }>
        <ModelDetailClient 
          model={model} 
          brandSlug={brandSlug} 
          modelSlug={modelSlug} 
        />
      </Suspense>
    )
  } catch (error) {
    console.error(`[DEBUG] Error in ModelPage:`, error)
    notFound()
  }
}
