'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { adminService } from '@/lib/supabase'
import { NegocioDirectorio } from '@/lib/supabase'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<NegocioDirectorio[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    loadBusinesses()
  }, [])

  useEffect(() => {
    filterBusinesses()
  }, [businesses, searchTerm, statusFilter, categoryFilter, cityFilter])

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
        b.nombre?.toLowerCase().includes(term) ||
        b.descripcion?.toLowerCase().includes(term) ||
        b.ciudad?.toLowerCase().includes(term)
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

    // City filter
    if (cityFilter) {
      filtered = filtered.filter(b => b.ciudad === cityFilter)
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

  const handleStatusToggle = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // If currently active, deactivate (with confirmation)
        if (!confirm('¿Estás seguro de que quieres desactivar este negocio?')) {
          return
        }
        await adminService.deleteBusiness(id)
      } else {
        // If currently inactive, reactivate
        await adminService.reactivateBusiness(id)
      }
      await loadBusinesses()
    } catch (err) {
      alert(`Error al ${currentStatus ? 'desactivar' : 'reactivar'} el negocio`)
      console.error('Error:', err)
    }
  }

  const categories = [...new Set(businesses.map(b => b.categoria))].sort()
  const cities = [...new Set(businesses.map(b => b.ciudad).filter(Boolean))].sort()

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

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <select
              id="city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCategoryFilter('')
                setCityFilter('')
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
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
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {business.imagen_url ? (
                            <Image
                              src={business.imagen_url}
                              alt={`Logo de ${business.nombre}`}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{business.nombre || 'Sin nombre'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.categoria || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.ciudad || 'Sin ciudad'}{business.departamento ? `, ${business.departamento}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ToggleSwitch
                        checked={business.activo}
                        onChange={() => handleStatusToggle(business.id, business.activo)}
                        size="sm"
                        activeLabel="Desactivar negocio"
                        inactiveLabel="Activar negocio"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                        {/* Edit Icon */}
                        <Link
                          href={`/admin/businesses/${business.id}`}
                          className="text-primary hover:text-primary-dark transition-colors p-1 rounded-md hover:bg-primary/10"
                          title="Editar negocio"
                          aria-label="Editar negocio"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>

                        {/* Public View Icon */}
                        {business.ciudad && business.nombre && (
                          <Link
                            href={`/negocio/${business.ciudad.toLowerCase()}/${business.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                            title="Ver página pública"
                            aria-label="Ver página pública del negocio"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        )}

                        {/* Delete Icon */}
                        <button
                          onClick={() => handleDelete(business.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                          title={business.activo ? "Desactivar negocio" : "Eliminar negocio"}
                          aria-label={business.activo ? "Desactivar negocio" : "Eliminar negocio"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
