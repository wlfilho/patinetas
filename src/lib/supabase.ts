import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for diretorio table
export interface NegocioDirectorio {
  id: number
  nombre: string
  descripcion?: string
  categoria: string
  telefono?: string
  email?: string
  direccion?: string
  ciudad: string
  departamento: string
  sitio_web?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  horario_atencion?: string
  servicios?: string[]
  imagen_url?: string
  activo: boolean
  fecha_creacion: string
  fecha_actualizacion: string
}

// Mock data for development
const mockBusinesses: NegocioDirectorio[] = [
  {
    id: 1,
    nombre: "ElectroScooter Bogotá",
    descripcion: "Especialistas en venta y reparación de patinetas eléctricas en Bogotá. Más de 5 años de experiencia.",
    categoria: "Venta de Patinetas Eléctricas",
    telefono: "3001234567",
    email: "info@electroscooter.co",
    direccion: "Calle 100 #15-20",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    sitio_web: "https://electroscooter.co",
    whatsapp: "3001234567",
    instagram: "@electroscooter_bogota",
    facebook: "ElectroScooterBogota",
    horario_atencion: "Lunes a Viernes 8:00 - 18:00, Sábados 9:00 - 16:00",
    servicios: ["Venta", "Reparación", "Mantenimiento", "Garantía"],
    imagen_url: undefined,
    activo: true,
    fecha_creacion: "2024-01-01T00:00:00Z",
    fecha_actualizacion: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    nombre: "Patinetas Medellín",
    descripcion: "Tu tienda de confianza para patinetas eléctricas en Medellín. Variedad de marcas y modelos.",
    categoria: "Venta de Patinetas Eléctricas",
    telefono: "3009876543",
    email: "ventas@patinetas-medellin.co",
    direccion: "Carrera 70 #45-30",
    ciudad: "Medellín",
    departamento: "Antioquia",
    sitio_web: "https://patinetas-medellin.co",
    whatsapp: "3009876543",
    instagram: "@patinetas_medellin",
    facebook: "PatinetesMedellin",
    horario_atencion: "Lunes a Sábado 9:00 - 19:00",
    servicios: ["Venta", "Asesoría", "Entrega a domicilio"],
    imagen_url: undefined,
    activo: true,
    fecha_creacion: "2024-01-01T00:00:00Z",
    fecha_actualizacion: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    nombre: "Servitécnico Scooters",
    descripcion: "Servicio técnico especializado en reparación de patinetas eléctricas. Repuestos originales.",
    categoria: "Reparación y Mantenimiento",
    telefono: "3015555555",
    email: "servicio@servitecnico.co",
    direccion: "Avenida 68 #25-15",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    sitio_web: undefined,
    whatsapp: "3015555555",
    instagram: undefined,
    facebook: undefined,
    horario_atencion: "Lunes a Viernes 8:00 - 17:00",
    servicios: ["Reparación", "Mantenimiento", "Diagnóstico", "Repuestos"],
    imagen_url: undefined,
    activo: true,
    fecha_creacion: "2024-01-01T00:00:00Z",
    fecha_actualizacion: "2024-01-01T00:00:00Z"
  }
]

// Helper functions for database operations
export const negociosService = {
  // Get all active businesses
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('*')
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return mockBusinesses
    }
  },

  // Get businesses by category
  async getByCategory(categoria: string) {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('*')
        .eq('categoria', categoria)
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return mockBusinesses.filter(b => b.categoria === categoria)
    }
  },

  // Get businesses by city
  async getByCity(ciudad: string) {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('*')
        .eq('ciudad', ciudad)
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return mockBusinesses.filter(b => b.ciudad === ciudad)
    }
  },

  // Search businesses
  async search(query: string) {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('*')
        .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%,servicios.cs.{${query}}`)
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      const lowerQuery = query.toLowerCase()
      return mockBusinesses.filter(b =>
        b.nombre.toLowerCase().includes(lowerQuery) ||
        b.descripcion?.toLowerCase().includes(lowerQuery) ||
        b.servicios?.some(s => s.toLowerCase().includes(lowerQuery))
      )
    }
  },

  // Get business by ID
  async getById(id: number) {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('*')
        .eq('id', id)
        .eq('activo', true)
        .single()

      if (error) throw error
      return data as NegocioDirectorio
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      const business = mockBusinesses.find(b => b.id === id)
      if (!business) throw new Error('Business not found')
      return business
    }
  },

  // Get unique categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('categoria')
        .eq('activo', true)

      if (error) throw error

      const categories = [...new Set(data.map(item => item.categoria))]
      return categories.sort()
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      const categories = [...new Set(mockBusinesses.map(b => b.categoria))]
      return categories.sort()
    }
  },

  // Get unique cities
  async getCities() {
    try {
      const { data, error } = await supabase
        .from('diretorio')
        .select('ciudad')
        .eq('activo', true)

      if (error) throw error

      const cities = [...new Set(data.map(item => item.ciudad))]
      return cities.sort()
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      const cities = [...new Set(mockBusinesses.map(b => b.ciudad))]
      return cities.sort()
    }
  }
}
