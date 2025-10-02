import { createClient } from '@supabase/supabase-js'
import { EspecificacionesTecnicas } from '@/types/especificaciones'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for diretorio_patinetas table
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
  youtube?: string
  tiktok?: string
  google_business_url?: string
  numero_resenhas?: number
  valoracion?: number
  horario_atencion?: string
  horarios_funcionamento?: string
  servicios?: string[]
  outras_especialidades?: string[]
  imagen_url?: string
  activo: boolean
  fecha_creacion: string
  fecha_actualizacion: string
  category_id?: string
  slug?: string
  ciudad_slug?: string
  gps_coordinates?: {
    latitude: number
    longitude: number
  }
}

// Database types for categorias_patinetas table
export interface CategoriaPatineta {
  id: string
  nombre: string
  descripcion?: string
  icono?: string
  activo: boolean
  orden: number
  slug?: string
  created_at?: string
  updated_at?: string
}

// Database types for marcas_patinetas table
export interface MarcaPatineta {
  id: string
  nombre: string
  descripcion?: string
  logo_url?: string
  pais_origen?: string
  sitio_web?: string
  activo: boolean
  orden: number
  created_at?: string
  updated_at?: string
  // SEO fields
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  seo_canonical_url?: string
  seo_robots?: string
  og_title?: string
  og_description?: string
  og_image_url?: string
  // Virtual field for slug (generated from nombre)
  slug?: string
}

// Database types for modelos_patinetas table
export interface ModeloPatineta {
  id: string
  marca_id: string
  nombre: string
  descripcion?: string
  imagen_url?: string
  velocidad_maxima?: number // km/h (mantido para compatibilidade, mas também em especificaciones.rendimiento)
  autonomia?: number // km (mantido para compatibilidade, mas também em especificaciones.rendimiento)
  peso?: number // kg (mantido para compatibilidade, mas também em especificaciones.dimensiones)
  potencia?: number // watts (mantido para compatibilidade, mas também em especificaciones.motor)
  tiempo_carga?: number // horas (mantido para compatibilidade, mas também em especificaciones.bateria)
  precio_min?: number // COP
  precio_max?: number // COP
  disponible_colombia: boolean
  especificaciones?: EspecificacionesTecnicas // Tipagem forte para especificações técnicas
  activo: boolean
  orden: number
  created_at?: string
  updated_at?: string
  // SEO fields
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  seo_canonical_url?: string
  seo_robots?: string
  og_title?: string
  og_description?: string
  og_image_url?: string
  // Joined data from marca
  marca?: MarcaPatineta
  // Virtual field for slug (generated from nombre and marca)
  slug?: string
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
    numero_resenhas: 47,
    valoracion: 4.8,
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
    numero_resenhas: 32,
    valoracion: 4.5,
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
    numero_resenhas: 28,
    valoracion: 4.7,
    horario_atencion: "Lunes a Viernes 8:00 - 17:00",
    servicios: ["Reparación", "Mantenimiento", "Diagnóstico", "Repuestos"],
    imagen_url: undefined,
    activo: true,
    fecha_creacion: "2024-01-01T00:00:00Z",
    fecha_actualizacion: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    nombre: "Repuestos Eléctricos Cali",
    descripcion: "Todo en repuestos y accesorios para patinetas eléctricas. Baterías, llantas, frenos y más.",
    categoria: "Repuestos y Accesorios",
    telefono: "3027777777",
    email: "ventas@repuestos-cali.co",
    direccion: "Avenida 6N #28-45",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    sitio_web: "https://repuestos-cali.co",
    whatsapp: "3027777777",
    instagram: "@repuestos_cali",
    facebook: "RepuestosElectricosCali",
    numero_resenhas: 41,
    valoracion: 4.6,
    horario_atencion: "Lunes a Viernes 8:30 - 18:30, Sábados 9:00 - 15:00",
    servicios: ["Repuestos", "Accesorios", "Instalación", "Asesoría técnica"],
    imagen_url: undefined,
    activo: true,
    fecha_creacion: "2024-01-01T00:00:00Z",
    fecha_actualizacion: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    nombre: "EcoMovilidad Barranquilla",
    descripcion: "Alquiler de patinetas eléctricas por horas y días. Ideal para turismo y movilidad urbana.",
    categoria: "Alquiler de Patinetas",
    telefono: "3058888888",
    email: "alquiler@ecomovilidad.co",
    direccion: "Carrera 53 #72-15",
    ciudad: "Barranquilla",
    departamento: "Atlántico",
    sitio_web: "https://ecomovilidad.co",
    whatsapp: "3058888888",
    instagram: "@ecomovilidad_baq",
    facebook: "EcoMovilidadBarranquilla",
    numero_resenhas: 23,
    valoracion: 4.3,
    horario_atencion: "Todos los días 7:00 - 20:00",
    servicios: ["Alquiler por horas", "Alquiler por días", "Tours guiados", "Entrega a domicilio"],
    imagen_url: undefined,
    activo: true,
    fecha_creacion: "2024-01-01T00:00:00Z",
    fecha_actualizacion: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    nombre: "Scooter Pro Cartagena",
    descripcion: "Venta de patinetas eléctricas premium y servicio técnico especializado en la ciudad heroica.",
    categoria: "Venta de Patinetas Eléctricas",
    telefono: "3069999999",
    email: "info@scooterpro.co",
    direccion: "Avenida Pedro de Heredia #31-45",
    ciudad: "Cartagena",
    departamento: "Bolívar",
    sitio_web: "https://scooterpro.co",
    whatsapp: "3069999999",
    instagram: "@scooterpro_ctg",
    facebook: "ScooterProCartagena",
    numero_resenhas: 35,
    valoracion: 4.9,
    horario_atencion: "Lunes a Sábado 8:00 - 19:00",
    servicios: ["Venta", "Servicio técnico", "Garantía extendida", "Financiación"],
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
      console.log('🔍 Querying Supabase table: diretorio_patinetas')
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .eq('activo', true)
        .order('nombre')

