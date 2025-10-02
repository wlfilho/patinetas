/**
 * Utility functions for generating and handling SEO-friendly slugs
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug (lowercase, hyphens, no special characters)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Normalize Spanish characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
}

/**
 * Convert a slug back to a more readable format (for display purposes)
 * @param slug - The slug to convert
 * @returns A more readable string
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Validate if a string is a valid slug format
 * @param slug - The slug to validate
 * @returns True if the slug is valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false
  }

  // Check if slug matches the expected pattern: lowercase letters, numbers, and hyphens only
  // Must not start or end with hyphen, and no consecutive hyphens
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/
  return slugPattern.test(slug.trim())
}

/**
 * Generate a brand slug from brand name
 * @param brandName - The brand name
 * @returns A URL-friendly brand slug
 */
export function generateBrandSlug(brandName: string): string {
  return generateSlug(brandName)
}

/**
 * Common brand slug mappings for well-known brands
 * This ensures consistent slugs for popular brands
 */
export const BRAND_SLUG_MAPPINGS: Record<string, string> = {
  'xiaomi': 'xiaomi',
  'segway': 'segway',
  'ninebot': 'ninebot',
  'razor': 'razor',
  'swagtron': 'swagtron',
  'gotrax': 'gotrax',
  'hiboy': 'hiboy',
  'turboant': 'turboant',
  'apollo': 'apollo',
  'kaabo': 'kaabo',
  'dualtron': 'dualtron',
  'zero': 'zero',
  'inokim': 'inokim',
  'minimotors': 'minimotors',
  'vsett': 'vsett'
}

/**
 * Get the preferred slug for a brand name
 * Uses predefined mappings for consistency, falls back to generated slug
 * @param brandName - The brand name
 * @returns The preferred slug for the brand
 */
export function getBrandSlug(brandName: string): string {
  const normalizedName = brandName.toLowerCase().trim()
  
  // Check if we have a predefined mapping
  if (BRAND_SLUG_MAPPINGS[normalizedName]) {
    return BRAND_SLUG_MAPPINGS[normalizedName]
  }
  
  // Fall back to generated slug
  return generateBrandSlug(brandName)
}

/**
 * Generate a model slug from model name
 * @param modelName - The model name
 * @returns A URL-friendly model slug
 */
export function generateModelSlug(modelName: string): string {
  return generateSlug(modelName)
}

/**
 * Get the preferred slug for a model name
 * @param modelName - The model name
 * @returns The preferred slug for the model
 */
export function getModelSlug(modelName: string): string {
  return generateModelSlug(modelName)
}

/**
 * Generate a unique model slug that includes brand information if needed
 * @param modelName - The model name
 * @param brandName - The brand name (for uniqueness)
 * @param existingModels - Array of existing models to check for duplicates
 * @returns A unique URL-friendly model slug
 */
export function generateUniqueModelSlug(
  modelName: string,
  brandName: string,
  existingModels: Array<{ nombre: string; marca?: { nombre: string } }> = []
): string {
  const baseSlug = generateModelSlug(modelName)

  // Check if this slug already exists for a different brand
  const conflictingModel = existingModels.find(model =>
    generateModelSlug(model.nombre) === baseSlug &&
    model.marca?.nombre !== brandName
  )

  // If there's a conflict, append brand name to make it unique
  if (conflictingModel) {
    const brandSlug = generateBrandSlug(brandName)
    return `${baseSlug}-${brandSlug}`
  }

  return baseSlug
}

/**
 * Create a full model URL path from brand and model names
 * @param brandName - The brand name
 * @param modelName - The model name
 * @param existingModels - Array of existing models to check for duplicates
 * @returns The full URL path for the model
 */
export function createModelUrlPath(
  brandName: string,
  modelName: string,
  existingModels: Array<{ nombre: string; marca?: { nombre: string } }> = []
): string {
  const brandSlug = getBrandSlug(brandName)
  const modelSlug = generateUniqueModelSlug(modelName, brandName, existingModels)
  return `/catalogo/marcas/${brandSlug}/${modelSlug}`
}

/**
 * Parse a model URL path to extract brand and model slugs
 * @param path - The URL path (e.g., "/catalogo/marcas/xiaomi/mi-electric-scooter-pro-2")
 * @returns Object with brand and model slugs, or null if invalid
 */
export function parseModelUrlPath(path: string): { brandSlug: string; modelSlug: string } | null {
  const match = path.match(/^\/catalogo\/marcas\/([a-z0-9-]+)\/([a-z0-9-]+)$/)
  if (!match) return null

  return {
    brandSlug: match[1],
    modelSlug: match[2]
  }
}



/**
 * Generate a business slug from business name
 * @param businessName - The business name
 * @returns A URL-friendly business slug
 */
export function generateBusinessSlug(businessName: string): string {
  return generateSlug(businessName)
}

/**
 * Generate a city slug from city name
 * @param cityName - The city name
 * @returns A URL-friendly city slug
 */
export function generateCitySlug(cityName: string): string {
  return generateSlug(cityName)
}

