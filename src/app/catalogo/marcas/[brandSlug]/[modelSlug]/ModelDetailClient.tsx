'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug } from '@/lib/slugs'

interface ModelDetailClientProps {
  model: ModeloPatineta
  brandSlug: string
  modelSlug: string
}

export default function ModelDetailClient({ model, brandSlug, modelSlug }: ModelDetailClientProps) {
  const [imageError, setImageError] = useState(false)

  // Update URL if needed (for client-side navigation)
  useEffect(() => {
    if (typeof window !== 'undefined' && model.marca) {
      const expectedBrandSlug = getBrandSlug(model.marca.nombre)
      const currentPath = window.location.pathname
      const expectedPath = `/catalogo/marcas/${expectedBrandSlug}/${modelSlug}`
      
      if (currentPath !== expectedPath) {
        window.history.replaceState({}, '', expectedPath)
      }
    }
  }, [model, modelSlug])

  if (!model.marca) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">No se pudo cargar la información de la marca.</p>
        </div>
      </div>
    )
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
                  <Link 
                    href={`/catalogo/marcas?slug=${brandSlug}`} 
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    {model.marca.nombre}
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
              {model.imagen_url && !imageError ? (
                <Image
                  src={model.imagen_url}
                  alt={`${model.nombre} - ${model.marca.nombre}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl text-gray-400 mb-4 block">🛴</span>
                    <p className="text-gray-500 text-sm">Imagen no disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Model Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{model.nombre}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Información de la marca</h2>
              <p className="text-lg text-gray-600">por {model.marca.nombre}</p>
            </div>

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
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Velocidad Máxima</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.velocidad_maxima} km/h</dd>
                  </div>
                )}
                {model.autonomia && (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Autonomía</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.autonomia} km</dd>
                  </div>
                )}
                {model.peso && (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Peso</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.peso} kg</dd>
                  </div>
                )}
                {model.potencia && (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Potencia</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.potencia} W</dd>
                  </div>
                )}
                {model.tiempo_carga && (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Tiempo de Carga</dt>
                    <dd className="mt-1 text-sm text-gray-900">{model.tiempo_carga} horas</dd>
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
                href={`/catalogo/marcas?slug=${brandSlug}`}
                className="flex-1 bg-white text-gray-900 px-8 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-center"
              >
                Ver Más Modelos de {model.marca.nombre}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": model.nombre,
            "brand": {
              "@type": "Brand",
              "name": model.marca.nombre
            },
            "description": model.descripcion || `${model.nombre} de ${model.marca.nombre}`,
            "image": model.imagen_url || undefined,
            "offers": model.precio_min ? {
              "@type": "Offer",
              "price": model.precio_min,
              "priceCurrency": "COP",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Patinetas Eléctricas Colombia"
              }
            } : undefined,
            "additionalProperty": [
              model.velocidad_maxima && {
                "@type": "PropertyValue",
                "name": "Velocidad Máxima",
                "value": `${model.velocidad_maxima} km/h`
              },
              model.autonomia && {
                "@type": "PropertyValue", 
                "name": "Autonomía",
                "value": `${model.autonomia} km`
              },
              model.peso && {
                "@type": "PropertyValue",
                "name": "Peso", 
                "value": `${model.peso} kg`
              },
              model.potencia && {
                "@type": "PropertyValue",
                "name": "Potencia",
                "value": `${model.potencia} W`
              }
            ].filter(Boolean)
          })
        }}
      />
    </div>
  )
}