      console.log('📡 Supabase response:', {
        data: data?.length || 0,
        error: error?.message || 'none',
        firstRecord: data?.[0]?.nombre || 'none'
      })

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('❌ Supabase error, using mock data:', error)
      return mockBusinesses
    }
  },

  // Get businesses by category
  async getByCategory(categoria: string) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
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
        .from('diretorio_patinetas')
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
        .from('diretorio_patinetas')
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
        .from('diretorio_patinetas')
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

  // Get business by city and business slugs
  async getBySlugs(citySlug: string, businessSlug: string) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .eq('ciudad_slug', citySlug)
        .eq('slug', businessSlug)
        .eq('activo', true)
        .single()

      if (error) throw error
      return data as NegocioDirectorio
    } catch (error) {
      console.warn('Supabase error, trying fallback lookup:', error)

      // Fallback: try to find by generated slugs from existing data
      try {
        const { generateCitySlug, generateBusinessSlug } = await import('@/lib/slugs')
        const { data: allData, error: allError } = await supabase
          .from('diretorio_patinetas')
          .select('*')
          .eq('activo', true)

        if (allError) throw allError

        const business = allData.find(b =>
          generateCitySlug(b.ciudad) === citySlug &&
          generateBusinessSlug(b.nombre) === businessSlug
        )

        if (!business) throw new Error('Business not found')
        return business as NegocioDirectorio
      } catch (fallbackError) {
        console.warn('Fallback lookup failed:', fallbackError)
        throw new Error('Business not found')
      }
    }
  },

  // Get category by slug
  async getCategoryBySlug(categorySlug: string) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .select('*')
        .eq('slug', categorySlug)
        .eq('activo', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn('Category not found:', error)
      return null
    }
  },

  // Get business by category, city and business slugs (NEW URL STRUCTURE)
  async getByFullSlugs(categorySlug: string, citySlug: string, businessSlug: string) {
    try {
      // First, validate that the category exists
      const category = await this.getCategoryBySlug(categorySlug)
      if (!category) {
        throw new Error('Category not found')
      }

      // Then get the business
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .eq('ciudad_slug', citySlug)
        .eq('slug', businessSlug)
        .eq('activo', true)
        .single()

      if (error) throw error

      // Verify that the business belongs to the requested category
      const { getCategorySlug } = await import('@/lib/slugs')
      const businessCategorySlug = getCategorySlug(data.categoria)

      if (businessCategorySlug !== categorySlug) {
        throw new Error('Business does not belong to this category')
      }

      return data as NegocioDirectorio
    } catch (error) {
      console.warn('Supabase error in getByFullSlugs:', error)

      // Fallback: try to find by generated slugs from existing data
      try {
        const { getCategorySlug, generateCitySlug, generateBusinessSlug } = await import('@/lib/slugs')
        const { data: allData, error: allError } = await supabase
          .from('diretorio_patinetas')
          .select('*')
          .eq('activo', true)

        if (allError) throw allError

        const business = allData.find(b => {
          const businessCategorySlug = getCategorySlug(b.categoria)
          const businessCitySlug = generateCitySlug(b.ciudad)
          const businessNameSlug = generateBusinessSlug(b.nombre)

          return businessCategorySlug === categorySlug &&
                 businessCitySlug === citySlug &&
                 businessNameSlug === businessSlug
        })

        if (!business) throw new Error('Business not found')
        return business as NegocioDirectorio
      } catch (fallbackError) {
        console.warn('Fallback lookup failed:', fallbackError)
        throw new Error('Business not found')
      }
    }
  },

  // Get featured businesses for home page
  async getFeatured(limit = 8) {
    try {
      console.log('🔍 Querying featured businesses from Supabase')
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .eq('activo', true)
        .order('valoracion', { ascending: false })
        .order('numero_resenhas', { ascending: false })
        .order('fecha_creacion', { ascending: false })
        .limit(limit)

      console.log('📡 Featured businesses response:', {
        data: data?.length || 0,
        error: error?.message || 'none',
        firstRecord: data?.[0]?.nombre || 'none'
      })

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('❌ Supabase error for featured businesses, using mock data:', error)
      // Return a curated selection of mock businesses for featured display
      return mockBusinesses
        .filter(b => b.valoracion && b.valoracion >= 4.0) // Only high-rated businesses
        .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0))
        .slice(0, limit)
    }
  },

  // Get unique categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .select('nombre, icono')
        .eq('activo', true)
        .order('orden', { ascending: true })

      if (error) throw error

      return data?.map(cat => ({
        nombre: cat.nombre,
        icono: cat.icono
      })) || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  // Get unique cities
  async getCities() {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
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
  },

  // Get unique departments with business count
  async getDepartments() {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('departamento')
        .eq('activo', true)

      if (error) throw error

      // Count businesses per department
      const departmentCounts = data.reduce((acc, item) => {
        const dept = item.departamento
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Convert to array and sort alphabetically
      return Object.entries(departmentCounts)
        .map(([departamento, count]) => ({ departamento, count }))
        .sort((a, b) => a.departamento.localeCompare(b.departamento, 'es'))
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      const departmentCounts = mockBusinesses.reduce((acc, b) => {
        acc[b.departamento] = (acc[b.departamento] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(departmentCounts)
        .map(([departamento, count]) => ({ departamento, count }))
        .sort((a, b) => a.departamento.localeCompare(b.departamento, 'es'))
    }
  },

  // Get businesses by department
  async getByDepartment(departamento: string) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .eq('departamento', departamento)
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return mockBusinesses.filter(b => b.departamento === departamento)
    }
  },

  // Generate and update slugs for all businesses (migration helper)
  async generateSlugsForAllBusinesses() {
    try {
      const { generateCitySlug, generateUniqueBusinessSlug } = await import('@/lib/slugs')

      // Get all businesses
      const { data: businesses, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .order('id')

      if (error) throw error

      const updates = []

      for (const business of businesses) {
        const citySlug = generateCitySlug(business.ciudad)
        const businessSlug = generateUniqueBusinessSlug(
          business.nombre,
          business.ciudad,
          businesses
        )

        updates.push({
          id: business.id,
          slug: businessSlug,
          ciudad_slug: citySlug
        })
      }

      // Update all businesses with their slugs
      for (const update of updates) {
        await supabase
          .from('diretorio_patinetas')
          .update({
            slug: update.slug,
            ciudad_slug: update.ciudad_slug,
            fecha_actualizacion: new Date().toISOString()
          })
          .eq('id', update.id)
      }

      return { success: true, updated: updates.length }
    } catch (error) {
      console.error('Error generating slugs:', error)
      throw error
    }
  }
}

// Admin service methods for managing businesses
export const adminService = {
  // Get all businesses (including inactive ones) for admin
  async getAllForAdmin() {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .order('fecha_creacion', { ascending: false })

      if (error) throw error
      return data as NegocioDirectorio[]
    } catch (error) {
      console.error('Error fetching businesses for admin:', error)
      throw error
    }
  },

  // Create a new business
  async createBusiness(business: Omit<NegocioDirectorio, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .insert([business])
        .select()
        .single()

      if (error) throw error
      return data as NegocioDirectorio
    } catch (error) {
      console.error('Error creating business:', error)
      throw error
    }
  },

  // Update an existing business
  async updateBusiness(id: number, updates: Partial<Omit<NegocioDirectorio, 'id' | 'fecha_creacion'>>) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .update({ ...updates, fecha_actualizacion: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as NegocioDirectorio
    } catch (error) {
      console.error('Error updating business:', error)
      throw error
    }
  },

  // Delete a business (soft delete by setting activo to false)
  async deleteBusiness(id: number) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .update({ activo: false, fecha_actualizacion: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as NegocioDirectorio
    } catch (error) {
      console.error('Error deleting business:', error)
      throw error
    }
  },

  // Hard delete a business (permanent removal)
  async hardDeleteBusiness(id: number) {
    try {
      const { error } = await supabase
        .from('diretorio_patinetas')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error hard deleting business:', error)
      throw error
    }
  },

  // Reactivate a business
  async reactivateBusiness(id: number) {
    try {
      const { data, error } = await supabase
        .from('diretorio_patinetas')
        .update({ activo: true, fecha_actualizacion: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as NegocioDirectorio
    } catch (error) {
      console.error('Error reactivating business:', error)
      throw error
    }
  },

  // Duplicate a business (create a copy with modified name and new slug)
  async duplicateBusiness(id: number) {
    try {
      // First, fetch the original business
      const { data: originalBusiness, error: fetchError } = await supabase
        .from('diretorio_patinetas')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (!originalBusiness) throw new Error('Business not found')

      // Create a copy with modified fields
      const duplicatedBusiness = {
        ...originalBusiness,
        // Remove fields that should be auto-generated or reset
        id: undefined,
        fecha_creacion: undefined,
        fecha_actualizacion: undefined,
        // Modify the name to indicate it's a duplicate
        nombre: `${originalBusiness.nombre} - Sucursal`,
        // Generate a new slug based on the new name
        slug: undefined, // Will be generated by database or application logic
        // Set as active by default
        activo: true
      }

      // Remove undefined fields
      const cleanedBusiness = Object.fromEntries(
        Object.entries(duplicatedBusiness).filter(([_, value]) => value !== undefined)
      )

      // Insert the duplicated business
      const { data: newBusiness, error: insertError } = await supabase
        .from('diretorio_patinetas')
        .insert([cleanedBusiness])
        .select()
        .single()

      if (insertError) throw insertError
      return newBusiness as NegocioDirectorio
    } catch (error) {
      console.error('Error duplicating business:', error)
      throw error
    }
  }
}

// Category service functions
export const categoryService = {
  // Get all categories (active only for public, all for admin)
  async getAll(includeInactive = false) {
    try {
      let query = supabase
        .from('categorias_patinetas')
        .select('*')
        .order('orden', { ascending: true })

      if (!includeInactive) {
        query = query.eq('activo', true)
      }

      const { data, error } = await query

      if (error) throw error
      return data as CategoriaPatineta[]
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  // Get category by ID
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as CategoriaPatineta
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  },

  // Create new category
  async create(category: Omit<CategoriaPatineta, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .insert([category])
        .select()
        .single()

      if (error) throw error
      return data as CategoriaPatineta
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  // Update category
  async update(id: string, updates: Partial<Omit<CategoriaPatineta, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as CategoriaPatineta
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  // Soft delete category (mark as inactive)
  async softDelete(id: string) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .update({ activo: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as CategoriaPatineta
    } catch (error) {
      console.error('Error soft deleting category:', error)
      throw error
    }
  },

  // Hard delete category (only if no businesses use it)
  async hardDelete(id: string) {
    try {
      // First check if any businesses use this category
      const businessCount = await this.getBusinessCount(id)
      if (businessCount > 0) {
        throw new Error(`No se puede eliminar la categoría porque ${businessCount} negocio(s) la están usando`)
      }

      const { error } = await supabase
        .from('categorias_patinetas')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error hard deleting category:', error)
      throw error
    }
  },

  // Get count of businesses using this category
  async getBusinessCount(categoryId: string) {
    try {
      const { count, error } = await supabase
        .from('diretorio_patinetas')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
        .eq('activo', true)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error getting business count for category:', error)
      return 0
    }
  },

  // Reactivate category
  async reactivate(id: string) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .update({ activo: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as CategoriaPatineta
    } catch (error) {
      console.error('Error reactivating category:', error)
      throw error
    }
  },

  // Get category by slug
  async getBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('categorias_patinetas')
        .select('*')
        .eq('slug', slug)
        .eq('activo', true)
        .single()

      if (error) throw error
      return data as CategoriaPatineta
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      throw error
    }
  },

  // Check if slug is available
  async isSlugAvailable(slug: string, excludeId?: string) {
    try {
      let query = supabase
        .from('categorias_patinetas')
        .select('id')
        .eq('slug', slug)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query

      if (error) throw error
      return data.length === 0
    } catch (error) {
      console.error('Error checking slug availability:', error)
      return false
    }
  },

  // Generate slugs for all categories that don't have one
  async generateSlugsForAllCategories() {
    try {
      const { generateUniqueCategorySlug } = await import('@/lib/slugs')

      // Get all categories
      const categories = await this.getAll(true)

      // Filter categories without slugs
      const categoriesWithoutSlugs = categories.filter(cat => !cat.slug)

      if (categoriesWithoutSlugs.length === 0) {
        console.log('All categories already have slugs')
        return { updated: 0, total: categories.length }
      }

      let updated = 0

      for (const category of categoriesWithoutSlugs) {
        const slug = generateUniqueCategorySlug(category.nombre, categories)

        const { error } = await supabase
          .from('categorias_patinetas')
          .update({ slug })
          .eq('id', category.id)

        if (error) {
          console.error(`Error updating slug for category ${category.nombre}:`, error)
        } else {
          console.log(`Generated slug for category "${category.nombre}": ${slug}`)
          updated++
        }
      }

      return { updated, total: categories.length }
    } catch (error) {
      console.error('Error generating slugs for categories:', error)
      throw error
    }
  },

  // Update category order
  async updateOrder(categoryUpdates: { id: string; orden: number }[]) {
    try {
      const promises = categoryUpdates.map(({ id, orden }) =>
        supabase
          .from('categorias_patinetas')
          .update({ orden })
          .eq('id', id)
      )

      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Error updating category order:', error)
      throw error
    }
  }
}

// Brand service functions
export const brandService = {
  // Get all brands (active only for public, all for admin)
  async getAll(includeInactive = false) {
    try {
      let query = supabase
        .from('marcas_patinetas')
        .select('*')
        .order('orden', { ascending: true })

      if (!includeInactive) {
        query = query.eq('activo', true)
      }

      const { data, error } = await query

      if (error) throw error

      // Add slugs to brands
      const { getBrandSlug } = await import('./slugs')
      const brandsWithSlugs = data.map(brand => ({
        ...brand,
        slug: getBrandSlug(brand.nombre)
      }))

      return brandsWithSlugs as MarcaPatineta[]
    } catch (error) {
      console.error('Error fetching brands:', error)
      return []
    }
  },

  // Get brand by ID
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('marcas_patinetas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as MarcaPatineta
    } catch (error) {
      console.error('Error fetching brand:', error)
      throw error
    }
  },

  // Get brand by slug
  async getBySlug(slug: string) {
    try {
      console.log(`[DEBUG] brandService.getBySlug called with slug: ${slug}`)
      console.log(`[DEBUG] Environment: ${process.env.NODE_ENV}`)
      console.log(`[DEBUG] Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...`)

      const { getBrandSlug } = await import('./slugs')

      // Get all brands and find the one with matching slug
      console.log(`[DEBUG] Fetching all brands...`)
      const brands = await this.getAll()
      console.log(`[DEBUG] Found ${brands.length} brands total`)

      if (brands.length === 0) {
        console.error('[ERROR] No brands found in database!')
        throw new Error('No brands found in database')
      }

      // Debug: show all brand slugs
      const brandSlugs = brands.map(b => ({ name: b.nombre, slug: getBrandSlug(b.nombre) }))
      console.log(`[DEBUG] Available brand slugs:`, brandSlugs)

      const brand = brands.find(b => getBrandSlug(b.nombre) === slug)
      console.log(`[DEBUG] Brand match for slug '${slug}':`, brand ? `${brand.nombre} (${brand.id})` : 'null')

      if (!brand) {
        console.error(`[ERROR] Brand not found for slug: ${slug}`)
        console.error(`[ERROR] Available slugs: ${brandSlugs.map(b => b.slug).join(', ')}`)
        throw new Error(`Brand not found for slug: ${slug}`)
      }

      return brand
    } catch (error) {
      console.error('[ERROR] Error fetching brand by slug:', error)
      console.error('[ERROR] Error type:', typeof error)
      console.error('[ERROR] Error message:', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  },

  // Create new brand
  async create(brand: Omit<MarcaPatineta, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('marcas_patinetas')
        .insert([brand])
        .select()
        .single()

      if (error) throw error
      return data as MarcaPatineta
    } catch (error) {
      console.error('Error creating brand:', error)
      throw error
    }
  },

  // Update brand
  async update(id: string, updates: Partial<Omit<MarcaPatineta, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('marcas_patinetas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as MarcaPatineta
    } catch (error) {
      console.error('Error updating brand:', error)
      throw error
    }
  },

  // Soft delete brand (mark as inactive)
  async softDelete(id: string) {
    try {
      const { data, error } = await supabase
        .from('marcas_patinetas')
        .update({ activo: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as MarcaPatineta
    } catch (error) {
      console.error('Error soft deleting brand:', error)
      throw error
    }
  },

  // Hard delete brand (only if no models use it)
  async hardDelete(id: string) {
    try {
      // First check if any models use this brand
      const modelCount = await this.getModelCount(id)
      if (modelCount > 0) {
        throw new Error(`No se puede eliminar la marca porque ${modelCount} modelo(s) la están usando`)
      }

      const { error } = await supabase
        .from('marcas_patinetas')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error hard deleting brand:', error)
      throw error
    }
  },

  // Get count of models using this brand
  async getModelCount(brandId: string) {
    try {
      const { count, error } = await supabase
        .from('modelos_patinetas')
        .select('*', { count: 'exact', head: true })
        .eq('marca_id', brandId)
        .eq('activo', true)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error getting model count for brand:', error)
      return 0
    }
  },

  // Reactivate brand
  async reactivate(id: string) {
    try {
      const { data, error } = await supabase
        .from('marcas_patinetas')
        .update({ activo: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as MarcaPatineta
    } catch (error) {
      console.error('Error reactivating brand:', error)
      throw error
    }
  }
}

// Model service functions
export const modelService = {
  // Get all models with brand information
  async getAll(includeInactive = false) {
    try {
      let query = supabase
        .from('modelos_patinetas')
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .order('orden', { ascending: true })

      if (!includeInactive) {
        query = query.eq('activo', true).eq('disponible_colombia', true)
      }

      const { data, error } = await query

      if (error) throw error

      // Add slug to each model
      const { generateUniqueModelSlug } = await import('./slugs')
      const modelsWithSlugs = (data as ModeloPatineta[]).map(model => {
        if (model.marca) {
          model.slug = generateUniqueModelSlug(model.nombre, model.marca.nombre, data)
        }
        return model
      })

      return modelsWithSlugs
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  },

  // Get models by brand
  async getByBrand(brandId: string, includeInactive = false) {
    try {
      let query = supabase
        .from('modelos_patinetas')
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .eq('marca_id', brandId)
        .order('orden', { ascending: true })

      if (!includeInactive) {
        query = query.eq('activo', true).eq('disponible_colombia', true)
      }

      const { data, error } = await query

      if (error) throw error
      return data as ModeloPatineta[]
    } catch (error) {
      console.error('Error fetching models by brand:', error)
      return []
    }
  },

  // Get model by ID
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('modelos_patinetas')
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Add slug to the model
      const model = data as ModeloPatineta
      if (model.marca) {
        const { generateUniqueModelSlug } = await import('./slugs')
        const allModels = await this.getAll(true) // Get all models for uniqueness check
        model.slug = generateUniqueModelSlug(model.nombre, model.marca.nombre, allModels)
      }

      return model
    } catch (error) {
      console.error('Error fetching model:', error)
      throw error
    }
  },

  // Get model by brand and model slugs
  async getByBrandAndModelSlugs(brandSlug: string, modelSlug: string) {
    try {
      console.log(`[DEBUG] modelService.getByBrandAndModelSlugs called with brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)

      // Get all models to find the one matching both brand and model slugs
      const allModels = await this.getAll()
      console.log(`[DEBUG] Found ${allModels.length} models total`)

      // Import slug functions
      const { getBrandSlug, generateUniqueModelSlug } = await import('./slugs')

      // Find model that matches both brand and model slugs
      const matchingModel = allModels.find(model => {
        if (!model.marca) return false

        const modelBrandSlug = getBrandSlug(model.marca.nombre)
        const modelModelSlug = generateUniqueModelSlug(model.nombre, model.marca.nombre, allModels)

        return modelBrandSlug === brandSlug && modelModelSlug === modelSlug
      })

      if (matchingModel) {
        console.log(`[DEBUG] Model match found: ${matchingModel.nombre} by ${matchingModel.marca?.nombre}`)
      } else {
        console.log(`[DEBUG] No model found for brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
      }

      return matchingModel || null
    } catch (error) {
      console.error('[ERROR] Error fetching model by slugs:', error)
      throw error
    }
  },

  // Search models
  async search(query: string, filters?: {
    brandId?: string
    priceMin?: number
    priceMax?: number
    speedMin?: number
    speedMax?: number
    rangeMin?: number
    rangeMax?: number
  }) {
    try {
      let dbQuery = supabase
        .from('modelos_patinetas')
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .eq('activo', true)
        .eq('disponible_colombia', true)

      // Text search
      if (query) {
        dbQuery = dbQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
      }

      // Apply filters
      if (filters?.brandId) {
        dbQuery = dbQuery.eq('marca_id', filters.brandId)
      }
      if (filters?.priceMin) {
        dbQuery = dbQuery.gte('precio_min', filters.priceMin)
      }
      if (filters?.priceMax) {
        dbQuery = dbQuery.lte('precio_max', filters.priceMax)
      }
      if (filters?.speedMin) {
        dbQuery = dbQuery.gte('velocidad_maxima', filters.speedMin)
      }
      if (filters?.speedMax) {
        dbQuery = dbQuery.lte('velocidad_maxima', filters.speedMax)
      }
      if (filters?.rangeMin) {
        dbQuery = dbQuery.gte('autonomia', filters.rangeMin)
      }
      if (filters?.rangeMax) {
        dbQuery = dbQuery.lte('autonomia', filters.rangeMax)
      }

      dbQuery = dbQuery.order('orden', { ascending: true })

      const { data, error } = await dbQuery

      if (error) throw error
      return data as ModeloPatineta[]
    } catch (error) {
      console.error('Error searching models:', error)
      return []
    }
  },

  // Create new model
  async create(model: Omit<ModeloPatineta, 'id' | 'created_at' | 'updated_at' | 'marca'>) {
    try {
      const { data, error } = await supabase
        .from('modelos_patinetas')
        .insert([model])
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .single()

      if (error) throw error
      return data as ModeloPatineta
    } catch (error) {
      console.error('Error creating model:', error)
      throw error
    }
  },

  // Update model
  async update(id: string, updates: Partial<Omit<ModeloPatineta, 'id' | 'created_at' | 'updated_at' | 'marca'>>) {
    try {
      const { data, error } = await supabase
        .from('modelos_patinetas')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .single()

      if (error) throw error
      return data as ModeloPatineta
    } catch (error) {
      console.error('Error updating model:', error)
      throw error
    }
  },

  // Soft delete model
  async softDelete(id: string) {
    try {
      const { data, error } = await supabase
        .from('modelos_patinetas')
        .update({ activo: false })
        .eq('id', id)
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .single()

      if (error) throw error
      return data as ModeloPatineta
    } catch (error) {
      console.error('Error soft deleting model:', error)
      throw error
    }
  },

  // Hard delete model
  async hardDelete(id: string) {
    try {
      const { error } = await supabase
        .from('modelos_patinetas')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error hard deleting model:', error)
      throw error
    }
  },

  // Reactivate model
  async reactivate(id: string) {
    try {
      const { data, error } = await supabase
        .from('modelos_patinetas')
        .update({ activo: true })
        .eq('id', id)
        .select(`
          *,
          marca:marcas_patinetas(*)
        `)
        .single()

      if (error) throw error
      return data as ModeloPatineta
    } catch (error) {
      console.error('Error reactivating model:', error)
      throw error
    }
  }
}

// File upload service functions
export const uploadService = {
  // Upload brand logo to Supabase Storage
  async uploadBrandLogo(file: File, brandId?: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${brandId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `logos/${fileName}`

      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from('brand-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading brand logo:', error)
      throw error
    }
  },

  // Upload model image to Supabase Storage
  async uploadModelImage(file: File, modelId?: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${modelId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `models/${fileName}`

      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from('model-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading model image:', error)
      throw error
    }
  },

  // Upload business image to Supabase Storage
  async uploadBusinessImage(file: File, businessId?: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `business-${businessId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Use brand-logos bucket with businesses folder for now
      // TODO: Create dedicated business-images bucket later
      const bucketName = 'brand-logos'
      const filePath = `businesses/${fileName}`

      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading business image:', error)
      throw error
    }
  },

  // Delete brand logo from Supabase Storage
  async deleteBrandLogo(logoUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const url = new URL(logoUrl)
      const pathParts = url.pathname.split('/')
      const bucketIndex = pathParts.findIndex(part => part === 'brand-logos')

      if (bucketIndex === -1) {
        throw new Error('Invalid logo URL format')
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/')

      const { error } = await supabase.storage
        .from('brand-logos')
        .remove([filePath])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting brand logo:', error)
      // Don't throw error for delete operations to avoid blocking other operations
      return false
    }
  },

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no válido. Solo se permiten PNG, JPG, JPEG, SVG y WebP.'
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. El tamaño máximo es 5MB.'
      }
    }

    return { valid: true }
  },

  // Get file info for preview
  getFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}