/**
 * Common Colombian city slug mappings for consistency
 */
export const CITY_SLUG_MAPPINGS: Record<string, string> = {
  'bogotá': 'bogota',
  'bogota': 'bogota',
  'medellín': 'medellin',
  'medellin': 'medellin',
  'cali': 'cali',
  'barranquilla': 'barranquilla',
  'cartagena': 'cartagena',
  'cúcuta': 'cucuta',
  'cucuta': 'cucuta',
  'bucaramanga': 'bucaramanga',
  'pereira': 'pereira',
  'santa marta': 'santa-marta',
  'ibagué': 'ibague',
  'ibague': 'ibague',
  'pasto': 'pasto',
  'manizales': 'manizales',
  'neiva': 'neiva',
  'villavicencio': 'villavicencio',
  'armenia': 'armenia',
  'valledupar': 'valledupar',
  'montería': 'monteria',
  'monteria': 'monteria',
  'sincelejo': 'sincelejo',
  'popayán': 'popayan',
  'popayan': 'popayan',
  'tunja': 'tunja',
  'florencia': 'florencia',
  'riohacha': 'riohacha',
  'yopal': 'yopal',
  'mocoa': 'mocoa',
  'arauca': 'arauca',
  'mitú': 'mitu',
  'mitu': 'mitu',
  'puerto carreño': 'puerto-carreno',
  'leticia': 'leticia',
  'san josé del guaviare': 'san-jose-del-guaviare',
  'inírida': 'inirida',
  'inirida': 'inirida'
}

/**
 * Get the preferred slug for a city name
 * Uses predefined mappings for consistency, falls back to generated slug
 * @param cityName - The city name
 * @returns The preferred slug for the city
 */
export function getCitySlug(cityName: string): string {
  const normalizedName = cityName.toLowerCase().trim()

  // Check if we have a predefined mapping
  if (CITY_SLUG_MAPPINGS[normalizedName]) {
    return CITY_SLUG_MAPPINGS[normalizedName]
  }

  // Fall back to generated slug
  return generateCitySlug(cityName)
}

/**
 * Generate a category slug from category name
 * @param categoryName - The category name
 * @returns A URL-friendly category slug
 */
export function generateCategorySlug(categoryName: string): string {
  return generateSlug(categoryName)
}

/**
 * Predefined category slug mappings for consistency
 * Maps category names to their preferred slugs
 */
const CATEGORY_SLUG_MAPPINGS: Record<string, string> = {
  'venta de patinetas eléctricas': 'venta-patinetas-electricas',
  'reparación y mantenimiento': 'reparacion-mantenimiento',
  'repuestos y accesorios': 'repuestos-accesorios',
  'alquiler de patinetas': 'alquiler-patinetas',
  'servicio técnico': 'servicio-tecnico',
  'capacitación y cursos': 'capacitacion-cursos',
  'seguros y garantías': 'seguros-garantias',
  'financiamiento': 'financiamiento',
  'importación y distribución': 'importacion-distribucion',
  'personalización y modificación': 'personalizacion-modificacion'
}

/**
 * Generate a department slug from department name
 * @param departmentName - The department name
 * @returns A URL-friendly department slug
 */
export function generateDepartmentSlug(departmentName: string): string {
  return generateSlug(departmentName)
}

/**
 * Predefined department slug mappings for consistency
 * Maps department names to their preferred slugs
 */
const DEPARTMENT_SLUG_MAPPINGS: Record<string, string> = {
  'bogotá d.c.': 'bogota',
  'bogotá': 'bogota',
  'cundinamarca': 'cundinamarca',
  'antioquia': 'antioquia',
  'valle del cauca': 'valle-del-cauca',
  'atlántico': 'atlantico',
  'bolívar': 'bolivar',
  'santander': 'santander',
  'norte de santander': 'norte-de-santander',
  'tolima': 'tolima',
  'huila': 'huila',
  'meta': 'meta',
  'caldas': 'caldas',
  'risaralda': 'risaralda',
  'quindío': 'quindio',
  'nariño': 'narino',
  'cauca': 'cauca',
  'magdalena': 'magdalena',
  'cesar': 'cesar',
  'córdoba': 'cordoba',
  'sucre': 'sucre',
  'la guajira': 'la-guajira',
  'boyacá': 'boyaca',
  'casanare': 'casanare',
  'arauca': 'arauca',
  'caquetá': 'caqueta',
  'putumayo': 'putumayo',
  'amazonas': 'amazonas',
  'guainía': 'guainia',
  'guaviare': 'guaviare',
  'vaupés': 'vaupes',
  'vichada': 'vichada',
  'chocó': 'choco',
  'san andrés y providencia': 'san-andres-y-providencia'
}

/**
 * Get the preferred slug for a department name
 * Uses predefined mappings for consistency, falls back to generated slug
 * @param departmentName - The department name
 * @returns The preferred slug for the department
 */
