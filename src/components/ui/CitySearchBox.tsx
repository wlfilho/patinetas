'use client'

import { useState, useMemo } from 'react'

interface CitySearchBoxProps {
  cities: string[]
  onFilterChange: (filteredCities: string[]) => void
  departmentName: string
}

export default function CitySearchBox({ cities, onFilterChange, departmentName }: CitySearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) {
      return cities
    }
    return cities.filter(city =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [cities, searchTerm])

  // Update parent component when filtered cities change
  useMemo(() => {
    onFilterChange(filteredCities)
  }, [filteredCities, onFilterChange])

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            🔍 Buscar Ciudades en {departmentName}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Encuentre negocios en su ciudad de {departmentName}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Buscar ciudad en ${departmentName}...`}
            className="w-full h-12 sm:h-14 pl-12 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-lg transition-all"
            aria-label={`Buscar ciudad en ${departmentName}`}
          />

          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Mostrando{' '}
            <span className="font-semibold text-primary">{filteredCities.length}</span>
            {' '}de{' '}
            <span className="font-semibold">{cities.length}</span>
            {' '}{cities.length === 1 ? 'ciudad' : 'ciudades'}
          </p>
        </div>

        {/* No Results Message */}
        {filteredCities.length === 0 && searchTerm && (
          <div className="mt-6 text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-600 font-medium">
              No se encontraron ciudades que coincidan con &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={handleClear}
              className="mt-3 text-primary hover:text-primary-dark font-medium text-sm"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

