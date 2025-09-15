'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SEOFormData } from './BrandSEOManager'

interface SocialMediaPreviewProps {
  seoData: SEOFormData
  brandName: string
}

export default function SocialMediaPreview({ seoData, brandName }: SocialMediaPreviewProps) {
  const [activeTab, setActiveTab] = useState<'facebook' | 'twitter' | 'google'>('facebook')

  const getPreviewImage = () => {
    return seoData.og_image_url || '/images/default-og-image.jpg'
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Vista Previa en Redes Sociales
      </h4>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('facebook')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'facebook'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </div>
        </button>
        <button
          onClick={() => setActiveTab('twitter')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'twitter'
              ? 'bg-white text-blue-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </div>
        </button>
        <button
          onClick={() => setActiveTab('google')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'google'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
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
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-500">@patinetas_co · 2h</p>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <p className="text-sm text-gray-900 mb-3">
                🛴 Descubre los mejores modelos de {brandName} disponibles en Colombia
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
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm text-gray-600">patinetaelectrica.com.co</p>
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-500">Catálogo › Marcas › {brandName}</p>
                  </div>
                  
                  <h3 className="text-lg text-blue-600 hover:underline cursor-pointer mb-2 line-clamp-2">
                    {seoData.seo_title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {seoData.seo_description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <span>⭐ 4.8</span>
                    <span>📱 Móvil</span>
                    <span>🔒 HTTPS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Snippet Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa de Rich Snippet</h4>
              <div className="bg-white border rounded p-3">
                <div className="flex items-start space-x-3">
                  {getPreviewImage() && (
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={getPreviewImage()}
                          alt="Brand logo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">
                      {brandName}
                    </h5>
                    <p className="text-xs text-gray-600 mb-2">
                      Marca de patinetas eléctricas
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>⭐ 4.8 (127 reseñas)</span>
                      <span>📍 Colombia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Consejos SEO
        </h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Usa títulos descriptivos y únicos para cada marca</li>
          <li>• Incluye palabras clave relevantes naturalmente</li>
          <li>• Mantén las descripciones entre 150-160 caracteres</li>
          <li>• Usa imágenes de alta calidad (mínimo 1200x630px)</li>
          <li>• Verifica que las URLs canónicas sean correctas</li>
        </ul>
      </div>
    </div>
  )
}
