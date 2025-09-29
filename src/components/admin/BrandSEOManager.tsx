'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MarcaPatineta } from '@/lib/supabase'
import { getBrandSlug } from '@/lib/slugs'

interface BrandSEOManagerProps {
  brand: MarcaPatineta
  onSEODataChange: (seoData: SEOFormData) => void
}

export interface SEOFormData {
  seo_title: string
  seo_description: string
  seo_keywords: string
  seo_canonical_url: string
  seo_robots: string
  og_title: string
  og_description: string
  og_image_url: string
}

const ROBOTS_OPTIONS = [
  { value: 'index,follow', label: 'Index, Follow (Recomendado)' },
  { value: 'index,nofollow', label: 'Index, No Follow' },
  { value: 'noindex,follow', label: 'No Index, Follow' },
  { value: 'noindex,nofollow', label: 'No Index, No Follow' },
]

export default function BrandSEOManager({ brand, onSEODataChange }: BrandSEOManagerProps) {
  const [seoData, setSeoData] = useState<SEOFormData>({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_canonical_url: '',
    seo_robots: 'index,follow',
    og_title: '',
    og_description: '',
    og_image_url: '',
  })

  const [showPreview, setShowPreview] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Initialize SEO data from brand
  useEffect(() => {
    const brandSlug = getBrandSlug(brand.nombre)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'
    
    const defaultSEOData: SEOFormData = {
      seo_title: brand.seo_title || `${brand.nombre} - Patinetas Eléctricas | Catálogo Colombia`,
      seo_description: brand.seo_description || `Descubre todos los modelos de patinetas eléctricas ${brand.nombre} disponibles en Colombia. Especificaciones, precios y dónde comprar ${brand.nombre}.`,
      seo_keywords: brand.seo_keywords || `${brand.nombre}, patinetas eléctricas ${brand.nombre}, scooters eléctricos ${brand.nombre}, ${brand.nombre} Colombia, modelos ${brand.nombre}`,
      seo_canonical_url: brand.seo_canonical_url || `${baseUrl}/catalogo/marcas/${brandSlug}`,
      seo_robots: brand.seo_robots || 'index,follow',
      og_title: brand.og_title || `${brand.nombre} - Catálogo de Patinetas Eléctricas`,
      og_description: brand.og_description || brand.descripcion || `Explora todos los modelos de patinetas eléctricas ${brand.nombre} disponibles en Colombia.`,
      og_image_url: brand.og_image_url || brand.logo_url || '',
    }

    setSeoData(defaultSEOData)
    onSEODataChange(defaultSEOData)
  }, [brand, onSEODataChange])

  const handleInputChange = (field: keyof SEOFormData, value: string) => {
    const updatedData = { ...seoData, [field]: value }
    setSeoData(updatedData)
    onSEODataChange(updatedData)
  }

  const getCharacterCount = (text: string) => text.length
  const getCharacterCountColor = (count: number, min: number, max: number) => {
    if (count < min) return 'text-orange-600'
    if (count > max) return 'text-red-600'
    return 'text-green-600'
  }

  const validateImageUrl = (url: string) => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Gestión SEO - {brand.nombre}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Optimiza la visibilidad en motores de búsqueda y redes sociales para esta marca
        </p>
      </div>

      {/* SEO Metadata Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Metadatos SEO
        </h4>

        <div className="space-y-6">
          {/* SEO Title */}
          <div>
            <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-2">
              Título SEO (Meta Title)
              <span className="text-xs text-gray-500 ml-2">
                Recomendado: 50-60 caracteres
              </span>
            </label>
            <input
              type="text"
              id="seo_title"
              value={seoData.seo_title}
              onChange={(e) => handleInputChange('seo_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Título optimizado para motores de búsqueda"
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${getCharacterCountColor(getCharacterCount(seoData.seo_title), 50, 60)}`}>
                {getCharacterCount(seoData.seo_title)} caracteres
              </span>
              {getCharacterCount(seoData.seo_title) > 60 && (
                <span className="text-xs text-red-600">⚠️ Muy largo para SEO</span>
              )}
            </div>
          </div>

          {/* SEO Description */}
          <div>
            <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción SEO (Meta Description)
              <span className="text-xs text-gray-500 ml-2">
                Recomendado: 150-160 caracteres
              </span>
            </label>
            <textarea
              id="seo_description"
              rows={3}
              value={seoData.seo_description}
              onChange={(e) => handleInputChange('seo_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Descripción que aparecerá en los resultados de búsqueda"
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${getCharacterCountColor(getCharacterCount(seoData.seo_description), 150, 160)}`}>
                {getCharacterCount(seoData.seo_description)} caracteres
              </span>
              {getCharacterCount(seoData.seo_description) > 160 && (
                <span className="text-xs text-red-600">⚠️ Muy largo para SEO</span>
              )}
            </div>
          </div>

          {/* SEO Keywords */}
          <div>
            <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-2">
              Palabras Clave SEO
              <span className="text-xs text-gray-500 ml-2">
                Separadas por comas
              </span>
            </label>
            <input
              type="text"
              id="seo_keywords"
              value={seoData.seo_keywords}
              onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="palabra1, palabra2, palabra3"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Incluye términos relevantes como &quot;{brand.nombre}&quot;, &quot;patinetas eléctricas&quot;, &quot;Colombia&quot;
            </p>
          </div>

          {/* Canonical URL */}
          <div>
            <label htmlFor="seo_canonical_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL Canónica
            </label>
            <input
              type="url"
              id="seo_canonical_url"
              value={seoData.seo_canonical_url}
              onChange={(e) => handleInputChange('seo_canonical_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://patinetaelectrica.com.co/catalogo/marcas/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              URL principal de esta página para evitar contenido duplicado
            </p>
          </div>

          {/* Robots Meta */}
          <div>
            <label htmlFor="seo_robots" className="block text-sm font-medium text-gray-700 mb-2">
              Directivas para Robots (Meta Robots)
            </label>
            <select
              id="seo_robots"
              value={seoData.seo_robots}
              onChange={(e) => handleInputChange('seo_robots', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {ROBOTS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Controla cómo los motores de búsqueda indexan esta página
            </p>
          </div>
        </div>
      </div>

      {/* OpenGraph Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Redes Sociales (OpenGraph & Twitter)
        </h4>

        <div className="space-y-6">
          {/* OG Title */}
          <div>
            <label htmlFor="og_title" className="block text-sm font-medium text-gray-700 mb-2">
              Título para Redes Sociales
            </label>
            <input
              type="text"
              id="og_title"
              value={seoData.og_title}
              onChange={(e) => handleInputChange('og_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Título atractivo para compartir en redes sociales"
            />
          </div>

          {/* OG Description */}
          <div>
            <label htmlFor="og_description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción para Redes Sociales
            </label>
            <textarea
              id="og_description"
              rows={3}
              value={seoData.og_description}
              onChange={(e) => handleInputChange('og_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Descripción que aparecerá al compartir en redes sociales"
            />
          </div>

          {/* OG Image */}
          <div>
            <label htmlFor="og_image_url" className="block text-sm font-medium text-gray-700 mb-2">
              Imagen para Redes Sociales
              <span className="text-xs text-gray-500 ml-2">
                Recomendado: 1200x630px mínimo
              </span>
            </label>
            <input
              type="url"
              id="og_image_url"
              value={seoData.og_image_url}
              onChange={(e) => {
                handleInputChange('og_image_url', e.target.value)
                setImageError(false)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="URL de la imagen (se usará el logo de la marca por defecto)"
            />
            
            {/* Image Preview */}
            {seoData.og_image_url && validateImageUrl(seoData.og_image_url) && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Vista previa de la imagen:</p>
                <div className="relative w-32 h-16 border border-gray-200 rounded overflow-hidden">
                  <Image
                    src={seoData.og_image_url}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                      Error al cargar
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              💡 Si no se especifica, se usará el logo de la marca automáticamente
            </p>
          </div>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {showPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa Social'}
        </button>
      </div>
    </div>
  )
}
