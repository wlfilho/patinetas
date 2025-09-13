'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { brandService } from '@/lib/supabase'
import FileUpload from '@/components/ui/FileUpload'
import Link from 'next/link'

export default function NewBrandPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    logo_url: '',
    pais_origen: '',
    sitio_web: '',
    activo: true,
    orden: 0
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
      await brandService.create(formData)
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

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
