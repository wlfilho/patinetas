'use client'

import { useState } from 'react'
import { EspecificacionesTecnicas } from '@/types/especificaciones'

interface TechnicalSpecificationsProps {
  specifications?: EspecificacionesTecnicas
  // Campos legados para compatibilidade
  velocidad_maxima?: number
  autonomia?: number
  peso?: number
  potencia?: number
  tiempo_carga?: number
}

// Quick Spec Card Component
interface QuickSpecCardProps {
  icon: string
  label: string
  value: string | number
  unit?: string
  color: 'green' | 'purple' | 'blue' | 'orange'
}

function QuickSpecCard({ icon, label, value, unit, color }: QuickSpecCardProps) {
  const colorClasses = {
    green: 'from-primary/10 to-primary/5 border-primary/20 text-primary',
    purple: 'from-secondary/10 to-secondary/5 border-secondary/20 text-secondary',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-600',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-600'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
      <div className="flex flex-col items-center text-center space-y-2">
        <span className="text-4xl">{icon}</span>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold">
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}

// Feature Badge Component
interface FeatureBadgeProps {
  label: string
  available: boolean
  color?: 'green' | 'purple' | 'blue'
}

function FeatureBadge({ label, available, color = 'green' }: FeatureBadgeProps) {
  if (!available) return null

  const colorClasses = {
    green: 'bg-primary/10 text-primary border-primary/20',
    purple: 'bg-secondary/10 text-secondary border-secondary/20',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${colorClasses[color]}`}>
      <span className="text-base">✓</span>
      {label}
    </span>
  )
}

// Spec Item with enhanced styling
interface SpecItemProps {
  label: string
  value: string | number | boolean | undefined
  unit?: string
  icon?: string
  highlight?: boolean
}

function SpecItem({ label, value, unit, icon, highlight }: SpecItemProps) {
  if (value === undefined || value === null || value === '') return null

  const displayValue = typeof value === 'boolean'
    ? (value ? '✅ Sí' : '❌ No')
    : unit
      ? `${value} ${unit}`
      : value

  return (
    <div className={`${highlight ? 'bg-gradient-to-br from-primary/5 to-transparent border-primary/20' : 'bg-white border-gray-200'} border px-4 py-3 rounded-lg hover:shadow-md transition-all duration-200`}>
      <dt className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </dt>
      <dd className={`text-base font-bold ${highlight ? 'text-primary' : 'text-gray-900'}`}>
        {displayValue}
      </dd>
    </div>
  )
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string
  icon: string
  children: React.ReactNode
  isEmpty?: boolean
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, isEmpty, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (isEmpty) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <svg
          className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TechnicalSpecifications({
  specifications,
  velocidad_maxima,
  autonomia,
  peso,
  potencia,
  tiempo_carga
}: TechnicalSpecificationsProps) {

  // Extract data from specifications or use legacy fields
  const specs = specifications || {}
  const {
    bateria,
    motor,
    rendimiento,
    dimensiones,
    neumaticos,
    frenos,
    suspension,
    seguridad,
    display,
    conectividad,
    modos_conduccion,
    caracteristicas_adicionales,
    contenido_caja,
    garantia,
    notas
  } = specs

  // Get key specs (use specifications first, fallback to legacy fields)
  const keySpecs = {
    velocidad: rendimiento?.velocidad_maxima || velocidad_maxima,
    autonomia: rendimiento?.autonomia || autonomia,
    potencia: motor?.potencia || potencia,
    peso: dimensiones?.peso || peso,
    bateria: bateria?.capacidad_wh || bateria?.capacidad,
    carga: bateria?.tiempo_carga || tiempo_carga
  }

  // Check if we have any specifications to display
  const hasAnySpec = Object.values(keySpecs).some(v => v !== undefined && v !== null) ||
    Object.values(specs).some(section =>
      section && typeof section === 'object' && Object.keys(section).length > 0
    )

  if (!hasAnySpec) {
    return (
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 text-center">
        <span className="text-6xl mb-4 block">📋</span>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Especificaciones Técnicas</h3>
        <p className="text-gray-500">No hay especificaciones técnicas disponibles para este modelo.</p>
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-8">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Especificaciones Técnicas</h2>
          <p className="text-gray-600">Conoce todos los detalles de este modelo</p>
        </div>

        {/* QUICK SPECS - Most Important Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {keySpecs.velocidad && (
            <QuickSpecCard
              icon="🚀"
              label="Velocidad Máx"
              value={keySpecs.velocidad}
              unit="km/h"
              color="green"
            />
          )}
          {keySpecs.autonomia && (
            <QuickSpecCard
              icon="🔋"
              label="Autonomía"
              value={keySpecs.autonomia}
              unit="km"
              color="blue"
            />
          )}
          {keySpecs.potencia && (
            <QuickSpecCard
              icon="⚡"
              label="Potencia"
              value={keySpecs.potencia}
              unit="W"
              color="orange"
            />
          )}
          {keySpecs.peso && (
            <QuickSpecCard
              icon="⚖️"
              label="Peso"
              value={keySpecs.peso}
              unit="kg"
              color="purple"
            />
          )}
          {keySpecs.bateria && (
            <QuickSpecCard
              icon="🔌"
              label="Batería"
              value={keySpecs.bateria}
              unit={typeof keySpecs.bateria === 'number' && keySpecs.bateria > 100 ? 'Wh' : 'Ah'}
              color="green"
            />
          )}
          {keySpecs.carga && (
            <QuickSpecCard
              icon="⏱️"
              label="Tiempo Carga"
              value={keySpecs.carga}
              unit="h"
              color="blue"
            />
          )}
        </div>

        {/* FEATURE BADGES */}
        <div className="flex flex-wrap gap-3 justify-center">
          {seguridad?.resistencia_agua && (
            <FeatureBadge label={`${seguridad.resistencia_agua} Resistente al Agua`} available={true} color="blue" />
          )}
          {conectividad?.app && (
            <FeatureBadge label={`App ${conectividad.app}`} available={true} color="purple" />
          )}
          {caracteristicas_adicionales?.plegable && (
            <FeatureBadge label="Plegable" available={true} color="green" />
          )}
          {conectividad?.bluetooth && (
            <FeatureBadge label="Bluetooth" available={true} color="purple" />
          )}
          {conectividad?.gps && (
            <FeatureBadge label="GPS" available={true} color="blue" />
          )}
        </div>
      </div>

      {/* DETAILED SPECIFICATIONS - Collapsible Sections */}
      <div className="space-y-4">
        {/* BATERIA */}
        <CollapsibleSection
          title="Batería"
          icon="🔋"
          isEmpty={!bateria || Object.keys(bateria).length === 0}
          defaultOpen={true}
        >
          <SpecItem label="Voltaje" value={bateria?.voltaje} icon="⚡" />
          <SpecItem label="Capacidad" value={bateria?.capacidad} icon="🔌" />
          <SpecItem label="Capacidad" value={bateria?.capacidad_wh} unit="Wh" icon="🔌" highlight />
          <SpecItem label="Tipo" value={bateria?.tipo} icon="🔋" />
          <SpecItem label="Tiempo de Carga" value={bateria?.tiempo_carga} icon="⏱️" />
          <SpecItem label="Cargador" value={bateria?.cargador} icon="🔌" />
          <SpecItem label="Removible" value={bateria?.removible} icon="🔄" />
        </CollapsibleSection>

        {/* MOTOR */}
        <CollapsibleSection
          title="Motor"
          icon="⚡"
          isEmpty={!motor || Object.keys(motor).length === 0}
          defaultOpen={true}
        >
          <SpecItem label="Potencia" value={motor?.potencia} unit="W" icon="⚡" highlight />
          <SpecItem label="Potencia Pico" value={motor?.potencia_pico} unit="W" icon="⚡" />
          <SpecItem label="Tipo" value={motor?.tipo} icon="🔧" />
          <SpecItem label="Ubicación" value={motor?.ubicacion} icon="📍" />
          <SpecItem label="Tracción" value={motor?.traccion} icon="🎯" />
        </CollapsibleSection>

        {/* RENDIMIENTO */}
        <CollapsibleSection
          title="Rendimiento"
          icon="🚀"
          isEmpty={!rendimiento || Object.keys(rendimiento).length === 0}
          defaultOpen={true}
        >
          <SpecItem label="Velocidad Máxima" value={rendimiento?.velocidad_maxima} unit="km/h" icon="🚀" highlight />
          <SpecItem label="Velocidad Real" value={rendimiento?.velocidad_maxima_real} unit="km/h" icon="📊" />
          <SpecItem label="Autonomía" value={rendimiento?.autonomia} unit="km" icon="🔋" highlight />
          <SpecItem label="Autonomía Real" value={rendimiento?.autonomia_real} unit="km" icon="📊" />
          <SpecItem label="Carga Máxima" value={rendimiento?.carga_maxima} unit="kg" icon="⚖️" />
          <SpecItem label="Grado de Subida" value={rendimiento?.grado_subida} unit="°" icon="⛰️" />
          <SpecItem label="Grado de Subida" value={rendimiento?.grado_subida_porcentaje} unit="%" icon="⛰️" />
          <SpecItem label="Aceleración" value={rendimiento?.aceleracion} icon="🏁" />
        </CollapsibleSection>

        {/* DIMENSIONES */}
        <CollapsibleSection
          title="Dimensiones y Peso"
          icon="📏"
          isEmpty={!dimensiones || Object.keys(dimensiones).length === 0}
        >
          <SpecItem label="Desplegada" value={dimensiones?.dimensiones_desplegada} icon="📐" />
          <SpecItem label="Plegada" value={dimensiones?.dimensiones_plegada} icon="📦" />
          <SpecItem label="Peso" value={dimensiones?.peso} unit="kg" icon="⚖️" highlight />
          <SpecItem label="Peso Neto" value={dimensiones?.peso_neto} unit="kg" icon="⚖️" />
          <SpecItem label="Peso Bruto" value={dimensiones?.peso_bruto} unit="kg" icon="⚖️" />
          <SpecItem label="Altura Plataforma" value={dimensiones?.altura_plataforma} unit="cm" icon="📏" />
          <SpecItem label="Ancho Plataforma" value={dimensiones?.ancho_plataforma} unit="cm" icon="📏" />
        </CollapsibleSection>

        {/* NEUMÁTICOS */}
        <CollapsibleSection
          title="Neumáticos"
          icon="🛞"
          isEmpty={!neumaticos || Object.keys(neumaticos).length === 0}
        >
          <SpecItem label="Tamaño Delantero" value={neumaticos?.tamano_delantero} icon="🛞" />
          <SpecItem label="Tamaño Trasero" value={neumaticos?.tamano_trasero} icon="🛞" />
          <SpecItem label="Tipo" value={neumaticos?.tipo} icon="🔧" />
          <SpecItem label="Material" value={neumaticos?.material} icon="🧱" />
          <SpecItem label="Presión" value={neumaticos?.presion} icon="💨" />
          <SpecItem label="Marca" value={neumaticos?.marca} icon="🏷️" />
        </CollapsibleSection>

        {/* FRENOS */}
        <CollapsibleSection
          title="Sistema de Frenos"
          icon="🛑"
          isEmpty={!frenos || Object.keys(frenos).length === 0}
        >
          <SpecItem label="Freno Delantero" value={frenos?.tipo_delantero} icon="🛑" />
          <SpecItem label="Freno Trasero" value={frenos?.tipo_trasero} icon="🛑" />
          <SpecItem label="Sistema" value={frenos?.sistema} icon="🔧" highlight />
          <SpecItem label="Descripción" value={frenos?.descripcion} icon="📝" />
          <SpecItem label="Distancia de Frenado" value={frenos?.distancia_frenado} icon="📏" />
        </CollapsibleSection>

        {/* SUSPENSIÓN */}
        <CollapsibleSection
          title="Suspensión"
          icon="🔧"
          isEmpty={!suspension || Object.keys(suspension).length === 0}
        >
          <SpecItem label="Delantera" value={suspension?.delantera} icon="🔧" />
          <SpecItem label="Trasera" value={suspension?.trasera} icon="🔧" />
          <SpecItem label="Tipo" value={suspension?.tipo} icon="⚙️" highlight />
          <SpecItem label="Recorrido" value={suspension?.recorrido} icon="📏" />
          <SpecItem label="Ajustable" value={suspension?.ajustable} icon="🔄" />
        </CollapsibleSection>

        {/* SEGURIDAD */}
        <CollapsibleSection
          title="Seguridad y Protección"
          icon="🔒"
          isEmpty={!seguridad || Object.keys(seguridad).length === 0}
        >
          <SpecItem label="Resistencia al Agua" value={seguridad?.resistencia_agua} icon="💧" highlight />
          <SpecItem label="Luces Delanteras" value={seguridad?.luces_delanteras} icon="💡" />
          <SpecItem label="Luces Traseras" value={seguridad?.luces_traseras} icon="🔴" />
          <SpecItem label="Reflectores" value={seguridad?.reflectores} icon="✨" />
          <SpecItem label="Bocina" value={seguridad?.bocina} icon="📢" />
          <SpecItem label="Sistema de Seguridad" value={seguridad?.sistema_seguridad} icon="🔒" />
          <SpecItem label="Bloqueo" value={seguridad?.bloqueo} icon="🔐" />
          {seguridad?.certificaciones && seguridad.certificaciones.length > 0 && (
            <SpecItem label="Certificaciones" value={seguridad.certificaciones.join(', ')} icon="✅" />
          )}
        </CollapsibleSection>

        {/* DISPLAY */}
        <CollapsibleSection
          title="Display y Controles"
          icon="📱"
          isEmpty={!display || Object.keys(display).length === 0}
        >
          <SpecItem label="Tipo" value={display?.tipo} icon="📱" />
          <SpecItem label="Tamaño" value={display?.tamano} icon="📏" />
          <SpecItem label="Iluminación" value={display?.iluminacion} icon="💡" />
          <SpecItem label="Controles" value={display?.controles} icon="🎮" />
          {display?.informacion && display.informacion.length > 0 && (
            <SpecItem label="Información" value={display.informacion.join(', ')} icon="ℹ️" />
          )}
        </CollapsibleSection>

        {/* CONECTIVIDAD */}
        <CollapsibleSection
          title="Conectividad"
          icon="📡"
          isEmpty={!conectividad || Object.keys(conectividad).length === 0}
        >
          <SpecItem label="App" value={conectividad?.app} icon="📱" highlight />
          <SpecItem label="Bluetooth" value={conectividad?.bluetooth} icon="📶" />
          <SpecItem label="GPS" value={conectividad?.gps} icon="🗺️" />
          <SpecItem label="WiFi" value={conectividad?.wifi} icon="📡" />
          <SpecItem label="Puerto de Carga" value={conectividad?.puerto_carga} icon="🔌" />
          <SpecItem label="Puerto USB" value={conectividad?.puerto_usb} icon="🔌" />
        </CollapsibleSection>

        {/* MODOS DE CONDUCCIÓN */}
        <CollapsibleSection
          title="Modos de Conducción"
          icon="🎮"
          isEmpty={!modos_conduccion || Object.keys(modos_conduccion).length === 0}
        >
          {modos_conduccion?.modos && modos_conduccion.modos.length > 0 && (
            <SpecItem label="Modos Disponibles" value={modos_conduccion.modos.join(', ')} icon="🎯" highlight />
          )}
          <SpecItem label="Velocidad Eco" value={modos_conduccion?.velocidad_eco} unit="km/h" icon="🌱" />
          <SpecItem label="Velocidad Normal" value={modos_conduccion?.velocidad_normal} unit="km/h" icon="🚶" />
          <SpecItem label="Velocidad Sport" value={modos_conduccion?.velocidad_sport} unit="km/h" icon="🏃" />
          <SpecItem label="Cruise Control" value={modos_conduccion?.cruise_control} icon="🎯" />
          <SpecItem label="Arranque" value={modos_conduccion?.arranque} icon="🚀" />
        </CollapsibleSection>

        {/* CARACTERÍSTICAS ADICIONALES */}
        <CollapsibleSection
          title="Características Adicionales"
          icon="✨"
          isEmpty={!caracteristicas_adicionales || Object.keys(caracteristicas_adicionales).length === 0}
        >
          <SpecItem label="Plegable" value={caracteristicas_adicionales?.plegable} icon="📦" />
          <SpecItem label="Tiempo de Plegado" value={caracteristicas_adicionales?.tiempo_plegado} icon="⏱️" />
          <SpecItem label="Portátil" value={caracteristicas_adicionales?.portatil} icon="🎒" />
          <SpecItem label="Manillar Ajustable" value={caracteristicas_adicionales?.manillar_ajustable} icon="🔧" />
          <SpecItem label="Altura Manillar" value={caracteristicas_adicionales?.altura_manillar} icon="📏" />
          <SpecItem label="Soporte Lateral" value={caracteristicas_adicionales?.soporte_lateral} icon="🦵" />
          <SpecItem label="Guardabarros" value={caracteristicas_adicionales?.guardabarros} icon="🛡️" />
          <SpecItem label="Portaequipajes" value={caracteristicas_adicionales?.portaequipajes} icon="🎒" />
          <SpecItem label="Capacidad Carga Extra" value={caracteristicas_adicionales?.capacidad_carga_extra} unit="kg" icon="📦" />
          {caracteristicas_adicionales?.color_disponible && caracteristicas_adicionales.color_disponible.length > 0 && (
            <SpecItem label="Colores Disponibles" value={caracteristicas_adicionales.color_disponible.join(', ')} icon="🎨" />
          )}
        </CollapsibleSection>

        {/* CONTENIDO DE LA CAJA */}
        {contenido_caja && (contenido_caja.incluye || contenido_caja.accesorios_opcionales) && (
          <CollapsibleSection
            title="Contenido de la Caja"
            icon="📦"
            isEmpty={false}
          >
            {contenido_caja.incluye && contenido_caja.incluye.length > 0 && (
              <SpecItem label="Incluye" value={contenido_caja.incluye.join(', ')} icon="✅" />
            )}
            {contenido_caja.accesorios_opcionales && contenido_caja.accesorios_opcionales.length > 0 && (
              <SpecItem label="Accesorios Opcionales" value={contenido_caja.accesorios_opcionales.join(', ')} icon="🛒" />
            )}
          </CollapsibleSection>
        )}

        {/* GARANTÍA */}
        <CollapsibleSection
          title="Garantía y Soporte"
          icon="🛡️"
          isEmpty={!garantia || Object.keys(garantia).length === 0}
        >
          <SpecItem label="Duración" value={garantia?.duracion} icon="📅" highlight />
          <SpecItem label="Cobertura" value={garantia?.cobertura} icon="✅" />
          <SpecItem label="Soporte Técnico" value={garantia?.soporte_tecnico} icon="🛠️" />
        </CollapsibleSection>
      </div>

      {/* NOTAS */}
      {notas && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <h4 className="text-lg font-bold text-blue-900 mb-2">Notas Adicionales</h4>
              <p className="text-sm text-blue-800 leading-relaxed">{notas}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

