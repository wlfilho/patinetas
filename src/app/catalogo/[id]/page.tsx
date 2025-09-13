'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { modelService, ModeloPatineta } from '@/lib/supabase'
import { ModelStructuredData } from '@/components/seo/CatalogStructuredData'
import Link from 'next/link'

export default function ModelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [model, setModel] = useState<ModeloPatineta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadModel(params.id as string)
    }
  }, [params.id])

  const loadModel = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const modelData = await modelService.getById(id)
      setModel(modelData)
    } catch (error) {
      console.error('Error loading model:', error)
      setError('No se pudo cargar la información del modelo')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del modelo...</p>
        </div>
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Modelo no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'El modelo que buscas no existe o no está disponible.'}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Volver
            </button>
            <Link
              href="/catalogo"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ModelStructuredData model={model} />
      <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-primary">Catálogo</Link>
            <span>/</span>
            <span className="text-gray-900">{model.marca?.nombre} {model.nombre}</span>
          </div>
        </div>
      </nav>

      {/* Model Details */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Model Image */}
            <div className="aspect-w-16 aspect-h-12">
              {model.imagen_url ? (
                <img
                  src={model.imagen_url}
                  alt={`${model.marca?.nombre} ${model.nombre}`}
                  className="w-full h-96 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <div className="text-8xl text-gray-400">🛴</div>
                </div>
              )}
            </div>

            {/* Model Information */}
            <div>
              {/* Brand and Model Name */}
              <div className="mb-6">
                <p className="text-lg font-medium text-primary mb-2">{model.marca?.nombre}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{model.nombre}</h1>
                {model.descripcion && (
                  <p className="text-lg text-gray-600">{model.descripcion}</p>
                )}
              </div>

              {/* Price */}
              {(model.precio_min || model.precio_max) && (
                <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Precio en Colombia</h3>
                  <p className="text-3xl font-bold text-primary">
                    {model.precio_min && model.precio_max ? (
                      model.precio_min === model.precio_max ? (
                        formatPrice(model.precio_min)
                      ) : (
                        `${formatPrice(model.precio_min)} - ${formatPrice(model.precio_max)}`
                      )
                    ) : model.precio_min ? (
                      `Desde ${formatPrice(model.precio_min)}`
                    ) : (
                      `Hasta ${formatPrice(model.precio_max!)}`
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    *Los precios pueden variar según el distribuidor y la ubicación
                  </p>
                </div>
              )}

              {/* Key Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Especificaciones Principales</h3>
                <div className="grid grid-cols-2 gap-4">
                  {model.velocidad_maxima && (
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-2xl mr-3">⚡</span>
                      <div>
                        <p className="text-sm text-gray-600">Velocidad Máxima</p>
                        <p className="font-semibold text-gray-900">{model.velocidad_maxima} km/h</p>
                      </div>
                    </div>
                  )}
                  {model.autonomia && (
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-2xl mr-3">🔋</span>
                      <div>
                        <p className="text-sm text-gray-600">Autonomía</p>
                        <p className="font-semibold text-gray-900">{model.autonomia} km</p>
                      </div>
                    </div>
                  )}
                  {model.peso && (
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-2xl mr-3">⚖️</span>
                      <div>
                        <p className="text-sm text-gray-600">Peso</p>
                        <p className="font-semibold text-gray-900">{model.peso} kg</p>
                      </div>
                    </div>
                  )}
                  {model.potencia && (
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-2xl mr-3">🔧</span>
                      <div>
                        <p className="text-sm text-gray-600">Potencia</p>
                        <p className="font-semibold text-gray-900">{model.potencia} W</p>
                      </div>
                    </div>
                  )}
                  {model.tiempo_carga && (
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-2xl mr-3">🔌</span>
                      <div>
                        <p className="text-sm text-gray-600">Tiempo de Carga</p>
                        <p className="font-semibold text-gray-900">{model.tiempo_carga} horas</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Specifications */}
              {model.especificaciones && Object.keys(model.especificaciones).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Especificaciones Adicionales</h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(model.especificaciones).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-gray-900">
                            {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/directorio"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center font-medium"
                >
                  Encontrar Distribuidores
                </Link>
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Volver al Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Information */}
      {model.marca && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de {model.marca.nombre}</h2>
              {model.marca.descripcion && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{model.marca.descripcion}</p>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {model.marca.logo_url && (
                <img
                  src={model.marca.logo_url}
                  alt={model.marca.nombre}
                  className="w-32 h-32 object-contain"
                />
              )}
              <div className="text-center md:text-left">
                {model.marca.pais_origen && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">País de origen:</span> {model.marca.pais_origen}
                  </p>
                )}
                {model.marca.sitio_web && (
                  <a
                    href={model.marca.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    Visitar sitio web oficial
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  )
}