export function getDepartmentSlug(departmentName: string): string {
  const normalizedName = departmentName.toLowerCase().trim()

  // Check if we have a predefined mapping
  if (DEPARTMENT_SLUG_MAPPINGS[normalizedName]) {
    return DEPARTMENT_SLUG_MAPPINGS[normalizedName]
  }

  // Fall back to generated slug
  return generateDepartmentSlug(departmentName)
}

/**
 * Get the preferred slug for a category name
 * Uses predefined mappings for consistency, falls back to generated slug
 * @param categoryName - The category name
 * @returns The preferred slug for the category
 */
export function getCategorySlug(categoryName: string): string {
  const normalizedName = categoryName.toLowerCase().trim()

  // Check if we have a predefined mapping
  if (CATEGORY_SLUG_MAPPINGS[normalizedName]) {
    return CATEGORY_SLUG_MAPPINGS[normalizedName]
  }

  // Fall back to generated slug
  return generateCategorySlug(categoryName)
}

/**
 * Generate a unique category slug, handling conflicts
 * @param categoryName - The category name
 * @param existingCategories - Array of existing categories to check for conflicts
 * @returns A unique category slug
 */
export function generateUniqueCategorySlug(
  categoryName: string,
  existingCategories: Array<{ nombre: string; slug?: string }> = []
): string {
  const baseSlug = getCategorySlug(categoryName)

  // Check for conflicts
  const conflictingCategories = existingCategories.filter(
    category =>
      category.slug === baseSlug ||
      getCategorySlug(category.nombre) === baseSlug
  )

  if (conflictingCategories.length === 0) {
    return baseSlug
  }

  // Generate unique slug with number suffix
  let counter = 2
  let uniqueSlug = `${baseSlug}-${counter}`

  while (existingCategories.some(category =>
    category.slug === uniqueSlug ||
    getCategorySlug(category.nombre) === uniqueSlug
  )) {
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
  }

  return uniqueSlug
}

/**
 * Generate a unique business slug within a city
 * @param businessName - The business name
 * @param cityName - The city name
 * @param existingBusinesses - Array of existing businesses to check for duplicates
 * @returns A unique URL-friendly business slug
 */
export function generateUniqueBusinessSlug(
  businessName: string,
  cityName: string,
  existingBusinesses: Array<{ nombre: string; ciudad: string; slug?: string }> = []
): string {
  const baseSlug = generateBusinessSlug(businessName)
  const citySlug = getCitySlug(cityName)

  // Check if this slug already exists in the same city
  const conflictingBusiness = existingBusinesses.find(business =>
    (business.slug || generateBusinessSlug(business.nombre)) === baseSlug &&
    getCitySlug(business.ciudad) === citySlug
  )

  // If there's a conflict, append a number to make it unique
  if (conflictingBusiness) {
    let counter = 2
    let uniqueSlug = `${baseSlug}-${counter}`

    while (existingBusinesses.some(business =>
      (business.slug || generateBusinessSlug(business.nombre)) === uniqueSlug &&
      getCitySlug(business.ciudad) === citySlug
    )) {
      counter++
      uniqueSlug = `${baseSlug}-${counter}`
    }

    return uniqueSlug
  }

  return baseSlug
}

/**
 * Create a full business URL path from category, city and business names (NEW STRUCTURE)
 * @param categoryName - The category name
 * @param cityName - The city name
 * @param businessName - The business name
 * @param existingBusinesses - Array of existing businesses to check for duplicates
 * @returns The full URL path for the business
 */
export function createBusinessUrlPath(
  categoryName: string,
  cityName: string,
  businessName: string,
  existingBusinesses: Array<{ nombre: string; ciudad: string; slug?: string }> = []
): string {
  const categorySlug = getCategorySlug(categoryName)
  const citySlug = getCitySlug(cityName)
  const businessSlug = generateUniqueBusinessSlug(businessName, cityName, existingBusinesses)
  return `/${categorySlug}/${citySlug}/${businessSlug}`
}

/**
 * Create a legacy business URL path (OLD STRUCTURE - for backwards compatibility)
 * @param cityName - The city name
 * @param businessName - The business name
 * @param existingBusinesses - Array of existing businesses to check for duplicates
 * @returns The full URL path for the business (old format)
 */
export function createLegacyBusinessUrlPath(
  cityName: string,
  businessName: string,
  existingBusinesses: Array<{ nombre: string; ciudad: string; slug?: string }> = []
): string {
  const citySlug = getCitySlug(cityName)
  const businessSlug = generateUniqueBusinessSlug(businessName, cityName, existingBusinesses)
  return `/negocio/${citySlug}/${businessSlug}`
}

/**
 * Parse a business URL path to extract city and business slugs
 * @param path - The URL path (e.g., "/negocio/bogota/tienda-patinetas-electricas-centro")
 * @returns Object with city and business slugs, or null if invalid
 */
export function parseBusinessUrlPath(path: string): { citySlug: string; businessSlug: string } | null {
  const match = path.match(/^\/negocio\/([a-z0-9-]+)\/([a-z0-9-]+)$/)
  if (!match) return null

  return {
    citySlug: match[1],
    businessSlug: match[2]
  }
}
