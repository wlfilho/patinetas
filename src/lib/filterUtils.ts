import { ModeloPatineta } from './supabase'
import { AdvancedFilterOptions } from '@/components/catalog/AdvancedFilters'
import { EspecificacionesTecnicas } from '@/types/especificaciones'

/**
 * Apply advanced filters to a list of models
 */
export function applyAdvancedFilters(
  models: ModeloPatineta[],
  filters: AdvancedFilterOptions
): ModeloPatineta[] {
  let filtered = [...models]

  // Price filters
  if (filters.priceMin) {
    const min = parseInt(filters.priceMin)
    filtered = filtered.filter(model => 
      model.precio_min && model.precio_min >= min
    )
  }
  if (filters.priceMax) {
    const max = parseInt(filters.priceMax)
    filtered = filtered.filter(model => 
      model.precio_max && model.precio_max <= max
    )
  }

  // Speed filters
  if (filters.speedMin) {
    const min = parseInt(filters.speedMin)
    filtered = filtered.filter(model => {
      const speed = model.velocidad_maxima || 
        (model.especificaciones as EspecificacionesTecnicas)?.rendimiento?.velocidad_maxima
      return speed && speed >= min
    })
  }
  if (filters.speedMax) {
    const max = parseInt(filters.speedMax)
    filtered = filtered.filter(model => {
      const speed = model.velocidad_maxima || 
        (model.especificaciones as EspecificacionesTecnicas)?.rendimiento?.velocidad_maxima
      return speed && speed <= max
    })
  }

  // Range/Autonomy filters
  if (filters.rangeMin) {
    const min = parseInt(filters.rangeMin)
    filtered = filtered.filter(model => {
      const range = model.autonomia || 
        (model.especificaciones as EspecificacionesTecnicas)?.rendimiento?.autonomia
      return range && range >= min
    })
  }
  if (filters.rangeMax) {
    const max = parseInt(filters.rangeMax)
    filtered = filtered.filter(model => {
      const range = model.autonomia || 
        (model.especificaciones as EspecificacionesTecnicas)?.rendimiento?.autonomia
      return range && range <= max
    })
  }

  // Weight filters
  if (filters.weightMin) {
    const min = parseInt(filters.weightMin)
    filtered = filtered.filter(model => {
      const weight = model.peso || 
        (model.especificaciones as EspecificacionesTecnicas)?.dimensiones?.peso
      return weight && weight >= min
    })
  }
  if (filters.weightMax) {
    const max = parseInt(filters.weightMax)
    filtered = filtered.filter(model => {
      const weight = model.peso || 
        (model.especificaciones as EspecificacionesTecnicas)?.dimensiones?.peso
      return weight && weight <= max
    })
  }

  // Power filters
  if (filters.powerMin) {
    const min = parseInt(filters.powerMin)
    filtered = filtered.filter(model => {
      const power = model.potencia || 
        (model.especificaciones as EspecificacionesTecnicas)?.motor?.potencia
      return power && power >= min
    })
  }
  if (filters.powerMax) {
    const max = parseInt(filters.powerMax)
    filtered = filtered.filter(model => {
      const power = model.potencia || 
        (model.especificaciones as EspecificacionesTecnicas)?.motor?.potencia
      return power && power <= max
    })
  }

  // Battery capacity filters
  if (filters.batteryCapacityMin) {
    const min = parseInt(filters.batteryCapacityMin)
    filtered = filtered.filter(model => {
      const capacity = (model.especificaciones as EspecificacionesTecnicas)?.bateria?.capacidad_wh
      return capacity && capacity >= min
    })
  }
  if (filters.batteryCapacityMax) {
    const max = parseInt(filters.batteryCapacityMax)
    filtered = filtered.filter(model => {
      const capacity = (model.especificaciones as EspecificacionesTecnicas)?.bateria?.capacidad_wh
      return capacity && capacity <= max
    })
  }

  // Battery type filter
  if (filters.batteryType.length > 0) {
    filtered = filtered.filter(model => {
      const batteryType = (model.especificaciones as EspecificacionesTecnicas)?.bateria?.tipo
      return batteryType && filters.batteryType.some(type => 
        batteryType.toLowerCase().includes(type.toLowerCase())
      )
    })
  }

  // Removable battery filter
  if (filters.removableBattery) {
    const shouldBeRemovable = filters.removableBattery === 'yes'
    filtered = filtered.filter(model => {
      const removable = (model.especificaciones as EspecificacionesTecnicas)?.bateria?.removible
      return removable === shouldBeRemovable
    })
  }

  // Motor type filter
  if (filters.motorType.length > 0) {
    filtered = filtered.filter(model => {
      const motorType = (model.especificaciones as EspecificacionesTecnicas)?.motor?.tipo
      return motorType && filters.motorType.some(type => 
        motorType.toLowerCase().includes(type.toLowerCase())
      )
    })
  }

  // Motor location filter
  if (filters.motorLocation.length > 0) {
    filtered = filtered.filter(model => {
      const location = (model.especificaciones as EspecificacionesTecnicas)?.motor?.ubicacion
      return location && filters.motorLocation.some(loc => 
        location.toLowerCase().includes(loc.toLowerCase())
      )
    })
  }

  // Water resistance filter
  if (filters.waterResistance.length > 0) {
    filtered = filtered.filter(model => {
      const resistance = (model.especificaciones as EspecificacionesTecnicas)?.seguridad?.resistencia_agua
      return resistance && filters.waterResistance.some(rating => 
        resistance.toUpperCase().includes(rating.toUpperCase())
      )
    })
  }

  // Brake type filter
  if (filters.brakeType.length > 0) {
    filtered = filtered.filter(model => {
      const specs = model.especificaciones as EspecificacionesTecnicas
      const brakeSystem = specs?.frenos?.sistema || ''
      const frontBrake = specs?.frenos?.tipo_delantero || ''
      const rearBrake = specs?.frenos?.tipo_trasero || ''
      const allBrakes = `${brakeSystem} ${frontBrake} ${rearBrake}`.toLowerCase()
      
      return filters.brakeType.some(type => 
        allBrakes.includes(type.toLowerCase())
      )
    })
  }

  // Suspension type filter
  if (filters.suspensionType.length > 0) {
    filtered = filtered.filter(model => {
      const specs = model.especificaciones as EspecificacionesTecnicas
      const suspType = specs?.suspension?.tipo || ''
      const front = specs?.suspension?.delantera || ''
      const rear = specs?.suspension?.trasera || ''
      const allSusp = `${suspType} ${front} ${rear}`.toLowerCase()
      
      return filters.suspensionType.some(type => 
        allSusp.includes(type.toLowerCase())
      )
    })
  }

  // Tire type filter
  if (filters.tireType.length > 0) {
    filtered = filtered.filter(model => {
      const tireType = (model.especificaciones as EspecificacionesTecnicas)?.neumaticos?.tipo
      return tireType && filters.tireType.some(type => 
        tireType.toLowerCase().includes(type.toLowerCase())
      )
    })
  }

  // Foldable filter
  if (filters.foldable) {
    const shouldBeFoldable = filters.foldable === 'yes'
    filtered = filtered.filter(model => {
      const foldable = (model.especificaciones as EspecificacionesTecnicas)?.caracteristicas_adicionales?.plegable
      return foldable === shouldBeFoldable
    })
  }

  // App connected filter
  if (filters.appConnected) {
    const shouldHaveApp = filters.appConnected === 'yes'
    filtered = filtered.filter(model => {
      const hasApp = !!(model.especificaciones as EspecificacionesTecnicas)?.conectividad?.app
      return hasApp === shouldHaveApp
    })
  }

  // Bluetooth filter
  if (filters.bluetooth) {
    const shouldHaveBluetooth = filters.bluetooth === 'yes'
    filtered = filtered.filter(model => {
      const hasBluetooth = (model.especificaciones as EspecificacionesTecnicas)?.conectividad?.bluetooth
      return hasBluetooth === shouldHaveBluetooth
    })
  }

  // GPS filter
  if (filters.gps) {
    const shouldHaveGPS = filters.gps === 'yes'
    filtered = filtered.filter(model => {
      const hasGPS = (model.especificaciones as EspecificacionesTecnicas)?.conectividad?.gps
      return hasGPS === shouldHaveGPS
    })
  }

  return filtered
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: AdvancedFilterOptions): number {
  let count = 0
  
  // Count range filters
  const rangeFields: (keyof AdvancedFilterOptions)[] = [
    'priceMin', 'priceMax', 'speedMin', 'speedMax', 'rangeMin', 'rangeMax',
    'weightMin', 'weightMax', 'powerMin', 'powerMax', 'batteryCapacityMin', 'batteryCapacityMax'
  ]
  rangeFields.forEach(field => {
    if (filters[field]) count++
  })
  
  // Count array filters
  const arrayFields: (keyof AdvancedFilterOptions)[] = [
    'waterResistance', 'brakeType', 'suspensionType', 'tireType', 'batteryType', 'motorType', 'motorLocation'
  ]
  arrayFields.forEach(field => {
    const value = filters[field] as string[]
    if (value.length > 0) count += value.length
  })
  
  // Count boolean filters
  const booleanFields: (keyof AdvancedFilterOptions)[] = [
    'foldable', 'appConnected', 'bluetooth', 'gps', 'removableBattery'
  ]
  booleanFields.forEach(field => {
    if (filters[field]) count++
  })
  
  return count
}

