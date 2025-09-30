'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug } from '@/lib/slugs'
import TechnicalSpecifications from '@/components/catalog/TechnicalSpecifications'
import { EspecificacionesTecnicas } from '@/types/especificaciones'

interface ModelDetailClientProps {
  model: ModeloPatineta
  brandSlug: string
  modelSlug: string
}

// Helper function to generate comprehensive structured data
function generateStructuredData(model: ModeloPatineta) {
  const specs = model.especificaciones as EspecificacionesTecnicas | undefined
  const additionalProperties: Array<{
    "@type": string
    name: string
    value: string
  }> = []

  // Add legacy fields
  if (model.velocidad_maxima) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Velocidad Máxima",
      "value": `${model.velocidad_maxima} km/h`
    })
  }
  if (model.autonomia) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Autonomía",
      "value": `${model.autonomia} km`
    })
  }
  if (model.peso) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Peso",
      "value": `${model.peso} kg`
    })
  }
  if (model.potencia) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Potencia",
      "value": `${model.potencia} W`
    })
  }

  // Add specifications from JSONB field
  if (specs) {
    // Battery
    if (specs.bateria?.voltaje) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Voltaje Batería",
        "value": specs.bateria.voltaje
      })
    }
    if (specs.bateria?.capacidad) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Capacidad Batería",
        "value": specs.bateria.capacidad
      })
    }
    if (specs.bateria?.tipo) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Tipo de Batería",
        "value": specs.bateria.tipo
      })
    }

    // Motor
    if (specs.motor?.potencia) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Potencia Motor",
        "value": `${specs.motor.potencia} W`
      })
    }
    if (specs.motor?.tipo) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Tipo de Motor",
        "value": specs.motor.tipo
      })
    }

    // Performance
    if (specs.rendimiento?.carga_maxima) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Carga Máxima",
        "value": `${specs.rendimiento.carga_maxima} kg`
      })
    }
    if (specs.rendimiento?.grado_subida) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Grado de Subida",
        "value": `${specs.rendimiento.grado_subida}°`
      })
    }

    // Tires
    if (specs.neumaticos?.tamano_delantero) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Tamaño Neumáticos",
        "value": specs.neumaticos.tamano_delantero
      })
    }

    // Brakes
    if (specs.frenos?.sistema) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Sistema de Frenos",
        "value": specs.frenos.sistema
      })
    }

    // Suspension
    if (specs.suspension?.tipo) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Suspensión",
        "value": specs.suspension.tipo
      })
    }

    // Safety
    if (specs.seguridad?.resistencia_agua) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Resistencia al Agua",
        "value": specs.seguridad.resistencia_agua
      })
    }

    // Connectivity
    if (specs.conectividad?.app) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "App",
        "value": specs.conectividad.app
      })
    }

    // Features
    if (specs.caracteristicas_adicionales?.plegable) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Plegable",
        "value": "Sí"
      })
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": model.nombre,
    "brand": {
      "@type": "Brand",
      "name": model.marca?.nombre || "Marca"
    },
    "description": model.descripcion || `${model.nombre} de ${model.marca?.nombre || 'Marca'}`,
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
    "additionalProperty": additionalProperties.filter(Boolean)
  }
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
                    href={`/catalogo/marcas/${brandSlug}`}
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

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/directorio"
                className="flex-1 bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Ver Tiendas
              </Link>
              <Link
                href={`/catalogo/marcas/${brandSlug}`}
                className="flex-1 bg-white text-gray-900 px-8 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-center"
              >
                Ver Más Modelos de {model.marca.nombre}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications - Full Width Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-12">
        <TechnicalSpecifications
          specifications={model.especificaciones}
          velocidad_maxima={model.velocidad_maxima}
          autonomia={model.autonomia}
          peso={model.peso}
          potencia={model.potencia}
          tiempo_carga={model.tiempo_carga}
        />
      </div>

      {/* Structured Data with Complete Specifications */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(model))
        }}
      />
    </div>
  )
}
