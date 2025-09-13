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

// Cities organized by department for admin forms
export const CIUDADES_POR_DEPARTAMENTO: Record<string, string[]> = {
  'Amazonas': ['Leticia', 'Puerto Nariño'],
  'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Sabaneta'],
  'Arauca': ['Arauca', 'Tame', 'Saravena'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'],
  'Caldas': ['Manizales', 'Villamaría', 'Chinchiná', 'La Dorada'],
  'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'],
  'Casanare': ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'],
  'Cesar': ['Valledupar', 'Aguachica', 'Bosconia', 'Codazzi'],
  'Chocó': ['Quibdó', 'Istmina', 'Condoto'],
  'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún'],
  'Cundinamarca': ['Bogotá', 'Soacha', 'Girardot', 'Zipaquirá', 'Facatativá', 'Chía', 'Mosquera', 'Fusagasugá'],
  'Guainía': ['Inírida'],
  'Guaviare': ['San José del Guaviare'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata'],
  'La Guajira': ['Riohacha', 'Maicao', 'Valledupar'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'],
  'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito'],
  'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
  'San Andrés y Providencia': ['San Andrés', 'Providencia'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
  'Sucre': ['Sincelejo', 'Corozal', 'San Marcos'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Cartago', 'Buga', 'Tuluá'],
  'Vaupés': ['Mitú'],
  'Vichada': ['Puerto Carreño']
}

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
