'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { brandService, modelService, MarcaPatineta } from '@/lib/supabase'
import Link from 'next/link'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<MarcaPatineta[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [modelCounts, setModelCounts] = useState<Record<string, number>>({})

  const loadModelCounts = useCallback(async (brandIds: string[]) => {
    try {
      const counts: Record<string, number> = {}

      // Load model counts for each brand
      await Promise.all(
        brandIds.map(async (brandId) => {
          const models = await modelService.getByBrand(brandId)
          // Count only active models
          counts[brandId] = models.filter(model => model.activo).length
        })
      )

      setModelCounts(counts)
    } catch (error) {
      console.error('Error loading model counts:', error)
    }
  }, [])

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true)
      const data = await brandService.getAll(true) // Include inactive brands for admin
      setBrands(data)

      // Load model counts for all brands
      const brandIds = data.map(brand => brand.id)
      await loadModelCounts(brandIds)
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }, [loadModelCounts])

  useEffect(() => {
    loadBrands()
  }, [loadBrands])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await brandService.softDelete(id)
      } else {
        await brandService.reactivate(id)
      }
      await loadBrands()
    } catch (error) {
      console.error('Error toggling brand status:', error)
      alert('Error al cambiar el estado de la marca')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar permanentemente la marca "${name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await brandService.hardDelete(id)
      await loadBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar la marca')
    }
  }

  const filteredBrands = brands.filter(brand => {
    if (filter === 'active') return brand.activo
    if (filter === 'inactive') return !brand.activo
    return true
  })

  const stats = {
    total: brands.length,
    active: brands.filter(b => b.activo).length,
    inactive: brands.filter(b => !b.activo).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando marcas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Marcas</h1>
          <p className="mt-2 text-gray-600">Administra las marcas de patinetas eléctricas</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/brands/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Marca
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Total de Marcas</p>
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
              <p className="text-sm font-medium text-gray-600">Marcas Activas</p>
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
              <p className="text-sm font-medium text-gray-600">Marcas Inactivas</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
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
              <option value="all">Todas las marcas</option>
              <option value="active">Solo activas</option>
              <option value="inactive">Solo inactivas</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Mostrando {filteredBrands.length} de {brands.length} marcas
          </div>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Link
                        href={`/admin/brands/${brand.id}`}
                        className="flex-shrink-0 mr-4 transition-transform hover:scale-105"
                        title="Editar marca"
                        aria-label={`Editar marca ${brand.nombre}`}
                      >
                        {brand.logo_url ? (
                          <Image
                            src={brand.logo_url}
                            alt={brand.nombre}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain cursor-pointer"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center cursor-pointer">
                            <span className="text-white font-bold text-sm">
                              {brand.nombre.charAt(0)}
                            </span>
                          </div>
                        )}
                      </Link>
                      <div>
                        <Link
                          href={`/admin/brands/${brand.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary transition-colors cursor-pointer"
                          title="Editar marca"
                          aria-label={`Editar marca ${brand.nombre}`}
                        >
                          {brand.nombre}
                        </Link>
                        {brand.descripcion && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {brand.descripcion}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <ToggleSwitch
                      checked={brand.activo}
                      onChange={(checked) => handleToggleStatus(brand.id, brand.activo)}
                      activeLabel="Activar"
                      inactiveLabel="Desactivar"
                      size="md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                      {modelCounts[brand.id] || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      {/* Edit Icon */}
                      <Link
                        href={`/admin/brands/${brand.id}`}
                        className="text-primary hover:text-primary-dark transition-colors p-1 rounded-md hover:bg-primary/10"
                        title="Editar"
                        aria-label="Editar marca"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      {/* Public View Icon */}
                      <Link
                        href={`/catalogo/marcas/${brand.slug || brand.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                        title="Ver página pública"
                        aria-label="Ver página pública de la marca"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>

                      {/* Delete Icon */}
                      <button
                        onClick={() => handleDelete(brand.id, brand.nombre)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                        title="Eliminar"
                        aria-label="Eliminar marca"
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

        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay marcas</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'No hay marcas registradas en el sistema.'
                : `No hay marcas ${filter === 'active' ? 'activas' : 'inactivas'}.`
              }
            </p>
            <Link
              href="/admin/brands/new"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Primera Marca
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
