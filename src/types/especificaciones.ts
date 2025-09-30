/**
 * Tipos e interfaces para especificações técnicas de patinetas elétricas
 * Estrutura padronizada para o campo JSONB 'especificaciones' na tabela modelos_patinetas
 */

// ============================================
// BATERIA
// ============================================
export interface BateriaEspecificaciones {
  voltaje?: string // Ex: "36V", "48V", "52V"
  capacidad?: string // Ex: "10Ah", "15Ah", "20Ah"
  capacidad_wh?: number // Ex: 360, 720 (Wh)
  tipo?: string // Ex: "Litio", "Li-ion", "LiFePO4"
  removible?: boolean // Bateria removível
  tiempo_carga?: string // Ex: "4-6 horas", "3.5 horas"
  cargador?: string // Ex: "42V 2A", "Cargador rápido incluido"
}

// ============================================
// MOTOR
// ============================================
export interface MotorEspecificaciones {
  potencia?: number // Watts (ex: 250, 500, 1000)
  potencia_pico?: number // Potência de pico em Watts
  tipo?: string // Ex: "Brushless", "Hub motor", "Motor central"
  ubicacion?: string // Ex: "Rueda trasera", "Rueda delantera", "Dual"
  traccion?: string // Ex: "Trasera", "Delantera", "4x4 (dual)"
}

// ============================================
// RENDIMIENTO
// ============================================
export interface RendimientoEspecificaciones {
  velocidad_maxima?: number // km/h
  velocidad_maxima_real?: number // Velocidade real testada
  autonomia?: number // km (alcance)
  autonomia_real?: number // Alcance real testado
  carga_maxima?: number // kg (peso máximo suportado)
  grado_subida?: number // graus (ex: 15, 20, 25)
  grado_subida_porcentaje?: number // porcentagem (ex: 15%, 20%)
  aceleracion?: string // Ex: "0-25 km/h em 5s"
}

// ============================================
// DIMENSÕES E PESO
// ============================================
export interface DimensionesEspecificaciones {
  largo_desplegada?: number // cm
  ancho_desplegada?: number // cm
  alto_desplegada?: number // cm
  dimensiones_desplegada?: string // Ex: "108 x 43 x 114 cm"
  largo_plegada?: number // cm
  ancho_plegada?: number // cm
  alto_plegada?: number // cm
  dimensiones_plegada?: string // Ex: "108 x 43 x 49 cm"
  peso?: number // kg
  peso_neto?: number // kg (sem embalagem)
  peso_bruto?: number // kg (com embalagem)
  altura_plataforma?: number // cm (altura do deck)
  ancho_plataforma?: number // cm (largura do deck)
}

// ============================================
// NEUMÁTICOS / PNEUS
// ============================================
export interface NeumaticosEspecificaciones {
  tamano_delantero?: string // Ex: "8.5 pulgadas", "10 pulgadas"
  tamano_trasero?: string // Ex: "8.5 pulgadas", "10 pulgadas"
  tipo?: string // Ex: "Neumáticos", "Sólidos", "Tubeless", "Con cámara"
  material?: string // Ex: "Goma", "Honeycomb", "Gel"
  presion?: string // Ex: "50 PSI", "3.5 bar"
  marca?: string // Ex: "CST", "Xiaomi"
}

// ============================================
// FRENOS
// ============================================
export interface FrenosEspecificaciones {
  tipo_delantero?: string // Ex: "Disco", "E-ABS", "Tambor", "Pie"
  tipo_trasero?: string // Ex: "Disco", "E-ABS", "Tambor", "Pie"
  sistema?: string // Ex: "Disco dual", "E-ABS + Disco", "Triple frenado"
  descripcion?: string // Descrição detalhada do sistema
  distancia_frenado?: string // Ex: "4 metros a 20 km/h"
}

// ============================================
// SUSPENSIÓN
// ============================================
export interface SuspensionEspecificaciones {
  delantera?: string // Ex: "Resorte", "Hidráulica", "Neumática"
  trasera?: string // Ex: "Resorte", "Hidráulica", "Neumática"
  tipo?: string // Ex: "Delantera y trasera", "Solo delantera", "Sin suspensión"
  recorrido?: string // Ex: "40mm", "60mm"
  ajustable?: boolean
}

// ============================================
// SEGURIDAD Y PROTECCIÓN
// ============================================
export interface SeguridadEspecificaciones {
  resistencia_agua?: string // Ex: "IP54", "IPX4", "IPX5"
  certificaciones?: string[] // Ex: ["CE", "FCC", "RoHS", "UL"]
  luces_delanteras?: string // Ex: "LED 2W", "LED alta intensidad"
  luces_traseras?: string // Ex: "LED roja", "Luz de freno"
  reflectores?: boolean
  bocina?: boolean
  sistema_seguridad?: string // Ex: "Bloqueo electrónico", "Alarme", "GPS"
  bloqueo?: string // Ex: "Electrónico via app", "Físico con llave"
}

// ============================================
// DISPLAY E CONTROLES
// ============================================
export interface DisplayEspecificaciones {
  tipo?: string // Ex: "LCD", "LED", "OLED", "TFT"
  tamano?: string // Ex: "3 pulgadas", "4.3 pulgadas"
  informacion?: string[] // Ex: ["Velocidad", "Batería", "Modo", "Kilometraje"]
  iluminacion?: boolean // Display iluminado
  controles?: string // Ex: "Botones táctiles", "Botones físicos"
}

