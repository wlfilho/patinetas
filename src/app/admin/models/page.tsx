'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { modelService, brandService, ModeloPatineta, MarcaPatineta } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminModelsPage() {
  const [models, setModels] = useState<ModeloPatineta[]>([])
  const [brands, setBrands] = useState<MarcaPatineta[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')

  const loadModels = useCallback(async () => {
    try {
      setLoading(true)
      const data = await modelService.getAll(true) // Include inactive models for admin
      setModels(data)
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadBrands = useCallback(async () => {
    try {
      const data = await brandService.getAll(true) // Include inactive brands for admin
      setBrands(data)
    } catch (error) {
      console.error('Error loading brands:', error)
    }
  }, [])

  useEffect(() => {
    loadModels()
    loadBrands()
  }, [loadModels, loadBrands])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await modelService.softDelete(id)
      } else {
        await modelService.reactivate(id)
      }
      await loadModels()
    } catch (error) {
      console.error('Error toggling model status:', error)
      alert('Error al cambiar el estado del modelo')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar permanentemente el modelo "${name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await modelService.hardDelete(id)
      await loadModels()
    } catch (error) {
      console.error('Error deleting model:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar el modelo')
    }
  }

  const filteredModels = models.filter(model => {
    // Status filter
    if (filter === 'active' && !model.activo) return false
    if (filter === 'inactive' && model.activo) return false
    
    // Brand filter
    if (brandFilter !== 'all' && model.marca_id !== brandFilter) return false
    
    return true
  })

  const stats = {
    total: models.length,
    active: models.filter(m => m.activo).length,
    inactive: models.filter(m => !m.activo).length,
    available: models.filter(m => m.disponible_colombia).length
  }

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return '-'
    if (min && max && min !== max) {
      return `$${min.toLocaleString('es-CO')} - $${max.toLocaleString('es-CO')}`
    }
    return `$${(min || max)?.toLocaleString('es-CO')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando modelos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Modelos</h1>
          <p className="mt-2 text-gray-600">Administra los modelos de patinetas eléctricas</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/models/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Modelo
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Modelos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modelos Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modelos Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles en Colombia</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.available}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos los modelos</option>
              <option value="active">Solo activos</option>
              <option value="inactive">Solo inactivos</option>
            </select>
            
            <label className="text-sm font-medium text-gray-700">Filtrar por marca:</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Mostrando {filteredModels.length} de {models.length} modelos
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especificaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio (COP)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModels.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {model.imagen_url ? (
                        <Image
                          src={model.imagen_url}
                          alt={model.nombre}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-contain mr-4 rounded-lg"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-sm">
                            {model.nombre.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{model.nombre}</div>
                        {model.descripcion && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {model.descripcion}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {model.marca?.logo_url ? (
                        <Image
                          src={model.marca.logo_url}
                          alt={model.marca.nombre}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain mr-2"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center mr-2">
                          <span className="text-gray-600 font-bold text-xs">
                            {model.marca?.nombre.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-900">{model.marca?.nombre || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {model.velocidad_maxima && (
                        <div>Vel: {model.velocidad_maxima} km/h</div>
                      )}
                      {model.autonomia && (
                        <div>Aut: {model.autonomia} km</div>
                      )}
                      {model.peso && (
                        <div>Peso: {model.peso} kg</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(model.precio_min, model.precio_max)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {model.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model.disponible_colombia
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {model.disponible_colombia ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/models/${model.id}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(model.id, model.activo)}
                      className={`${
                        model.activo
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {model.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDelete(model.id, model.nombre)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay modelos</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' && brandFilter === 'all'
                ? 'No hay modelos registrados en el sistema.'
                : 'No hay modelos que coincidan con los filtros seleccionados.'
              }
            </p>
            <Link
              href="/admin/models/new"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Primer Modelo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
