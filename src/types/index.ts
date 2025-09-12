// Re-export database types
export type { NegocioDirectorio } from '@/lib/supabase'
import type { NegocioDirectorio } from '@/lib/supabase'

// Search and filter types
export interface SearchFilters {
  categoria?: string
  ciudad?: string
  departamento?: string
  query?: string
}

export interface SearchResults {
  negocios: NegocioDirectorio[]
  total: number
  categories: string[]
  cities: string[]
}

// UI Component types
export interface CategoryCard {
  name: string
  description: string
  icon: string
  count: number
  slug: string
}

export interface BusinessCard {
  id: number
  nombre: string
  descripcion?: string
  categoria: string
  ciudad: string
  telefono?: string
  whatsapp?: string
  imagen_url?: string
  servicios?: string[]
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: string
}

// Form types
export interface ContactForm {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  negocio_id?: number
}

// Colombian departments and major cities
export const DEPARTAMENTOS_COLOMBIA = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada'
]

export const CIUDADES_PRINCIPALES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Villavicencio', 'Armenia', 'Valledupar', 'Montería', 'Sincelejo',
  'Popayán', 'Tunja', 'Florencia', 'Riohacha', 'Yopal', 'Quibdó'
]

// Business categories for electric scooters
export const CATEGORIAS_PATINETAS = [
  'Venta de Patinetas Eléctricas',
  'Reparación y Mantenimiento',
  'Repuestos y Accesorios',
  'Alquiler de Patinetas',
  'Servicio Técnico Especializado',
  'Importadores y Distribuidores',
  'Tiendas Multimarca',
  'Servicio de Delivery',
  'Escuelas de Conducción',
  'Seguros para Patinetas'
]
