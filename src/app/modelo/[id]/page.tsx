import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { supabase, ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug, generateUniqueModelSlug } from '@/lib/slugs'

interface ModelPageProps {
  params: Promise<{ id: string }>
}

async function getModel(id: string): Promise<ModeloPatineta | null> {
  const { data, error } = await supabase
    .from('modelos_patinetas')
    .select(`
      *,
      marca:marcas_patinetas(*)
    `)
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { id } = await params
  const model = await getModel(id)

  if (!model) {
    return {
      title: 'Modelo no encontrado | Patinetas Eléctricas Colombia',
    }
  }

  return {
    title: `${model.nombre} - ${model.marca?.nombre} | Patinetas Eléctricas Colombia`,
    description: `Descubre el ${model.nombre} de ${model.marca?.nombre}. Especificaciones completas, precio y dónde comprarlo en Colombia.`,
    keywords: `${model.nombre}, ${model.marca?.nombre}, patineta eléctrica, scooter eléctrico, Colombia`,
    openGraph: {
      title: `${model.nombre} - ${model.marca?.nombre}`,
      description: `Descubre el ${model.nombre} de ${model.marca?.nombre}. Especificaciones completas, precio y dónde comprarlo en Colombia.`,
      type: 'website',
      locale: 'es_CO',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${model.nombre} - ${model.marca?.nombre}`,
      description: `Descubre el ${model.nombre} de ${model.marca?.nombre}. Especificaciones completas, precio y dónde comprarlo en Colombia.`,
    },
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { id } = await params
  const model = await getModel(id)

  if (!model) {
    notFound()
  }

  // Redirect to new SEO-friendly URL structure
  if (model.marca) {
    const brandSlug = getBrandSlug(model.marca.nombre)
    const modelSlug = generateUniqueModelSlug(model.nombre, model.marca.nombre, [])
    const newUrl = `/catalogo/marcas/${brandSlug}/${modelSlug}`
    console.log(`[DEBUG] Redirecting from /modelo/${id} to ${newUrl}`)
    redirect(newUrl)
    return // This line will never be reached, but helps TypeScript understand
  }

  // If no marca, show 404 (this should not happen with valid data)
  notFound()
}
