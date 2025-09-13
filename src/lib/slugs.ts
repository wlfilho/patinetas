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
 * Validate if a slug is valid (contains only lowercase letters, numbers, and hyphens)
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0
}
