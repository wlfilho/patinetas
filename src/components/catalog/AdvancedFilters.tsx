'use client'

import { useState } from 'react'
import { ModeloPatineta } from '@/lib/supabase'

export interface AdvancedFilterOptions {
  // Basic filters
  priceMin: string
  priceMax: string
  speedMin: string
  speedMax: string
  rangeMin: string
  rangeMax: string
  weightMin: string
  weightMax: string
  powerMin: string
  powerMax: string
  
  // Technical specifications filters
  waterResistance: string[]
  brakeType: string[]
  suspensionType: string[]
  tireType: string[]
  foldable: string
  appConnected: string
  bluetooth: string
  gps: string
  
  // Battery filters
  batteryCapacityMin: string
  batteryCapacityMax: string
  batteryType: string[]
  removableBattery: string
  
  // Motor filters
  motorType: string[]
  motorLocation: string[]
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions
  onChange: (filters: AdvancedFilterOptions) => void
  onClear: () => void
  models: ModeloPatineta[]
}

export function createEmptyFilters(): AdvancedFilterOptions {
  return {
    priceMin: '',
    priceMax: '',
    speedMin: '',
    speedMax: '',
    rangeMin: '',
    rangeMax: '',
    weightMin: '',
    weightMax: '',
    powerMin: '',
    powerMax: '',
    waterResistance: [],
    brakeType: [],
    suspensionType: [],
    tireType: [],
    foldable: '',
    appConnected: '',
    bluetooth: '',
    gps: '',
    batteryCapacityMin: '',
    batteryCapacityMax: '',
    batteryType: [],
    removableBattery: '',
    motorType: [],
    motorLocation: []
  }
}