// ============================================
// CONECTIVIDAD
// ============================================
export interface ConectividadEspecificaciones {
  app?: string // Ex: "Mi Home", "Segway-Ninebot", "Xiaomi Home"
  bluetooth?: boolean
  gps?: boolean
  wifi?: boolean
  puerto_carga?: string // Ex: "USB-C", "DC 5.5mm"
  puerto_usb?: boolean // Para carregar celular
}

// ============================================
// MODOS DE CONDUÇÃO
// ============================================
export interface ModosConduccionEspecificaciones {
  modos?: string[] // Ex: ["Eco", "Normal", "Sport", "Personalizado"]
  velocidad_eco?: number // km/h
  velocidad_normal?: number // km/h
  velocidad_sport?: number // km/h
  cruise_control?: boolean
  arranque?: string // Ex: "Kick-start", "Acelerador directo", "Zero-start"
}

// ============================================
// CARACTERÍSTICAS ADICIONALES
// ============================================
export interface CaracteristicasAdicionalesEspecificaciones {
  plegable?: boolean
  tiempo_plegado?: string // Ex: "3 segundos"
  portatil?: boolean
  manillar_ajustable?: boolean
  altura_manillar?: string // Ex: "95-115 cm"
  soporte_lateral?: boolean
  guardabarros?: boolean
  portaequipajes?: boolean
  capacidad_carga_extra?: number // kg (para portaequipajes)
  color_disponible?: string[] // Ex: ["Negro", "Blanco", "Gris"]
}

// ============================================
// CONTENIDO DE LA CAJA
// ============================================
export interface ContenidoCajaEspecificaciones {
  incluye?: string[] // Ex: ["Patineta", "Cargador", "Manual", "Herramientas"]
  accesorios_opcionales?: string[] // Ex: ["Bolsa de transporte", "Candado"]
}

// ============================================
// GARANTÍA Y SOPORTE
// ============================================
export interface GarantiaEspecificaciones {
  duracion?: string // Ex: "12 meses", "2 años"
  cobertura?: string // Ex: "Motor y batería", "Completa"
  soporte_tecnico?: string // Ex: "24/7", "Horario comercial"
}

// ============================================
// INTERFACE PRINCIPAL
// ============================================
export interface EspecificacionesTecnicas {
  bateria?: BateriaEspecificaciones
  motor?: MotorEspecificaciones
  rendimiento?: RendimientoEspecificaciones
  dimensiones?: DimensionesEspecificaciones
  neumaticos?: NeumaticosEspecificaciones
  frenos?: FrenosEspecificaciones
  suspension?: SuspensionEspecificaciones
  seguridad?: SeguridadEspecificaciones
  display?: DisplayEspecificaciones
  conectividad?: ConectividadEspecificaciones
  modos_conduccion?: ModosConduccionEspecificaciones
  caracteristicas_adicionales?: CaracteristicasAdicionalesEspecificaciones
  contenido_caja?: ContenidoCajaEspecificaciones
  garantia?: GarantiaEspecificaciones
  notas?: string // Notas adicionais ou observações
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Cria um objeto de especificações vazio com estrutura padrão
 */
export function createEmptyEspecificaciones(): EspecificacionesTecnicas {
  return {
    bateria: {},
    motor: {},
    rendimiento: {},
    dimensiones: {},
    neumaticos: {},
    frenos: {},
    suspension: {},
    seguridad: {},
    display: {},
    conectividad: {},
    modos_conduccion: {},
    caracteristicas_adicionales: {},
    contenido_caja: {},
    garantia: {},
  }
}

/**
 * Valida se as especificações têm a estrutura correta
 */
export function isValidEspecificaciones(data: unknown): data is EspecificacionesTecnicas {
  if (!data || typeof data !== 'object') return false
  return true // Validação básica - todos os campos são opcionais
}

/**
 * Mescla especificações existentes com novas, preservando dados
 */
export function mergeEspecificaciones(
  existing: EspecificacionesTecnicas | undefined,
  updates: Partial<EspecificacionesTecnicas>
): EspecificacionesTecnicas {
  const base = existing || createEmptyEspecificaciones()
  
  return {
    bateria: { ...base.bateria, ...updates.bateria },
    motor: { ...base.motor, ...updates.motor },
    rendimiento: { ...base.rendimiento, ...updates.rendimiento },
    dimensiones: { ...base.dimensiones, ...updates.dimensiones },
    neumaticos: { ...base.neumaticos, ...updates.neumaticos },
    frenos: { ...base.frenos, ...updates.frenos },
    suspension: { ...base.suspension, ...updates.suspension },
    seguridad: { ...base.seguridad, ...updates.seguridad },
    display: { ...base.display, ...updates.display },
    conectividad: { ...base.conectividad, ...updates.conectividad },
    modos_conduccion: { ...base.modos_conduccion, ...updates.modos_conduccion },
    caracteristicas_adicionales: { ...base.caracteristicas_adicionales, ...updates.caracteristicas_adicionales },
    contenido_caja: { ...base.contenido_caja, ...updates.contenido_caja },
    garantia: { ...base.garantia, ...updates.garantia },
    notas: updates.notas || base.notas,
  }
}

