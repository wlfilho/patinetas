'use client'

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

interface SpecItemProps {
  label: string
  value: string | number | boolean | undefined
  unit?: string
  icon?: string
}

function SpecItem({ label, value, unit, icon }: SpecItemProps) {
  if (value === undefined || value === null || value === '') return null
  
  const displayValue = typeof value === 'boolean' 
    ? (value ? 'Sí' : 'No')
    : unit 
      ? `${value} ${unit}`
      : value

  return (
    <div className="bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
      <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-gray-900">{displayValue}</dd>
    </div>
  )
}

interface SpecSectionProps {
  title: string
  icon: string
  children: React.ReactNode
  isEmpty?: boolean
}

function SpecSection({ title, icon, children, isEmpty }: SpecSectionProps) {
  if (isEmpty) return null
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
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
  
  // Se não há especificações, mostrar apenas os campos legados
  if (!specifications) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Especificaciones Técnicas</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SpecItem label="Velocidad Máxima" value={velocidad_maxima} unit="km/h" icon="🚀" />
          <SpecItem label="Autonomía" value={autonomia} unit="km" icon="🔋" />
          <SpecItem label="Peso" value={peso} unit="kg" icon="⚖️" />
          <SpecItem label="Potencia" value={potencia} unit="W" icon="⚡" />
          <SpecItem label="Tiempo de Carga" value={tiempo_carga} unit="horas" icon="🔌" />
        </div>
      </div>
    )
  }

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
  } = specifications

  // Verificar se há alguma especificação preenchida
  const hasAnySpec = Object.values(specifications).some(section => 
    section && typeof section === 'object' && Object.keys(section).length > 0
  )

  if (!hasAnySpec) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Especificaciones Técnicas</h3>
        <p className="text-gray-500 text-sm">No hay especificaciones técnicas disponibles para este modelo.</p>
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ficha Técnica Completa</h2>
        
        {/* BATERIA */}
        <SpecSection 
          title="Batería" 
          icon="🔋"
          isEmpty={!bateria || Object.keys(bateria).length === 0}
        >
          <SpecItem label="Voltaje" value={bateria?.voltaje} />
          <SpecItem label="Capacidad" value={bateria?.capacidad} />
          <SpecItem label="Capacidad" value={bateria?.capacidad_wh} unit="Wh" />
          <SpecItem label="Tipo" value={bateria?.tipo} />
          <SpecItem label="Tiempo de Carga" value={bateria?.tiempo_carga} />
          <SpecItem label="Cargador" value={bateria?.cargador} />
          <SpecItem label="Removible" value={bateria?.removible} />
        </SpecSection>

        {/* MOTOR */}
        <SpecSection 
          title="Motor" 
          icon="⚡"
          isEmpty={!motor || Object.keys(motor).length === 0}
        >
          <SpecItem label="Potencia" value={motor?.potencia} unit="W" />
          <SpecItem label="Potencia Pico" value={motor?.potencia_pico} unit="W" />
          <SpecItem label="Tipo" value={motor?.tipo} />
          <SpecItem label="Ubicación" value={motor?.ubicacion} />
          <SpecItem label="Tracción" value={motor?.traccion} />
        </SpecSection>

        {/* RENDIMIENTO */}
        <SpecSection 
          title="Rendimiento" 
          icon="🚀"
          isEmpty={!rendimiento || Object.keys(rendimiento).length === 0}
        >
          <SpecItem label="Velocidad Máxima" value={rendimiento?.velocidad_maxima} unit="km/h" />
          <SpecItem label="Velocidad Real" value={rendimiento?.velocidad_maxima_real} unit="km/h" />
          <SpecItem label="Autonomía" value={rendimiento?.autonomia} unit="km" />
          <SpecItem label="Autonomía Real" value={rendimiento?.autonomia_real} unit="km" />
          <SpecItem label="Carga Máxima" value={rendimiento?.carga_maxima} unit="kg" />
          <SpecItem label="Grado de Subida" value={rendimiento?.grado_subida} unit="°" />
          <SpecItem label="Grado de Subida" value={rendimiento?.grado_subida_porcentaje} unit="%" />
          <SpecItem label="Aceleración" value={rendimiento?.aceleracion} />
        </SpecSection>

        {/* DIMENSIONES */}
        <SpecSection 
          title="Dimensiones y Peso" 
          icon="📏"
          isEmpty={!dimensiones || Object.keys(dimensiones).length === 0}
        >
          <SpecItem label="Desplegada" value={dimensiones?.dimensiones_desplegada} />
          <SpecItem label="Plegada" value={dimensiones?.dimensiones_plegada} />
          <SpecItem label="Peso" value={dimensiones?.peso} unit="kg" />
          <SpecItem label="Peso Neto" value={dimensiones?.peso_neto} unit="kg" />
          <SpecItem label="Peso Bruto" value={dimensiones?.peso_bruto} unit="kg" />
          <SpecItem label="Altura Plataforma" value={dimensiones?.altura_plataforma} unit="cm" />
          <SpecItem label="Ancho Plataforma" value={dimensiones?.ancho_plataforma} unit="cm" />
        </SpecSection>

        {/* NEUMÁTICOS */}
        <SpecSection 
          title="Neumáticos" 
          icon="🛞"
          isEmpty={!neumaticos || Object.keys(neumaticos).length === 0}
        >
          <SpecItem label="Tamaño Delantero" value={neumaticos?.tamano_delantero} />
          <SpecItem label="Tamaño Trasero" value={neumaticos?.tamano_trasero} />
          <SpecItem label="Tipo" value={neumaticos?.tipo} />
          <SpecItem label="Material" value={neumaticos?.material} />
          <SpecItem label="Presión" value={neumaticos?.presion} />
          <SpecItem label="Marca" value={neumaticos?.marca} />
        </SpecSection>

        {/* FRENOS */}
        <SpecSection 
          title="Sistema de Frenos" 
          icon="🛑"
          isEmpty={!frenos || Object.keys(frenos).length === 0}
        >
          <SpecItem label="Freno Delantero" value={frenos?.tipo_delantero} />
          <SpecItem label="Freno Trasero" value={frenos?.tipo_trasero} />
          <SpecItem label="Sistema" value={frenos?.sistema} />
          <SpecItem label="Descripción" value={frenos?.descripcion} />
          <SpecItem label="Distancia de Frenado" value={frenos?.distancia_frenado} />
        </SpecSection>

        {/* SUSPENSIÓN */}
        <SpecSection 
          title="Suspensión" 
          icon="🔧"
          isEmpty={!suspension || Object.keys(suspension).length === 0}
        >
          <SpecItem label="Delantera" value={suspension?.delantera} />
          <SpecItem label="Trasera" value={suspension?.trasera} />
          <SpecItem label="Tipo" value={suspension?.tipo} />
          <SpecItem label="Recorrido" value={suspension?.recorrido} />
          <SpecItem label="Ajustable" value={suspension?.ajustable} />
        </SpecSection>

        {/* SEGURIDAD */}
        <SpecSection 
          title="Seguridad y Protección" 
          icon="🔒"
          isEmpty={!seguridad || Object.keys(seguridad).length === 0}
        >
          <SpecItem label="Resistencia al Agua" value={seguridad?.resistencia_agua} />
          <SpecItem label="Luces Delanteras" value={seguridad?.luces_delanteras} />
          <SpecItem label="Luces Traseras" value={seguridad?.luces_traseras} />
          <SpecItem label="Reflectores" value={seguridad?.reflectores} />
          <SpecItem label="Bocina" value={seguridad?.bocina} />
          <SpecItem label="Sistema de Seguridad" value={seguridad?.sistema_seguridad} />
          <SpecItem label="Bloqueo" value={seguridad?.bloqueo} />
          {seguridad?.certificaciones && seguridad.certificaciones.length > 0 && (
            <SpecItem label="Certificaciones" value={seguridad.certificaciones.join(', ')} />
          )}
        </SpecSection>

        {/* DISPLAY */}
        <SpecSection 
          title="Display y Controles" 
          icon="📱"
          isEmpty={!display || Object.keys(display).length === 0}
        >
          <SpecItem label="Tipo" value={display?.tipo} />
          <SpecItem label="Tamaño" value={display?.tamano} />
          <SpecItem label="Iluminación" value={display?.iluminacion} />
          <SpecItem label="Controles" value={display?.controles} />
          {display?.informacion && display.informacion.length > 0 && (
            <SpecItem label="Información" value={display.informacion.join(', ')} />
          )}
        </SpecSection>

        {/* CONECTIVIDAD */}
        <SpecSection 
          title="Conectividad" 
          icon="📡"
          isEmpty={!conectividad || Object.keys(conectividad).length === 0}
        >
          <SpecItem label="App" value={conectividad?.app} />
          <SpecItem label="Bluetooth" value={conectividad?.bluetooth} />
          <SpecItem label="GPS" value={conectividad?.gps} />
          <SpecItem label="WiFi" value={conectividad?.wifi} />
          <SpecItem label="Puerto de Carga" value={conectividad?.puerto_carga} />
          <SpecItem label="Puerto USB" value={conectividad?.puerto_usb} />
        </SpecSection>

        {/* MODOS DE CONDUCCIÓN */}
        <SpecSection 
          title="Modos de Conducción" 
          icon="🎮"
          isEmpty={!modos_conduccion || Object.keys(modos_conduccion).length === 0}
        >
          {modos_conduccion?.modos && modos_conduccion.modos.length > 0 && (
            <SpecItem label="Modos Disponibles" value={modos_conduccion.modos.join(', ')} />
          )}
          <SpecItem label="Velocidad Eco" value={modos_conduccion?.velocidad_eco} unit="km/h" />
          <SpecItem label="Velocidad Normal" value={modos_conduccion?.velocidad_normal} unit="km/h" />
          <SpecItem label="Velocidad Sport" value={modos_conduccion?.velocidad_sport} unit="km/h" />
          <SpecItem label="Cruise Control" value={modos_conduccion?.cruise_control} />
          <SpecItem label="Arranque" value={modos_conduccion?.arranque} />
        </SpecSection>

        {/* CARACTERÍSTICAS ADICIONALES */}
        <SpecSection 
          title="Características Adicionales" 
          icon="✨"
          isEmpty={!caracteristicas_adicionales || Object.keys(caracteristicas_adicionales).length === 0}
        >
          <SpecItem label="Plegable" value={caracteristicas_adicionales?.plegable} />
          <SpecItem label="Tiempo de Plegado" value={caracteristicas_adicionales?.tiempo_plegado} />
          <SpecItem label="Portátil" value={caracteristicas_adicionales?.portatil} />
          <SpecItem label="Manillar Ajustable" value={caracteristicas_adicionales?.manillar_ajustable} />
          <SpecItem label="Altura Manillar" value={caracteristicas_adicionales?.altura_manillar} />
          <SpecItem label="Soporte Lateral" value={caracteristicas_adicionales?.soporte_lateral} />
          <SpecItem label="Guardabarros" value={caracteristicas_adicionales?.guardabarros} />
          <SpecItem label="Portaequipajes" value={caracteristicas_adicionales?.portaequipajes} />
          <SpecItem label="Capacidad Carga Extra" value={caracteristicas_adicionales?.capacidad_carga_extra} unit="kg" />
          {caracteristicas_adicionales?.color_disponible && caracteristicas_adicionales.color_disponible.length > 0 && (
            <SpecItem label="Colores Disponibles" value={caracteristicas_adicionales.color_disponible.join(', ')} />
          )}
        </SpecSection>

        {/* CONTENIDO DE LA CAJA */}
        {contenido_caja && (contenido_caja.incluye || contenido_caja.accesorios_opcionales) && (
          <SpecSection 
            title="Contenido de la Caja" 
            icon="📦"
            isEmpty={false}
          >
            {contenido_caja.incluye && contenido_caja.incluye.length > 0 && (
              <SpecItem label="Incluye" value={contenido_caja.incluye.join(', ')} />
            )}
            {contenido_caja.accesorios_opcionales && contenido_caja.accesorios_opcionales.length > 0 && (
              <SpecItem label="Accesorios Opcionales" value={contenido_caja.accesorios_opcionales.join(', ')} />
            )}
          </SpecSection>
        )}

        {/* GARANTÍA */}
        <SpecSection 
          title="Garantía y Soporte" 
          icon="🛡️"
          isEmpty={!garantia || Object.keys(garantia).length === 0}
        >
          <SpecItem label="Duración" value={garantia?.duracion} />
          <SpecItem label="Cobertura" value={garantia?.cobertura} />
          <SpecItem label="Soporte Técnico" value={garantia?.soporte_tecnico} />
        </SpecSection>

        {/* NOTAS */}
        {notas && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📝 Notas Adicionales</h4>
            <p className="text-sm text-blue-800">{notas}</p>
          </div>
        )}
      </div>
    </div>
  )
}

