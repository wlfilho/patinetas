'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { brandService } from '@/lib/supabase'
import FileUpload from '@/components/ui/FileUpload'
import BrandSEOManager, { SEOFormData } from '@/components/admin/BrandSEOManager'
import SocialMediaPreview from '@/components/admin/SocialMediaPreview'
import Link from 'next/link'

export default function NewBrandPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'seo'>('basic')
  const [showSEOPreview, setShowSEOPreview] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    logo_url: '',
    pais_origen: '',
    sitio_web: '',
    activo: true,
    orden: 0
  })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleUploadStart = () => {
    setUploading(true)
  }

  const handleUploadComplete = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }))
    setUploading(false)
  }

  const handleUploadError = (error: string) => {
    setUploading(false)
    alert(`Error al subir la imagen: ${error}`)
  }

  const handleSEODataChange = useCallback((newSeoData: SEOFormData) => {
    setSeoData(newSeoData)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      alert('El nombre de la marca es obligatorio')
      return
    }

    if (uploading) {
      alert('Por favor espera a que termine la subida de la imagen')
      return
    }

    try {
      setLoading(true)
      // Combine basic form data with SEO data
      const createData = {
        ...formData,
        ...seoData
      }

      await brandService.create(createData)
      router.push('/admin/brands')
    } catch (error) {
      console.error('Error creating brand:', error)
      alert(error instanceof Error ? error.message : 'Error al crear la marca')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Marca</h1>
          <p className="mt-2 text-gray-600">Agrega una nueva marca de patinetas eléctricas</p>
        </div>
        <Link
          href="/admin/brands"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Volver a Marcas
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información Básica
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seo'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                SEO y Redes Sociales
              </div>
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Marca *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ej: Xiaomi, Segway, Razor"
              />
            </div>

            <div>
              <label htmlFor="pais_origen" className="block text-sm font-medium text-gray-700 mb-2">
                País de Origen
              </label>
              <input
                type="text"
                id="pais_origen"
                name="pais_origen"
                value={formData.pais_origen}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ej: China, Estados Unidos, Corea del Sur"
              />
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              value={formData.descripcion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Describe la marca, su historia, especialidades, etc."
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo de la Marca
              </label>
              <FileUpload
                onUploadStart={handleUploadStart}
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                currentImageUrl={formData.logo_url}
              />
            </div>
          </div>

          {/* Website URL */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="sitio_web" className="block text-sm font-medium text-gray-700 mb-2">
                Sitio Web Oficial
              </label>
              <input
                type="url"
                id="sitio_web"
                name="sitio_web"
                value={formData.sitio_web}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://www.marca.com"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="orden" className="block text-sm font-medium text-gray-700 mb-2">
                Orden de Visualización
              </label>
              <input
                type="number"
                id="orden"
                name="orden"
                min="0"
                value={formData.orden}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Número menor aparece primero (0 = primera posición)
              </p>
            </div>

            <div className="flex items-center">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Marca Activa
                </label>
                <p className="text-sm text-gray-500">
                  Las marcas activas aparecen en el catálogo público
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Create a temporary brand object for the SEO manager */}
              {formData.nombre && (
                <>
                  <BrandSEOManager
                    brand={{
                      id: 'new',
                      nombre: formData.nombre,
                      descripcion: formData.descripcion,
                      logo_url: formData.logo_url,
                      pais_origen: formData.pais_origen,
                      sitio_web: formData.sitio_web,
                      activo: formData.activo,
                      orden: formData.orden,
                      ...seoData
                    }}
                    onSEODataChange={handleSEODataChange}
                  />

                  {showSEOPreview && (
                    <SocialMediaPreview
                      seoData={seoData}
                      brandName={formData.nombre}
                    />
                  )}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowSEOPreview(!showSEOPreview)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {showSEOPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa Social'}
                    </button>
                  </div>
                </>
              )}

              {!formData.nombre && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Completa el nombre de la marca en la pestaña &quot;Información Básica&quot; para configurar el SEO
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando Marca...
                </div>
              ) : uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subiendo Logo...
                </div>
              ) : (
                'Crear Marca'
              )}
            </button>
            <Link
              href="/admin/brands"
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Consejos para Agregar Marcas</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Usa nombres oficiales de las marcas para mantener consistencia</li>
          <li>• Agrega una descripción detallada que destaque las características únicas de la marca</li>
          <li>• Incluye el país de origen para dar contexto a los usuarios</li>
          <li>• Usa logos de alta calidad en formato PNG o SVG para mejor visualización</li>
          <li>• El orden de visualización determina cómo aparecen las marcas en el catálogo</li>
        </ul>
      </div>
    </div>
  )
}
