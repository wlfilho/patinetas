'use client'

import { useState, useEffect } from 'react'
import { EspecificacionesTecnicas, createEmptyEspecificaciones } from '@/types/especificaciones'

interface ModelSpecificationsManagerProps {
  initialData?: EspecificacionesTecnicas
  onChange: (data: EspecificacionesTecnicas) => void
}

type SpecTab = 'bateria' | 'motor' | 'rendimiento' | 'dimensiones' | 'neumaticos' | 'frenos' | 'suspension' | 'seguridad' | 'display' | 'conectividad' | 'modos' | 'adicionales' | 'otros'

export default function ModelSpecificationsManager({ initialData, onChange }: ModelSpecificationsManagerProps) {
  const [activeTab, setActiveTab] = useState<SpecTab>('bateria')
  const [specs, setSpecs] = useState<EspecificacionesTecnicas>(
    initialData || createEmptyEspecificaciones()
  )

  useEffect(() => {
    if (initialData) {
      setSpecs(initialData)
    }
  }, [initialData])

  const handleChange = (section: keyof EspecificacionesTecnicas, field: string, value: string | number | boolean | string[] | undefined) => {
    const currentSection = specs[section] || {}
    const updatedSpecs = {
      ...specs,
      [section]: {
        ...(typeof currentSection === 'object' ? currentSection : {}),
        [field]: value
      }
    }
    setSpecs(updatedSpecs)
    onChange(updatedSpecs)
  }

  const handleArrayChange = (section: keyof EspecificacionesTecnicas, field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    handleChange(section, field, array)
  }

  const tabs = [
    { id: 'bateria' as SpecTab, label: '🔋 Bateria', icon: '🔋' },
    { id: 'motor' as SpecTab, label: '⚡ Motor', icon: '⚡' },
    { id: 'rendimiento' as SpecTab, label: '🚀 Rendimiento', icon: '🚀' },
    { id: 'dimensiones' as SpecTab, label: '📏 Dimensiones', icon: '📏' },
    { id: 'neumaticos' as SpecTab, label: '🛞 Neumáticos', icon: '🛞' },
    { id: 'frenos' as SpecTab, label: '🛑 Frenos', icon: '🛑' },
    { id: 'suspension' as SpecTab, label: '🔧 Suspensión', icon: '🔧' },
    { id: 'seguridad' as SpecTab, label: '🔒 Seguridad', icon: '🔒' },
    { id: 'display' as SpecTab, label: '📱 Display', icon: '📱' },
    { id: 'conectividad' as SpecTab, label: '📡 Conectividad', icon: '📡' },
    { id: 'modos' as SpecTab, label: '🎮 Modos', icon: '🎮' },
    { id: 'adicionales' as SpecTab, label: '✨ Adicionales', icon: '✨' },
    { id: 'otros' as SpecTab, label: '📦 Otros', icon: '📦' },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label.replace(/^[^\s]+ /, '')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* BATERIA */}
        {activeTab === 'bateria' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔋 Especificaciones de Batería</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voltaje</label>
                <input
                  type="text"
                  value={specs.bateria?.voltaje || ''}
                  onChange={(e) => handleChange('bateria', 'voltaje', e.target.value)}
                  placeholder="36V, 48V, 52V"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
                <input
                  type="text"
                  value={specs.bateria?.capacidad || ''}
                  onChange={(e) => handleChange('bateria', 'capacidad', e.target.value)}
                  placeholder="10Ah, 15Ah, 20Ah"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad (Wh)</label>
                <input
                  type="number"
                  value={specs.bateria?.capacidad_wh || ''}
                  onChange={(e) => handleChange('bateria', 'capacidad_wh', parseFloat(e.target.value) || undefined)}
                  placeholder="360, 720"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <input
                  type="text"
                  value={specs.bateria?.tipo || ''}
                  onChange={(e) => handleChange('bateria', 'tipo', e.target.value)}
                  placeholder="Litio, Li-ion, LiFePO4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de Carga</label>
                <input
                  type="text"
                  value={specs.bateria?.tiempo_carga || ''}
                  onChange={(e) => handleChange('bateria', 'tiempo_carga', e.target.value)}
                  placeholder="4-6 horas, 3.5 horas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargador</label>
                <input
                  type="text"
                  value={specs.bateria?.cargador || ''}
                  onChange={(e) => handleChange('bateria', 'cargador', e.target.value)}
                  placeholder="42V 2A, Cargador rápido"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={specs.bateria?.removible || false}
                  onChange={(e) => handleChange('bateria', 'removible', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Batería Removible</label>
              </div>
            </div>
          </div>
        )}

        {/* MOTOR */}
        {activeTab === 'motor' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Especificaciones de Motor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potencia (W)</label>
                <input
                  type="number"
                  value={specs.motor?.potencia || ''}
                  onChange={(e) => handleChange('motor', 'potencia', parseFloat(e.target.value) || undefined)}
                  placeholder="250, 500, 1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potencia Pico (W)</label>
                <input
                  type="number"
                  value={specs.motor?.potencia_pico || ''}
                  onChange={(e) => handleChange('motor', 'potencia_pico', parseFloat(e.target.value) || undefined)}
                  placeholder="800, 1200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <input
                  type="text"
                  value={specs.motor?.tipo || ''}
                  onChange={(e) => handleChange('motor', 'tipo', e.target.value)}
                  placeholder="Brushless, Hub motor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  value={specs.motor?.ubicacion || ''}
                  onChange={(e) => handleChange('motor', 'ubicacion', e.target.value)}
                  placeholder="Rueda trasera, Dual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tracción</label>
                <input
                  type="text"
                  value={specs.motor?.traccion || ''}
                  onChange={(e) => handleChange('motor', 'traccion', e.target.value)}
                  placeholder="Trasera, Delantera, 4x4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* RENDIMIENTO */}
        {activeTab === 'rendimiento' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Rendimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Velocidad Máxima (km/h)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.velocidad_maxima || ''}
                  onChange={(e) => handleChange('rendimiento', 'velocidad_maxima', parseFloat(e.target.value) || undefined)}
                  placeholder="25, 45"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Velocidad Real (km/h)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.velocidad_maxima_real || ''}
                  onChange={(e) => handleChange('rendimiento', 'velocidad_maxima_real', parseFloat(e.target.value) || undefined)}
                  placeholder="23, 42"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Autonomía (km)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.autonomia || ''}
                  onChange={(e) => handleChange('rendimiento', 'autonomia', parseFloat(e.target.value) || undefined)}
                  placeholder="30, 60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Autonomía Real (km)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.autonomia_real || ''}
                  onChange={(e) => handleChange('rendimiento', 'autonomia_real', parseFloat(e.target.value) || undefined)}
                  placeholder="25, 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carga Máxima (kg)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.carga_maxima || ''}
                  onChange={(e) => handleChange('rendimiento', 'carga_maxima', parseFloat(e.target.value) || undefined)}
                  placeholder="100, 120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grado de Subida (°)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.grado_subida || ''}
                  onChange={(e) => handleChange('rendimiento', 'grado_subida', parseFloat(e.target.value) || undefined)}
                  placeholder="15, 20, 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grado de Subida (%)</label>
                <input
                  type="number"
                  value={specs.rendimiento?.grado_subida_porcentaje || ''}
                  onChange={(e) => handleChange('rendimiento', 'grado_subida_porcentaje', parseFloat(e.target.value) || undefined)}
                  placeholder="15, 20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aceleración</label>
                <input
                  type="text"
                  value={specs.rendimiento?.aceleracion || ''}
                  onChange={(e) => handleChange('rendimiento', 'aceleracion', e.target.value)}
                  placeholder="0-25 km/h en 5s"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Continue with remaining tabs... */}
        {activeTab === 'dimensiones' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📏 Dimensiones y Peso</h3>
            <p className="text-sm text-gray-600 mb-4">Puedes ingresar dimensiones individuales o como texto completo</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensiones Desplegada</label>
                <input
                  type="text"
                  value={specs.dimensiones?.dimensiones_desplegada || ''}
                  onChange={(e) => handleChange('dimensiones', 'dimensiones_desplegada', e.target.value)}
                  placeholder="108 x 43 x 114 cm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensiones Plegada</label>
                <input
                  type="text"
                  value={specs.dimensiones?.dimensiones_plegada || ''}
                  onChange={(e) => handleChange('dimensiones', 'dimensiones_plegada', e.target.value)}
                  placeholder="108 x 43 x 49 cm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={specs.dimensiones?.peso || ''}
                  onChange={(e) => handleChange('dimensiones', 'peso', parseFloat(e.target.value) || undefined)}
                  placeholder="12.5, 14.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura Plataforma (cm)</label>
                <input
                  type="number"
                  value={specs.dimensiones?.altura_plataforma || ''}
                  onChange={(e) => handleChange('dimensiones', 'altura_plataforma', parseFloat(e.target.value) || undefined)}
                  placeholder="12, 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ancho Plataforma (cm)</label>
                <input
                  type="number"
                  value={specs.dimensiones?.ancho_plataforma || ''}
                  onChange={(e) => handleChange('dimensiones', 'ancho_plataforma', parseFloat(e.target.value) || undefined)}
                  placeholder="15, 18"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add a note about remaining tabs */}
        {!['bateria', 'motor', 'rendimiento', 'dimensiones'].includes(activeTab) && (
          <div className="text-center py-12">
            <p className="text-gray-500">Sección en desarrollo: {tabs.find(t => t.id === activeTab)?.label}</p>
            <p className="text-sm text-gray-400 mt-2">Esta sección estará disponible próximamente</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Consejo</h4>
        <p className="text-sm text-blue-700">
          Todos los campos son opcionales. Completa solo la información que tengas disponible.
          Las especificaciones se guardarán automáticamente al guardar el modelo.
        </p>
      </div>
    </div>
  )
}

