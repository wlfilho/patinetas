'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminService } from '@/lib/supabase'
import { NegocioDirectorio } from '@/lib/supabase'

interface DashboardStats {
  totalBusinesses: number
  activeBusinesses: number
  inactiveBusinesses: number
  categoriesCount: number
  citiesCount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    inactiveBusinesses: 0,
    categoriesCount: 0,
    citiesCount: 0
  })
  const [recentBusinesses, setRecentBusinesses] = useState<NegocioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const businesses = await adminService.getAllForAdmin()
      
      // Calculate stats
      const activeBusinesses = businesses.filter(b => b.activo).length
      const inactiveBusinesses = businesses.filter(b => !b.activo).length
      const categories = new Set(businesses.map(b => b.categoria))
      const cities = new Set(businesses.map(b => b.ciudad))
      
      setStats({
        totalBusinesses: businesses.length,
        activeBusinesses,
        inactiveBusinesses,
        categoriesCount: categories.size,
        citiesCount: cities.size
      })
      
      // Get recent businesses (last 5)
      setRecentBusinesses(businesses.slice(0, 5))
      
    } catch (err) {
      setError('Error loading dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Gestiona el directorio de patinetas eléctricas en Colombia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Negocios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBusinesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactiveBusinesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">🏷️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categoriesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">🏙️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ciudades</p>
              <p className="text-2xl font-bold text-gray-900">{stats.citiesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/businesses/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <span className="mr-2">➕</span>
            Agregar Negocio
          </Link>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="mr-2">📋</span>
            Ver Todos los Negocios
          </Link>
        </div>
      </div>

      {/* Recent Businesses */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Negocios Recientes</h2>
        {recentBusinesses.length > 0 ? (
          <div className="space-y-4">
            {recentBusinesses.map((business) => (
              <div key={business.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{business.nombre}</h3>
                  <p className="text-sm text-gray-600">{business.categoria} • {business.ciudad}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    business.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {business.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <Link
                    href={`/admin/businesses/${business.id}`}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay negocios registrados aún.</p>
        )}
      </div>
    </div>
  )
}
