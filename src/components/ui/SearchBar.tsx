'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFilters?: boolean
}

export default function SearchBar({ 
  placeholder = "Buscar patinetas eléctricas, tiendas, servicios...", 
  className = "",
  size = "md",
  showFilters = false
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    categoria: '',
    ciudad: '',
  })
  const router = useRouter()

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return

    const searchParams = new URLSearchParams()
    searchParams.set('q', query.trim())
    
    if (filters.categoria) {
      searchParams.set('categoria', filters.categoria)
    }
    
    if (filters.ciudad) {
      searchParams.set('ciudad', filters.ciudad)
    }

    router.push(`/buscar?${searchParams.toString()}`)
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              block w-full pl-10 pr-20 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-primary focus:border-primary
              placeholder-gray-500 bg-white shadow-sm
              ${sizeClasses[size]}
            `}
            placeholder={placeholder}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {showFilters && (
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border-r border-gray-300"
              >
                Filtros
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && showAdvanced && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={filters.categoria}
                  onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Todas las categorías</option>
                  <option value="venta-patinetas-electricas">Venta de Patinetas</option>
                  <option value="reparacion-mantenimiento">Reparación y Mantenimiento</option>
                  <option value="repuestos-accesorios">Repuestos y Accesorios</option>
                  <option value="alquiler-patinetas">Alquiler</option>
                  <option value="servicio-tecnico">Servicio Técnico</option>
                </select>
              </div>
              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  value={filters.ciudad}
                  onChange={(e) => setFilters(prev => ({ ...prev, ciudad: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Todas las ciudades</option>
                  <option value="bogota">Bogotá</option>
                  <option value="medellin">Medellín</option>
                  <option value="cali">Cali</option>
                  <option value="barranquilla">Barranquilla</option>
                  <option value="cartagena">Cartagena</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setFilters({ categoria: '', ciudad: '' })
                  setShowAdvanced(false)
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