/**
 * Get filter summary for display
 */
export function getFilterSummary(filters: AdvancedFilterOptions): string[] {
  const summary: string[] = []
  
  if (filters.priceMin || filters.priceMax) {
    const min = filters.priceMin ? `$${parseInt(filters.priceMin).toLocaleString()}` : '0'
    const max = filters.priceMax ? `$${parseInt(filters.priceMax).toLocaleString()}` : '∞'
    summary.push(`Precio: ${min} - ${max}`)
  }
  
  if (filters.speedMin || filters.speedMax) {
    const min = filters.speedMin || '0'
    const max = filters.speedMax || '∞'
    summary.push(`Velocidad: ${min}-${max} km/h`)
  }
  
  if (filters.rangeMin || filters.rangeMax) {
    const min = filters.rangeMin || '0'
    const max = filters.rangeMax || '∞'
    summary.push(`Autonomía: ${min}-${max} km`)
  }
  
  if (filters.waterResistance.length > 0) {
    summary.push(`Resistencia: ${filters.waterResistance.join(', ')}`)
  }
  
  if (filters.foldable === 'yes') summary.push('Plegable')
  if (filters.appConnected === 'yes') summary.push('Con App')
  if (filters.bluetooth === 'yes') summary.push('Bluetooth')
  if (filters.gps === 'yes') summary.push('GPS')
  
  return summary
}

