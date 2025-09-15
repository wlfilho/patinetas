'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ModelSEOFormData } from './ModelSEOManager'

interface ModelSocialMediaPreviewProps {
  seoData: ModelSEOFormData
  modelName: string
  brandName?: string
}

export default function ModelSocialMediaPreview({ seoData, modelName, brandName }: ModelSocialMediaPreviewProps) {
  const [activeTab, setActiveTab] = useState<'facebook' | 'twitter' | 'google'>('facebook')

  const getPreviewImage = () => {
    return seoData.og_image_url || '/images/default-model-og-image.jpg'
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Vista Previa en Redes Sociales</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Cómo se verá al compartir</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('facebook')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'facebook'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('twitter')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'twitter'
              ? 'bg-white text-blue-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span>Twitter</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('google')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'google'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </div>
        </button>
      </div>

      {/* Preview Content */}
      <div className="space-y-4">
        {activeTab === 'facebook' && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PE</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Patinetas Eléctricas Colombia</p>
                  <p className="text-xs text-gray-500">hace 2 horas</p>
                </div>
              </div>
            </div>
            
            {getPreviewImage() && (
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={getPreviewImage()}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                PATINETAELECTRICA.COM.CO
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {seoData.og_title || seoData.seo_title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {seoData.og_description || seoData.seo_description}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'twitter' && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PE</span>
                </div>
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-gray-900">Patinetas Eléctricas</p>
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                  <span className="text-sm text-gray-500">@patinetas_co · 2h</span>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <p className="text-sm text-gray-900 mb-3">
                🛴 Conoce las especificaciones de la {modelName} {brandName ? `de ${brandName}` : ''} disponible en Colombia
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg mx-3 mb-3 overflow-hidden">
              {getPreviewImage() && (
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={getPreviewImage()}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {truncateText(seoData.og_title || seoData.seo_title, 70)}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {truncateText(seoData.og_description || seoData.seo_description, 125)}
                </p>
                <p className="text-xs text-gray-500">
                  🔗 patinetaelectrica.com.co
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'google' && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                      {truncateText(seoData.seo_title, 60)}
                    </h3>
                  </div>
                  <p className="text-xs text-green-700 mb-2">
                    https://patinetaelectrica.com.co › catalogo › marcas › {brandName?.toLowerCase().replace(/\s+/g, '-') || 'marca'} › {modelName.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {truncateText(seoData.seo_description, 160)}
                  </p>
                </div>
                {getPreviewImage() && (
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden">
                      <Image
                        src={getPreviewImage()}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rich Snippet Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Rich Snippet (Producto)</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Nombre:</span>
                  <span className="text-xs font-medium text-gray-900">{modelName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Marca:</span>
                  <span className="text-xs font-medium text-gray-900">{brandName || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Disponibilidad:</span>
                  <span className="text-xs text-green-600">✓ En stock en Colombia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Categoría:</span>
                  <span className="text-xs text-gray-700">Patinetas Eléctricas</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Consejos de Optimización</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Incluye especificaciones clave (velocidad, autonomía) en el título</li>
              <li>• Menciona la disponibilidad en Colombia en la descripción</li>
              <li>• Usa una imagen de alta calidad del modelo (1200x630px para redes sociales)</li>
              <li>• Incluye el precio aproximado si está disponible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
