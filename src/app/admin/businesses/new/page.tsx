'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminService, categoryService, CategoriaPatineta } from '@/lib/supabase'
import { DEPARTAMENTOS_COLOMBIA, CIUDADES_POR_DEPARTAMENTO } from '@/types'
import BusinessHoursManager from '@/components/admin/BusinessHoursManager'
import BusinessImageUpload from '@/components/admin/BusinessImageUpload'
import { ESPECIALIDADES_NEGOCIO } from '@/constants/especialidades'

export default function NewBusinessPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoriaPatineta[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    category_id: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    sitio_web: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    google_business_url: '',
    numero_resenhas: 0,
    valoracion: 0,
    horario_atencion: '',
    horarios_funcionamento: '',
    servicios: [] as string[],
    outras_especialidades: [] as string[],
    imagen_url: '',
    activo: true
  })

  // Load categories
  useState(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const data = await categoryService.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Error loading categories:', error)
        setError('Error al cargar las categorías')
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  })

  // Memoized callback for BusinessHoursManager to prevent infinite re-renders
  const handleBusinessHoursChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, horarios_funcionamento: value }))
  }, [])

  // Handler for business image upload
  const handleImageUpload = useCallback((imageUrl: string) => {
    setFormData(prev => ({ ...prev, imagen_url: imageUrl }))
  }, [])

  const toggleEspecialidade = (especialidadeId: string) => {
    setFormData(prev => {
      const isSelected = prev.outras_especialidades.includes(especialidadeId)
      return {
        ...prev,
        outras_especialidades: isSelected
          ? prev.outras_especialidades.filter(e => e !== especialidadeId)
          : [...prev.outras_especialidades, especialidadeId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const businessData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        category_id: formData.category_id || undefined,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        sitio_web: formData.sitio_web,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        facebook: formData.facebook,
        youtube: formData.youtube,
        tiktok: formData.tiktok,
        google_business_url: formData.google_business_url,
        numero_resenhas: formData.numero_resenhas,
        valoracion: formData.valoracion,
        horario_atencion: formData.horario_atencion,
        horarios_funcionamento: formData.horarios_funcionamento,
        servicios: formData.servicios,
        outras_especialidades: formData.outras_especialidades,
        imagen_url: formData.imagen_url,
        activo: formData.activo
      }

      const newBusiness = await adminService.createBusiness(businessData)
      router.push(`/admin/businesses/${newBusiness.id}`)
    } catch (error) {
      console.error('Error creating business:', error)
      setError('Error al crear el negocio')
    } finally {
      setSaving(false)
    }
  }

  const availableCities = formData.departamento 
    ? CIUDADES_POR_DEPARTAMENTO[formData.departamento] || []
    : []

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Negocio</h1>
            <p className="mt-1 text-sm text-gray-600">
              Agrega un nuevo negocio al directorio
            </p>
          </div>
          <Link
            href="/admin/businesses"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Volver
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información Básica</h2>
            <p className="mt-1 text-sm text-gray-600">Datos principales del negocio</p>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  value={formData.category_id}
                  onChange={(e) => {
                    const selectedCategory = categories.find(cat => cat.id === e.target.value)
                    setFormData(prev => ({ 
                      ...prev, 
                      category_id: e.target.value,
                      categoria: selectedCategory?.nombre || ''
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe los servicios y características del negocio..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Negocio
              </label>
              <BusinessImageUpload
                currentImageUrl={formData.imagen_url}
                onUploadComplete={handleImageUpload}
                onUploadError={(error) => {
                  console.error('Error uploading business image:', error)
                  // You could add a toast notification here
                }}
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Ubicación</h2>
            <p className="mt-1 text-sm text-gray-600">Información de localización del negocio</p>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  id="departamento"
                  value={formData.departamento}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    departamento: e.target.value,
                    ciudad: '' // Reset city when department changes
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {DEPARTAMENTOS_COLOMBIA.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <select
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData(prev => ({ ...prev, ciudad: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={!formData.departamento}
                >
                  <option value="">Seleccionar ciudad</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Calle 123 #45-67, Barrio Centro"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información de Contacto</h2>
            <p className="mt-1 text-sm text-gray-600">Datos de contacto del negocio</p>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contacto@negocio.com"
                />
              </div>

              <div>
                <label htmlFor="sitio_web" className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web
                </label>
                <input
                  type="url"
                  id="sitio_web"
                  value={formData.sitio_web}
                  onChange={(e) => setFormData(prev => ({ ...prev, sitio_web: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://www.negocio.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Redes Sociales</h2>
            <p className="mt-1 text-sm text-gray-600">Enlaces a redes sociales del negocio</p>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://instagram.com/negocio"
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://facebook.com/negocio"
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  id="youtube"
                  value={formData.youtube}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtube: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://youtube.com/@negocio"
                />
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  id="tiktok"
                  value={formData.tiktok}
                  onChange={(e) => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://tiktok.com/@negocio"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Google Business Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información de Google Business</h2>
            <p className="mt-1 text-sm text-gray-600">Datos del perfil de Google Business</p>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div>
              <label htmlFor="google_business_url" className="block text-sm font-medium text-gray-700 mb-2">
                URL de Google Business
              </label>
              <input
                type="url"
                id="google_business_url"
                value={formData.google_business_url}
                onChange={(e) => setFormData(prev => ({ ...prev, google_business_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="numero_resenhas" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Reseñas
                </label>
                <input
                  type="number"
                  id="numero_resenhas"
                  min="0"
                  value={formData.numero_resenhas}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero_resenhas: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="valoracion" className="block text-sm font-medium text-gray-700 mb-2">
                  Valoración Promedio
                </label>
                <input
                  type="number"
                  id="valoracion"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.valoracion}
                  onChange={(e) => setFormData(prev => ({ ...prev, valoracion: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Horarios de Funcionamiento</h2>
            <p className="mt-1 text-sm text-gray-600">Configura los horarios de atención del negocio</p>
          </div>
          <div className="px-6 py-6">
            <BusinessHoursManager
              value={formData.horarios_funcionamento}
              onChange={handleBusinessHoursChange}
            />
          </div>
        </div>

        {/* Outras Especialidades Section */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Otras Especialidades</h2>
            <p className="mt-1 text-sm text-gray-600">Selecciona las especialidades adicionales que ofrece el negocio</p>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ESPECIALIDADES_NEGOCIO.map((especialidade) => {
                const isSelected = formData.outras_especialidades.includes(especialidade.id)
                return (
                  <div
                    key={especialidade.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      toggleEspecialidade(especialidade.id)
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{especialidade.icono}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              toggleEspecialidade(especialidade.id)
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <h3 className="text-sm font-medium text-gray-900 leading-tight">
                            {especialidade.nombre}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {especialidade.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {formData.outras_especialidades.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Especialidades Seleccionadas ({formData.outras_especialidades.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.outras_especialidades.map((especialidadeId) => {
                    const especialidade = ESPECIALIDADES_NEGOCIO.find(e => e.id === especialidadeId)
                    if (!especialidade) return null
                    return (
                      <span
                        key={especialidadeId}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white"
                      >
                        {especialidade.icono} {especialidade.nombre}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/businesses"
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Creando...' : 'Crear Negocio'}
          </button>
        </div>
      </form>
    </div>
  )
}
