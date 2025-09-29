'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ModeloPatineta } from '@/lib/supabase'
import { getModelSlug } from '@/lib/slugs'

interface ModelSEOManagerProps {
  model: ModeloPatineta
  onSEODataChange: (seoData: ModelSEOFormData) => void
}

export interface ModelSEOFormData {
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

export default function ModelSEOManager({ model, onSEODataChange }: ModelSEOManagerProps) {
  const [seoData, setSeoData] = useState<ModelSEOFormData>({
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

  // Initialize SEO data from model
  useEffect(() => {
    const modelSlug = getModelSlug(model.nombre)
    const brandSlug = model.marca?.nombre ? model.marca.nombre.toLowerCase().replace(/\s+/g, '-') : 'marca'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'
    
    const defaultSEOData: ModelSEOFormData = {
      seo_title: model.seo_title || `${model.nombre} - ${model.marca?.nombre || 'Patineta Eléctrica'} | Especificaciones y Precios`,
      seo_description: model.seo_description || `Conoce las especificaciones técnicas, precios y dónde comprar la ${model.nombre} de ${model.marca?.nombre || 'esta marca'} en Colombia. Velocidad máxima, autonomía y más.`,
      seo_keywords: model.seo_keywords || `${model.nombre}, ${model.marca?.nombre || ''}, patineta eléctrica ${model.nombre}, scooter eléctrico ${model.nombre}, ${model.nombre} Colombia, precio ${model.nombre}`,
      seo_canonical_url: model.seo_canonical_url || `${baseUrl}/catalogo/marcas/${brandSlug}/${modelSlug}`,
      seo_robots: model.seo_robots || 'index,follow',
      og_title: model.og_title || `${model.nombre} - ${model.marca?.nombre || 'Patineta Eléctrica'}`,
      og_description: model.og_description || model.descripcion || `Descubre las características y especificaciones de la ${model.nombre}. Velocidad máxima, autonomía, peso y precios en Colombia.`,
      og_image_url: model.og_image_url || model.imagen_url || '',
    }

    setSeoData(defaultSEOData)
    onSEODataChange(defaultSEOData)
  }, [model, onSEODataChange])

  const handleInputChange = (field: keyof ModelSEOFormData, value: string) => {
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

  return (
    <div className="space-y-8">
      {/* SEO Básico */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">SEO Básico</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Optimiza para motores de búsqueda</span>
          </div>
        </div>

        {/* SEO Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700">
              Título SEO *
            </label>
            <span className={`text-xs font-medium ${getCharacterCountColor(getCharacterCount(seoData.seo_title), 50, 60)}`}>
              {getCharacterCount(seoData.seo_title)}/60 caracteres
            </span>
          </div>
          <input
            type="text"
            id="seo_title"
            value={seoData.seo_title}
            onChange={(e) => handleInputChange('seo_title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Título que aparecerá en Google (50-60 caracteres)"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Incluye el nombre del modelo y marca para mejor SEO
          </p>
        </div>

        {/* SEO Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700">
              Meta Descripción *
            </label>
            <span className={`text-xs font-medium ${getCharacterCountColor(getCharacterCount(seoData.seo_description), 150, 160)}`}>
              {getCharacterCount(seoData.seo_description)}/160 caracteres
            </span>
          </div>
          <textarea
            id="seo_description"
            rows={3}
            value={seoData.seo_description}
            onChange={(e) => handleInputChange('seo_description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Descripción que aparecerá en Google (150-160 caracteres)"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Menciona especificaciones clave como velocidad, autonomía y precio
          </p>
        </div>

        {/* SEO Keywords */}
        <div>
          <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Palabras Clave
          </label>
          <input
            type="text"
            id="seo_keywords"
            value={seoData.seo_keywords}
            onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="palabra1, palabra2, palabra3"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Separa las palabras clave con comas. Incluye modelo, marca y términos relacionados
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
          <p className="mt-1 text-xs text-gray-500">
            💡 URL oficial de esta página del modelo (se genera automáticamente)
          </p>
        </div>

        {/* Meta Robots */}
        <div>
          <label htmlFor="seo_robots" className="block text-sm font-medium text-gray-700 mb-2">
            Directiva de Robots
          </label>
          <select
            id="seo_robots"
            value={seoData.seo_robots}
            onChange={(e) => handleInputChange('seo_robots', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {ROBOTS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            💡 Controla cómo los motores de búsqueda indexan esta página
          </p>
        </div>
      </div>

      {/* OpenGraph / Redes Sociales */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Redes Sociales (OpenGraph)</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Optimiza para compartir en redes</span>
          </div>
        </div>

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
            placeholder="Título atractivo para Facebook, Twitter, etc."
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Puede ser diferente al título SEO, más atractivo para redes sociales
          </p>
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
            placeholder="Descripción atractiva para cuando se comparta en redes sociales"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Describe las características más atractivas del modelo
          </p>
        </div>

        {/* OG Image */}
        <div>
          <label htmlFor="og_image_url" className="block text-sm font-medium text-gray-700 mb-2">
            Imagen para Redes Sociales
          </label>
          <input
            type="url"
            id="og_image_url"
            value={seoData.og_image_url}
            onChange={(e) => handleInputChange('og_image_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="URL de la imagen (se usa la imagen del modelo por defecto)"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Imagen que aparecerá cuando se comparta en Facebook, Twitter, etc. (1200x630px recomendado)
          </p>
          
          {/* Image Preview */}
          {seoData.og_image_url && (
            <div className="mt-3">
              <div className="relative w-32 h-16 border border-gray-200 rounded overflow-hidden">
                <Image
                  src={seoData.og_image_url}
                  alt="Vista previa OG"
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
                {imageError && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Error</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
