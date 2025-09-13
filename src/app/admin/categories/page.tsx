'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categoryService, CategoriaPatineta } from '@/lib/supabase'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoriaPatineta[]>([])
  const [businessCounts, setBusinessCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadCategories()
  }, [filter])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAll(true) // Include inactive for admin
      setCategories(data)

      // Load business counts for each category
      const counts: Record<string, number> = {}
      for (const category of data) {
        counts[category.id] = await categoryService.getBusinessCount(category.id)
      }
      setBusinessCounts(counts)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await categoryService.softDelete(id)
      } else {
        await categoryService.reactivate(id)
      }
      loadCategories()
    } catch (error) {
      console.error('Error toggling category status:', error)
      alert('Error al cambiar el estado de la categoría')
    }
  }

  const handleDelete = async (id: string) => {
    const businessCount = businessCounts[id] || 0
    
    if (businessCount > 0) {
      alert(`No se puede eliminar esta categoría porque ${businessCount} negocio(s) la están usando. Primero desactívala o reasigna los negocios.`)
      return
    }

    if (confirm('¿Estás seguro de que quieres eliminar permanentemente esta categoría?')) {
      try {
        await categoryService.hardDelete(id)
        loadCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Error al eliminar la categoría')
      }
    }
  }

  const filteredCategories = categories.filter(category => {
    if (filter === 'active') return category.activo
    if (filter === 'inactive') return !category.activo
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600">Administra las categorías disponibles para los negocios</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Nueva Categoría
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-primary">{categories.length}</div>
          <div className="text-sm text-gray-600">Total Categorías</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{categories.filter(c => c.activo).length}</div>
          <div className="text-sm text-gray-600">Activas</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{categories.filter(c => !c.activo).length}</div>
          <div className="text-sm text-gray-600">Inactivas</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas ({categories.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Activas ({categories.filter(c => c.activo).length})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === 'inactive'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Inactivas ({categories.filter(c => !c.activo).length})
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Negocios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icono}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.nombre}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {category.descripcion || 'Sin descripción'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {businessCounts[category.id] || 0} negocios
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(category.id, category.activo)}
                      className={`${
                        category.activo
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {category.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    {(businessCounts[category.id] || 0) === 0 && (
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No se encontraron categorías</div>
        </div>
      )}
    </div>
  )
}
