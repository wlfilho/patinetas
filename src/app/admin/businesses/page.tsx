'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminService } from '@/lib/supabase'
import { NegocioDirectorio } from '@/lib/supabase'

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    loadBusinesses()
  }, [])

  useEffect(() => {
    filterBusinesses()
  }, [businesses, searchTerm, statusFilter, categoryFilter])

  const loadBusinesses = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllForAdmin()
      setBusinesses(data)
    } catch (err) {
      setError('Error loading businesses')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterBusinesses = () => {
    let filtered = businesses

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(b => 
        b.nombre.toLowerCase().includes(term) ||
        b.descripcion?.toLowerCase().includes(term) ||
        b.ciudad.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(b => b.activo)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(b => !b.activo)
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(b => b.categoria === categoryFilter)
    }

    setFilteredBusinesses(filtered)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este negocio?')) {
      return
    }

    try {
      await adminService.deleteBusiness(id)
      await loadBusinesses()
    } catch (err) {
      alert('Error al desactivar el negocio')
      console.error('Error:', err)
    }
  }

  const handleReactivate = async (id: number) => {
    try {
      await adminService.reactivateBusiness(id)
      await loadBusinesses()
    } catch (err) {
      alert('Error al reactivar el negocio')
      console.error('Error:', err)
    }
  }

  const categories = [...new Set(businesses.map(b => b.categoria))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Negocios</h1>
          <p className="text-gray-600">Administra todos los negocios del directorio</p>
        </div>
        <Link
          href="/admin/businesses/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="mr-2">➕</span>
          Agregar Negocio
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, descripción, ciudad..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCategoryFilter('')
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredBusinesses.length} de {businesses.length} negocios
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredBusinesses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Negocio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{business.nombre}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {business.descripcion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.ciudad}, {business.departamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        business.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(business.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/businesses/${business.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        Editar
                      </Link>
                      {business.activo ? (
                        <button
                          onClick={() => handleDelete(business.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(business.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron negocios con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
