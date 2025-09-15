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
 * Validate if a slug is valid (contains only lowercase letters, numbers, and hyphens)
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0
}
