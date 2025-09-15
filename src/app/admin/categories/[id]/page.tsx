'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { categoryService, CategoriaPatineta } from '@/lib/supabase'
import { generateCategorySlug, isValidSlug } from '@/lib/slugs'

const EMOJI_OPTIONS = [
  '🛴', '🔧', '⚙️', '📅', '🔬', '📦', '🏪', '🚚', '🎓', '🛡️',
  '⚡', '🔋', '🛠️', '🏭', '🚀', '💡', '🎯', '📱', '💻', '🌟'
]

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [businessCount, setBusinessCount] = useState(0)
  const [category, setCategory] = useState<CategoriaPatineta | null>(null)
  const [slugError, setSlugError] = useState('')
  const [slugChecking, setSlugChecking] = useState(false)
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: '🛴',
    activo: true,
    orden: 0,
    slug: ''
  })

  useEffect(() => {
    loadCategory()
  }, [params.id])

  const loadCategory = async () => {
    try {
      setInitialLoading(true)
      const [categoryData, count] = await Promise.all([
        categoryService.getById(params.id),
        categoryService.getBusinessCount(params.id)
      ])
      
      setCategory(categoryData)
      setBusinessCount(count)
      setFormData({
        nombre: categoryData.nombre,
        descripcion: categoryData.descripcion || '',
        icono: categoryData.icono || '🛴',
        activo: categoryData.activo,
        orden: categoryData.orden,
        slug: categoryData.slug || ''
      })
    } catch (error) {
      console.error('Error loading category:', error)
      alert('Error al cargar la categoría')
      router.push('/admin/categories')
    } finally {
      setInitialLoading(false)
    }
  }

  const validateSlug = async (slug: string) => {
    if (!slug.trim()) {
      setSlugError('El slug es requerido')
      return false
    }

    if (!isValidSlug(slug)) {
      setSlugError('El slug debe contener solo letras minúsculas, números y guiones')
      return false
    }

    setSlugChecking(true)
    try {
      const isAvailable = await categoryService.isSlugAvailable(slug, params.id)
      if (!isAvailable) {
        setSlugError('Este slug ya está en uso por otra categoría')
        return false
      }
      setSlugError('')
      return true
    } catch (error) {
      console.error('Error checking slug availability:', error)
      setSlugError('Error al verificar la disponibilidad del slug')
      return false
    } finally {
      setSlugChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      alert('El nombre de la categoría es requerido')
      return
    }

    // Validate slug
    const isSlugValid = await validateSlug(formData.slug)
    if (!isSlugValid) {
      return
    }

    try {
      setLoading(true)
      await categoryService.update(params.id, formData)
      router.push('/admin/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Error al actualizar la categoría')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseInt(value) || 0 : value
      }

      // Auto-generate slug when name changes and auto-generation is enabled
      if (name === 'nombre' && autoGenerateSlug) {
        newData.slug = generateCategorySlug(value)
        setSlugError('')
      }

      return newData
    })

    // Clear slug error when manually editing slug
    if (name === 'slug') {
      setSlugError('')
      setAutoGenerateSlug(false)
    }
  }

  const handleDelete = async () => {
    if (businessCount > 0) {
      alert(`No se puede eliminar esta categoría porque ${businessCount} negocio(s) la están usando.`)
      return
    }

    if (confirm('¿Estás seguro de que quieres eliminar permanentemente esta categoría?')) {
      try {
        await categoryService.hardDelete(params.id)
        router.push('/admin/categories')
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Error al eliminar la categoría')
      }
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Categoría no encontrada</div>
        <Link
          href="/admin/categories"
          className="text-primary hover:text-primary-dark mt-2 inline-block"
        >
          Volver a Categorías
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/categories"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver a Categorías
          </Link>
        </div>
        {businessCount === 0 && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Eliminar Categoría
          </button>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Categoría</h1>
        <p className="text-gray-600">
          Modifica los detalles de la categoría
          {businessCount > 0 && (
            <span className="text-orange-600 font-medium">
              {' '}• {businessCount} negocio(s) usando esta categoría
            </span>
          )}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Ej: Venta de Patinetas Eléctricas"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Descripción detallada de la categoría..."
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL amigable) *
            </label>
            <div className="space-y-2">
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  slugError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ej: venta-patinetas-electricas"
                required
              />
              {slugError && (
                <p className="text-sm text-red-600">{slugError}</p>
              )}
              {slugChecking && (
                <p className="text-sm text-blue-600">Verificando disponibilidad...</p>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoGenerateSlug"
                  checked={autoGenerateSlug}
                  onChange={(e) => {
                    setAutoGenerateSlug(e.target.checked)
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        slug: generateCategorySlug(prev.nombre)
                      }))
                      setSlugError('')
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="autoGenerateSlug" className="text-sm text-gray-600">
                  Generar automáticamente desde el nombre
                </label>
              </div>
              <div className="text-sm text-gray-500">
                <p className="mb-1">
                  <strong>Vista previa de la URL:</strong>
                </p>
                <p className="font-mono text-xs bg-gray-50 p-2 rounded border">
                  http://localhost:3000/directorio/{formData.slug || 'slug-de-categoria'}
                </p>
                <p className="mt-2 text-xs">
                  El slug debe contener solo letras minúsculas, números y guiones.
                  Se usa para crear URLs amigables para SEO.
                </p>
              </div>
            </div>
          </div>

          {/* Icono */}
          <div>
            <label htmlFor="icono" className="block text-sm font-medium text-gray-700 mb-2">
              Icono
            </label>
            <div className="grid grid-cols-10 gap-2 mb-3">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icono: emoji }))}
                  className={`p-2 text-2xl border rounded-md hover:bg-gray-50 ${
                    formData.icono === emoji
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input
              type="text"
              id="icono"
              name="icono"
              value={formData.icono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="O escribe tu propio emoji"
            />
          </div>

          {/* Orden */}
          <div>
            <label htmlFor="orden" className="block text-sm font-medium text-gray-700 mb-2">
              Orden de Visualización
            </label>
            <input
              type="number"
              id="orden"
              name="orden"
              value={formData.orden}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Número menor aparece primero. 0 = automático
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Categoría activa
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Las categorías inactivas no aparecen en los formularios públicos
            </p>
            {businessCount > 0 && !formData.activo && (
              <p className="text-sm text-orange-600 mt-1">
                ⚠️ Desactivar esta categoría afectará a {businessCount} negocio(s)
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Vista Previa</h3>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md bg-gray-50">
              <span className="text-2xl">{formData.icono}</span>
              <div>
                <div className="font-medium text-gray-900">
                  {formData.nombre || 'Nombre de la categoría'}
                </div>
                {formData.descripcion && (
                  <div className="text-sm text-gray-600">
                    {formData.descripcion}
                  </div>
                )}
              </div>
              <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${
                formData.activo
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.activo ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href="/admin/categories"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
