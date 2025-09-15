'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { brandService, MarcaPatineta, uploadService } from '@/lib/supabase'
import FileUpload from '@/components/ui/FileUpload'
import BrandSEOManager, { SEOFormData } from '@/components/admin/BrandSEOManager'
import SocialMediaPreview from '@/components/admin/SocialMediaPreview'
import Link from 'next/link'

export default function EditBrandPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [brand, setBrand] = useState<MarcaPatineta | null>(null)
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

  const loadBrand = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const brandData = await brandService.getById(id)
      setBrand(brandData)
      setFormData({
        nombre: brandData.nombre,
        descripcion: brandData.descripcion || '',
        logo_url: brandData.logo_url || '',
        pais_origen: brandData.pais_origen || '',
        sitio_web: brandData.sitio_web || '',
        activo: brandData.activo,
        orden: brandData.orden
      })

      // Initialize SEO data
      setSeoData({
        seo_title: brandData.seo_title || '',
        seo_description: brandData.seo_description || '',
        seo_keywords: brandData.seo_keywords || '',
        seo_canonical_url: brandData.seo_canonical_url || '',
        seo_robots: brandData.seo_robots || 'index,follow',
        og_title: brandData.og_title || '',
        og_description: brandData.og_description || '',
        og_image_url: brandData.og_image_url || '',
      })
    } catch (error) {
      console.error('Error loading brand:', error)
      alert('Error al cargar la marca')
      router.push('/admin/brands')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (params.id) {
      loadBrand(params.id as string)
    }
  }, [params.id, loadBrand])

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

    if (!brand) return

    try {
      setSaving(true)

      // If logo URL changed and old logo exists, delete old logo
      if (brand.logo_url && brand.logo_url !== formData.logo_url && formData.logo_url) {
        await uploadService.deleteBrandLogo(brand.logo_url)
      }

      // Combine basic form data with SEO data
      const updateData = {
        ...formData,
        ...seoData
      }

      await brandService.update(brand.id, updateData)
      router.push('/admin/brands')
    } catch (error) {
      console.error('Error updating brand:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar la marca')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!brand) return

    if (!confirm(`¿Estás seguro de que quieres eliminar permanentemente la marca "${brand.nombre}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await brandService.hardDelete(brand.id)
      router.push('/admin/brands')
    } catch (error) {
      console.error('Error deleting brand:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar la marca')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando marca...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marca no encontrada</h1>
        <p className="text-gray-600 mb-6">La marca que buscas no existe o no tienes permisos para editarla.</p>
        <Link
          href="/admin/brands"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Volver a Marcas
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Marca</h1>
          <p className="mt-2 text-gray-600">Modifica la información de {brand.nombre}</p>
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
                brandId={brand?.id}
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
              <BrandSEOManager
                brand={brand}
                onSEODataChange={handleSEODataChange}
              />

              {showSEOPreview && (
                <SocialMediaPreview
                  seoData={seoData}
                  brandName={brand.nombre}
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
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando Cambios...
                </div>
              ) : uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subiendo Logo...
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
            <Link
              href="/admin/brands"
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar Marca
            </button>
          </div>
        </form>
      </div>

      {/* Brand Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Marca</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">ID:</span>
            <span className="ml-2 text-gray-600">{brand.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Fecha de creación:</span>
            <span className="ml-2 text-gray-600">
              {brand.created_at ? new Date(brand.created_at).toLocaleString('es-CO') : 'No disponible'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Última actualización:</span>
            <span className="ml-2 text-gray-600">
              {brand.updated_at ? new Date(brand.updated_at).toLocaleString('es-CO') : 'No disponible'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Estado:</span>
            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
              brand.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {brand.activo ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
