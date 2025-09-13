'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminService, categoryService, CategoriaPatineta } from '@/lib/supabase'
import { NegocioDirectorio } from '@/lib/supabase'
import { DEPARTAMENTOS_COLOMBIA, CIUDADES_POR_DEPARTAMENTO } from '@/types'



interface EditBusinessPageProps {
  params: { id: string }
}

export default function EditBusinessPage({ params }: EditBusinessPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<NegocioDirectorio | null>(null)
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
    horario_atencion: '',
    servicios: [] as string[],
    imagen_url: '',
    activo: true
  })

  const [servicioInput, setServicioInput] = useState('')

  useEffect(() => {
    loadBusiness()
    loadCategories()
  }, [params.id])

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      const data = await categoryService.getAll(false) // Only active categories
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const loadBusiness = async () => {
    try {
      setLoading(true)
      const businesses = await adminService.getAllForAdmin()
      const foundBusiness = businesses.find(b => b.id === parseInt(params.id))
      
      if (!foundBusiness) {
        setError('Negocio no encontrado')
        return
      }

      setBusiness(foundBusiness)
      setFormData({
        nombre: foundBusiness.nombre,
        descripcion: foundBusiness.descripcion || '',
        categoria: foundBusiness.categoria,
        category_id: foundBusiness.category_id || '',
        telefono: foundBusiness.telefono || '',
        email: foundBusiness.email || '',
        direccion: foundBusiness.direccion || '',
        ciudad: foundBusiness.ciudad,
        departamento: foundBusiness.departamento,
        sitio_web: foundBusiness.sitio_web || '',
        whatsapp: foundBusiness.whatsapp || '',
        instagram: foundBusiness.instagram || '',
        facebook: foundBusiness.facebook || '',
        horario_atencion: foundBusiness.horario_atencion || '',
        servicios: foundBusiness.servicios || [],
        imagen_url: foundBusiness.imagen_url || '',
        activo: foundBusiness.activo
      })
    } catch (err) {
      setError('Error loading business')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))

      // Reset ciudad when departamento changes
      if (name === 'departamento') {
        setFormData(prev => ({ ...prev, ciudad: '' }))
      }

      // Update category_id when categoria changes
      if (name === 'categoria') {
        const selectedCategory = categories.find(cat => cat.nombre === value)
        setFormData(prev => ({
          ...prev,
          category_id: selectedCategory?.id || ''
        }))
      }
    }
  }

  const addServicio = () => {
    if (servicioInput.trim() && !formData.servicios.includes(servicioInput.trim())) {
      setFormData(prev => ({
        ...prev,
        servicios: [...prev.servicios, servicioInput.trim()]
      }))
      setServicioInput('')
    }
  }

  const removeServicio = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.filter(s => s !== servicio)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!business) return

    // Validation
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (!formData.categoria) {
      setError('La categoría es requerida')
      return
    }
    if (!formData.ciudad) {
      setError('La ciudad es requerida')
      return
    }
    if (!formData.departamento) {
      setError('El departamento es requerido')
      return
    }

    try {
      setSaving(true)
      setError(null)
      
      const updates = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        categoria: formData.categoria,
        telefono: formData.telefono.trim() || undefined,
        email: formData.email.trim() || undefined,
        direccion: formData.direccion.trim() || undefined,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        sitio_web: formData.sitio_web.trim() || undefined,
        whatsapp: formData.whatsapp.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        facebook: formData.facebook.trim() || undefined,
        horario_atencion: formData.horario_atencion.trim() || undefined,
        servicios: formData.servicios,
        imagen_url: formData.imagen_url.trim() || undefined,
        activo: formData.activo
      }

      await adminService.updateBusiness(business.id, updates)
      router.push('/admin/businesses')
    } catch (err) {
      setError('Error al actualizar el negocio')
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!business) return
    
    if (!confirm('¿Estás seguro de que quieres desactivar este negocio?')) {
      return
    }

    try {
      await adminService.deleteBusiness(business.id)
      router.push('/admin/businesses')
    } catch (err) {
      setError('Error al desactivar el negocio')
      console.error('Error:', err)
    }
  }

  const ciudadesDisponibles = formData.departamento 
    ? CIUDADES_POR_DEPARTAMENTO[formData.departamento as keyof typeof CIUDADES_POR_DEPARTAMENTO] || []
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !business) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <Link href="/admin/businesses" className="text-primary hover:text-primary-dark mt-2 inline-block">
          ← Volver a la lista
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/admin" className="hover:text-primary">Admin</Link>
          <span>/</span>
          <Link href="/admin/businesses" className="hover:text-primary">Negocios</Link>
          <span>/</span>
          <span>Editar</span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Negocio</h1>
            <p className="text-gray-600">Actualiza la información del negocio</p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Desactivar Negocio
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                disabled={categoriesLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
              >
                <option value="">
                  {categoriesLoading ? 'Cargando categorías...' : 'Seleccionar categoría'}
                </option>
                {categories.map(categoria => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.icono} {categoria.nombre}
                  </option>
                ))}
              </select>
              {categories.length === 0 && !categoriesLoading && (
                <p className="text-sm text-red-600 mt-1">
                  No hay categorías disponibles.
                  <Link href="/admin/categories/new" className="text-primary hover:text-primary-dark ml-1">
                    Crear una nueva categoría
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Describe el negocio y sus servicios..."
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Seleccionar departamento</option>
                {DEPARTAMENTOS_COLOMBIA.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <select
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required
                disabled={!formData.departamento}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
              >
                <option value="">Seleccionar ciudad</option>
                {ciudadesDisponibles.map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Calle, carrera, número..."
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Negocio activo</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            href="/admin/businesses"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Actualizar Negocio'}
          </button>
        </div>
      </form>
    </div>
  )
}