export default function AdvancedFilters({ filters, onChange, onClear, models }: AdvancedFiltersProps) {
  const [activeSection, setActiveSection] = useState<string>('basic')

  const handleInputChange = (field: keyof AdvancedFilterOptions, value: string) => {
    onChange({ ...filters, [field]: value })
  }

  const handleArrayChange = (field: keyof AdvancedFilterOptions, value: string) => {
    const currentArray = filters[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    onChange({ ...filters, [field]: newArray })
  }

  const sections = [
    { id: 'basic', label: '📊 Básico', icon: '📊' },
    { id: 'performance', label: '🚀 Rendimiento', icon: '🚀' },
    { id: 'battery', label: '🔋 Batería', icon: '🔋' },
    { id: 'motor', label: '⚡ Motor', icon: '⚡' },
    { id: 'safety', label: '🔒 Seguridad', icon: '🔒' },
    { id: 'features', label: '✨ Características', icon: '✨' }
  ]

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0
    return value !== ''
  })

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Filtros Avanzados
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex overflow-x-auto px-4" aria-label="Filter sections">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`
                whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors
                ${activeSection === section.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label.replace(/^[^\s]+ /, '')}
            </button>
          ))}
        </nav>
      </div>

      {/* Filter Content */}
      <div className="p-6">
        {/* BASIC FILTERS */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>💰</span> Rango de Precio (COP)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="500,000"
                      value={filters.priceMin}
                      onChange={(e) => handleInputChange('priceMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="5,000,000"
                      value={filters.priceMax}
                      onChange={(e) => handleInputChange('priceMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Weight Range */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>⚖️</span> Peso (kg)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={filters.weightMin}
                      onChange={(e) => handleInputChange('weightMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={filters.weightMax}
                      onChange={(e) => handleInputChange('weightMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE FILTERS */}
        {activeSection === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Speed Range */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>🚀</span> Velocidad Máxima (km/h)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="20"
                      value={filters.speedMin}
                      onChange={(e) => handleInputChange('speedMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="45"
                      value={filters.speedMax}
                      onChange={(e) => handleInputChange('speedMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Range/Autonomy */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>🔋</span> Autonomía (km)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="20"
                      value={filters.rangeMin}
                      onChange={(e) => handleInputChange('rangeMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="60"
                      value={filters.rangeMax}
                      onChange={(e) => handleInputChange('rangeMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Power Range */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>⚡</span> Potencia del Motor (W)
                </h4>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="250"
                      value={filters.powerMin}
                      onChange={(e) => handleInputChange('powerMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={filters.powerMax}
                      onChange={(e) => handleInputChange('powerMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BATTERY FILTERS */}
        {activeSection === 'battery' && (
          <div className="space-y-6">
            {/* Battery Capacity */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🔌</span> Capacidad de Batería (Wh)
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mínimo</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={filters.batteryCapacityMin}
                    onChange={(e) => handleInputChange('batteryCapacityMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Máximo</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.batteryCapacityMax}
                    onChange={(e) => handleInputChange('batteryCapacityMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Battery Type */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🔋</span> Tipo de Batería
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Litio', 'Li-ion', 'LiFePO4', 'Litio-Polímero'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleArrayChange('batteryType', type)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.batteryType.includes(type)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Removable Battery */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🔄</span> Batería Removible
              </h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('removableBattery', filters.removableBattery === 'yes' ? '' : 'yes')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.removableBattery === 'yes'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  ✅ Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('removableBattery', filters.removableBattery === 'no' ? '' : 'no')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.removableBattery === 'no'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  ❌ No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOTOR FILTERS */}
        {activeSection === 'motor' && (
          <div className="space-y-6">
            {/* Motor Type */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>⚡</span> Tipo de Motor
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Brushless', 'Hub Motor', 'Motor Central', 'BLDC'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleArrayChange('motorType', type)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.motorType.includes(type)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Motor Location */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📍</span> Ubicación del Motor
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Rueda Trasera', 'Rueda Delantera', 'Dual', 'Central'].map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleArrayChange('motorLocation', location)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.motorLocation.includes(location)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAFETY FILTERS */}
        {activeSection === 'safety' && (
          <div className="space-y-6">
            {/* Water Resistance */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>💧</span> Resistencia al Agua
              </h4>
              <div className="flex flex-wrap gap-2">
                {['IPX4', 'IPX5', 'IPX6', 'IPX7', 'IP54', 'IP65'].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleArrayChange('waterResistance', rating)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.waterResistance.includes(rating)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Brake Type */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🛑</span> Tipo de Frenos
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Disco', 'E-ABS', 'Tambor', 'Disco Dual', 'Triple Frenado', 'Regenerativo'].map((brake) => (
                  <button
                    key={brake}
                    type="button"
                    onClick={() => handleArrayChange('brakeType', brake)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.brakeType.includes(brake)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                    }`}
                  >
                    {brake}
                  </button>
                ))}
              </div>
            </div>

            {/* Suspension Type */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🔧</span> Suspensión
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Delantera', 'Trasera', 'Delantera y Trasera', 'Hidráulica', 'Neumática', 'Sin Suspensión'].map((susp) => (
                  <button
                    key={susp}
                    type="button"
                    onClick={() => handleArrayChange('suspensionType', susp)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.suspensionType.includes(susp)
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {susp}
                  </button>
                ))}
              </div>
            </div>

            {/* Tire Type */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🛞</span> Tipo de Neumáticos
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Neumáticos', 'Sólidos', 'Tubeless', 'Con Cámara', 'Honeycomb'].map((tire) => (
                  <button
                    key={tire}
                    type="button"
                    onClick={() => handleArrayChange('tireType', tire)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.tireType.includes(tire)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                    }`}
                  >
                    {tire}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURES FILTERS */}
        {activeSection === 'features' && (
          <div className="space-y-6">
            {/* Foldable */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📦</span> Plegable
              </h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('foldable', filters.foldable === 'yes' ? '' : 'yes')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.foldable === 'yes'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  ✅ Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('foldable', filters.foldable === 'no' ? '' : 'no')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.foldable === 'no'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  ❌ No
                </button>
              </div>
            </div>

            {/* App Connected */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📱</span> Conectividad con App
              </h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('appConnected', filters.appConnected === 'yes' ? '' : 'yes')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.appConnected === 'yes'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
                  }`}
                >
                  ✅ Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('appConnected', filters.appConnected === 'no' ? '' : 'no')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.appConnected === 'no'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
                  }`}
                >
                  ❌ No
                </button>
              </div>
            </div>

            {/* Bluetooth */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📶</span> Bluetooth
              </h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('bluetooth', filters.bluetooth === 'yes' ? '' : 'yes')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.bluetooth === 'yes'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  ✅ Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('bluetooth', filters.bluetooth === 'no' ? '' : 'no')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.bluetooth === 'no'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  ❌ No
                </button>
              </div>
            </div>

            {/* GPS */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🗺️</span> GPS
              </h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('gps', filters.gps === 'yes' ? '' : 'yes')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.gps === 'yes'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                  }`}
                >
                  ✅ Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('gps', filters.gps === 'no' ? '' : 'no')}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    filters.gps === 'no'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                  }`}
                >
                  ❌ No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

