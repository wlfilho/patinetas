'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { modelService, brandService, MarcaPatineta, ModeloPatineta } from '@/lib/supabase'
import Link from 'next/link'
import ModelImageUpload from '@/components/admin/ModelImageUpload'
import ModelSEOManager, { ModelSEOFormData } from '@/components/admin/ModelSEOManager'
import ModelSocialMediaPreview from '@/components/admin/ModelSocialMediaPreview'
import ModelSpecificationsManager from '@/components/admin/ModelSpecificationsManager'
import { EspecificacionesTecnicas, createEmptyEspecificaciones } from '@/types/especificaciones'

interface EditModelPageProps {
  params: Promise<{ id: string }>
}

export default function EditModelPage({ params }: EditModelPageProps) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [model, setModel] = useState<ModeloPatineta | null>(null)
  const [brands, setBrands] = useState<MarcaPatineta[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'seo'>('basic')
  const [showSEOPreview, setShowSEOPreview] = useState(false)
  const [especificaciones, setEspecificaciones] = useState<EspecificacionesTecnicas>(
    createEmptyEspecificaciones()
  )
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
  const [formData, setFormData] = useState({
    marca_id: '',
    nombre: '',
    descripcion: '',
    imagen_url: '',
    velocidad_maxima: '',
    autonomia: '',
    peso: '',
    potencia: '',
    tiempo_carga: '',
    precio_min: '',
    precio_max: '',
    disponible_colombia: true,
    activo: true,
    orden: 0
  })

  // Resolve params
  useEffect(() => {
    params.then(resolvedParams => {
      setId(resolvedParams.id)
    })
  }, [params])

  const loadModel = useCallback(async (modelId: string) => {
    try {
      const data = await modelService.getById(modelId)
      setModel(data)
      
      // Populate form with model data
      setFormData({
        marca_id: data.marca_id,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        imagen_url: data.imagen_url || '',
        velocidad_maxima: data.velocidad_maxima?.toString() || '',
        autonomia: data.autonomia?.toString() || '',
        peso: data.peso?.toString() || '',
        potencia: data.potencia?.toString() || '',
        tiempo_carga: data.tiempo_carga?.toString() || '',
        precio_min: data.precio_min?.toString() || '',
        precio_max: data.precio_max?.toString() || '',
        disponible_colombia: data.disponible_colombia,
        activo: data.activo,
        orden: data.orden
      })

      // Populate specifications data
      if (data.especificaciones) {
        setEspecificaciones(data.especificaciones as EspecificacionesTecnicas)
      }

      // Populate SEO data
      setSeoData({
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || '',
        seo_canonical_url: data.seo_canonical_url || '',
        seo_robots: data.seo_robots || 'index,follow',
        og_title: data.og_title || '',
        og_description: data.og_description || '',
        og_image_url: data.og_image_url || '',
      })
    } catch (error) {
      console.error('Error loading model:', error)
      alert('Error al cargar el modelo')
      router.push('/admin/models')
    }
  }, [router])

  const loadBrands = useCallback(async () => {
    try {
      const data = await brandService.getAll(true) // Include inactive brands for admin
      setBrands(data)
    } catch (error) {
      console.error('Error loading brands:', error)
    }
  }, [])

  useEffect(() => {
    if (id) {
      Promise.all([loadModel(id), loadBrands()]).finally(() => {
        setLoading(false)
      })
    }
  }, [id, loadModel, loadBrands])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleUploadStart = () => {
    setUploading(true)
  }

  const handleUploadComplete = (url: string) => {
    setFormData(prev => ({ ...prev, imagen_url: url }))
    setUploading(false)
  }

  const handleUploadError = (error: string) => {
    setUploading(false)
    alert(`Error al subir la imagen: ${error}`)
  }

  const handleSEODataChange = useCallback((newSeoData: ModelSEOFormData) => {
    setSeoData(newSeoData)
  }, [])

  const handleSpecificationsChange = useCallback((newSpecs: EspecificacionesTecnicas) => {
    setEspecificaciones(newSpecs)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.marca_id || !formData.nombre) {
      alert('Por favor completa los campos obligatorios (Marca y Nombre)')
      return
    }

    try {
      setSaving(true)

      // Convert string numbers to actual numbers and include SEO data and specifications
      const updates: Partial<Omit<ModeloPatineta, 'id' | 'created_at' | 'updated_at' | 'marca'>> = {
        marca_id: formData.marca_id,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        imagen_url: formData.imagen_url.trim() || undefined,
        velocidad_maxima: formData.velocidad_maxima ? parseFloat(formData.velocidad_maxima) : undefined,
        autonomia: formData.autonomia ? parseFloat(formData.autonomia) : undefined,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        potencia: formData.potencia ? parseFloat(formData.potencia) : undefined,
        tiempo_carga: formData.tiempo_carga ? parseFloat(formData.tiempo_carga) : undefined,
        precio_min: formData.precio_min ? parseFloat(formData.precio_min) : undefined,
        precio_max: formData.precio_max ? parseFloat(formData.precio_max) : undefined,
        disponible_colombia: formData.disponible_colombia,
        activo: formData.activo,
        orden: formData.orden,
        // Technical specifications
        especificaciones: especificaciones,
        // SEO fields
        seo_title: seoData.seo_title.trim() || undefined,
        seo_description: seoData.seo_description.trim() || undefined,
        seo_keywords: seoData.seo_keywords.trim() || undefined,
        seo_canonical_url: seoData.seo_canonical_url.trim() || undefined,
        seo_robots: seoData.seo_robots || 'index,follow',
        og_title: seoData.og_title.trim() || undefined,
        og_description: seoData.og_description.trim() || undefined,
        og_image_url: seoData.og_image_url.trim() || undefined,
      }

      await modelService.update(id, updates)
      router.push('/admin/models')
    } catch (error) {
      console.error('Error updating model:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar el modelo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando modelo...</p>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Modelo no encontrado</h3>
        <p className="text-gray-600 mb-4">El modelo que buscas no existe o ha sido eliminado.</p>
        <Link
          href="/admin/models"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Volver a Modelos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Modelo</h1>
          <p className="mt-2 text-gray-600">
            Editando: <span className="font-medium">{model.nombre}</span>
            {model.marca && <span className="text-gray-400"> - {model.marca.nombre}</span>}
          </p>
        </div>
        <Link
          href="/admin/models"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Modelos
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
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ficha Técnica
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
          <div className="space-y-6">

          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="marca_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <select
                  id="marca_id"
                  name="marca_id"
                  value={formData.marca_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Selecciona una marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Modelo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Mi Electric Scooter Pro 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Descripción detallada del modelo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Modelo
                </label>
                <ModelImageUpload
                  onUploadStart={handleUploadStart}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  currentImageUrl={formData.imagen_url}
                  modelId={model.id}
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="velocidad_maxima" className="block text-sm font-medium text-gray-700 mb-2">
                  Velocidad Máxima (km/h)
                </label>
                <input
                  type="number"
                  id="velocidad_maxima"
                  name="velocidad_maxima"
                  value={formData.velocidad_maxima}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="autonomia" className="block text-sm font-medium text-gray-700 mb-2">
                  Autonomía (km)
                </label>
                <input
                  type="number"
                  id="autonomia"
                  name="autonomia"
                  value={formData.autonomia}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="12.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="potencia" className="block text-sm font-medium text-gray-700 mb-2">
                  Potencia (W)
                </label>
                <input
                  type="number"
                  id="potencia"
                  name="potencia"
                  value={formData.potencia}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  placeholder="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="tiempo_carga" className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de Carga (horas)
                </label>
                <input
                  type="number"
                  id="tiempo_carga"
                  name="tiempo_carga"
                  value={formData.tiempo_carga}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="3.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precios (COP)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="precio_min" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Mínimo
                </label>
                <input
                  type="number"
                  id="precio_min"
                  name="precio_min"
                  value={formData.precio_min}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  placeholder="1500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="precio_max" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Máximo
                </label>
                <input
                  type="number"
                  id="precio_max"
                  name="precio_max"
                  value={formData.precio_max}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  placeholder="2000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Status and Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado y Configuración</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orden" className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de Visualización
                </label>
                <input
                  type="number"
                  id="orden"
                  name="orden"
                  value={formData.orden}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Número menor = aparece primero en la lista
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="disponible_colombia"
                    name="disponible_colombia"
                    checked={formData.disponible_colombia}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="disponible_colombia" className="ml-2 block text-sm text-gray-700">
                    Disponible en Colombia
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                    Modelo activo
                  </label>
                </div>
              </div>
            </div>
          </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6">
              <ModelSpecificationsManager
                initialData={especificaciones}
                onChange={handleSpecificationsChange}
              />
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <ModelSEOManager
                model={model}
                onSEODataChange={handleSEODataChange}
              />

              {showSEOPreview && (
                <ModelSocialMediaPreview
                  seoData={seoData}
                  modelName={model.nombre}
                  brandName={model.marca?.nombre}
                />
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowSEOPreview(!showSEOPreview)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showSEOPreview ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
                </button>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/models"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subiendo imagen...
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  )
}
