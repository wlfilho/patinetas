import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ModeloPatineta } from '@/types/database'

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/catalogo" className="ml-4 text-gray-400 hover:text-gray-500">
                    Catálogo
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-500">{model.nombre}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Model Details */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Model Image */}
          <div className="flex flex-col-reverse">
            <div className="aspect-w-1 aspect-h-1 w-full">
              {model.imagen_url ? (
                <Image
                  src={model.imagen_url}
                  alt={model.nombre}
                  width={600}
                  height={600}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-6xl text-gray-400">🛴</span>
                </div>
              )}
            </div>
          </div>

          {/* Model Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{model.nombre}</h1>
            
            {model.marca && (
              <div className="mt-3">
                <h2 className="sr-only">Información de la marca</h2>
                <p className="text-lg text-gray-600">por {model.marca.nombre}</p>
              </div>
            )}

            {/* Price */}
            <div className="mt-6">
              <h3 className="sr-only">Precio</h3>
              <div className="flex items-center">
                {model.precio_min && model.precio_max ? (
                  <p className="text-3xl font-bold text-gray-900">
                    ${model.precio_min.toLocaleString()} - ${model.precio_max.toLocaleString()}
                  </p>
                ) : model.precio_min ? (
                  <p className="text-3xl font-bold text-gray-900">
                    Desde ${model.precio_min.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-lg text-gray-600">Precio bajo consulta</p>
                )}
              </div>
            </div>

            {/* Description */}
            {model.descripcion && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Descripción</h3>
                <div className="mt-4 prose prose-sm text-gray-600">
                  <p>{model.descripcion}</p>
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Especificaciones</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {model.velocidad_maxima && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">Velocidad Máxima</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.velocidad_maxima} km/h</dd>
                  </div>
                )}
                {model.autonomia && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">Autonomía</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.autonomia} km</dd>
                  </div>
                )}
                {model.peso && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">Peso</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.peso} kg</dd>
                  </div>
                )}
                {model.carga_maxima && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">Carga Máxima</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.carga_maxima} kg</dd>
                  </div>
                )}
                {model.tiempo_carga && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">Tiempo de Carga</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.tiempo_carga} horas</dd>
                  </div>
                )}
                {model.tipo_bateria && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">Tipo de Batería</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.tipo_bateria}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/directorio"
                className="flex-1 bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Ver Tiendas
              </Link>
              <Link
                href="/catalogo"
                className="flex-1 bg-white text-gray-900 px-8 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-center"
              >
                Ver Más Modelos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
