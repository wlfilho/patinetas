/**
 * Google Analytics 4 Event Tracking Helper
 * 
 * This module provides type-safe functions to track custom events in GA4.
 * All events follow GA4 naming conventions and best practices.
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

/**
 * Check if Google Analytics is loaded and available
 */
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Generic event tracking function
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void => {
  if (!isGALoaded()) {
    console.warn('Google Analytics not loaded. Event not tracked:', eventName)
    return
  }

  try {
    window.gtag!('event', eventName, eventParams)
    console.log('GA4 Event tracked:', eventName, eventParams)
  } catch (error) {
    console.error('Error tracking GA4 event:', error)
  }
}

// ============================================================================
// CUSTOM EVENTS - PACOTE BÁSICO
// ============================================================================

/**
 * Track when a user clicks on a business card
 * 
 * @param businessId - Unique identifier of the business
 * @param businessName - Name of the business
 * @param category - Business category
 * @param city - Business city
 * @param location - Where the card was clicked (e.g., 'home', 'search', 'category_page')
 */
export const trackBusinessCardClick = (params: {
  businessId: number
  businessName: string
  category: string
  city: string
  location: string
}): void => {
  trackEvent('business_card_click', {
    business_id: params.businessId,
    business_name: params.businessName,
    category: params.category,
    city: params.city,
    click_location: params.location,
  })
}

/**
 * Track when a user clicks on a contact button
 * 
 * @param contactType - Type of contact ('whatsapp', 'phone', 'website')
 * @param businessId - Unique identifier of the business
 * @param businessName - Name of the business
 * @param category - Business category
 * @param city - Business city
 * @param location - Where the button was clicked ('card' or 'detail_page')
 */
export const trackContactButtonClick = (params: {
  contactType: 'whatsapp' | 'phone' | 'website'
  businessId: number
  businessName: string
  category: string
  city: string
  location: 'card' | 'detail_page'
}): void => {
  trackEvent('contact_button_click', {
    contact_type: params.contactType,
    business_id: params.businessId,
    business_name: params.businessName,
    category: params.category,
    city: params.city,
    click_location: params.location,
  })
}

/**
 * Track when a user performs a search
 * 
 * @param query - Search query text
 * @param hasFilters - Whether filters were applied
 * @param category - Selected category filter (if any)
 * @param city - Selected city filter (if any)
 * @param resultsCount - Number of results returned
 */
export const trackSearch = (params: {
  query: string
  hasFilters: boolean
  category?: string
  city?: string
  resultsCount: number
}): void => {
  trackEvent('search_used', {
    search_term: params.query,
    has_filters: params.hasFilters,
    filter_category: params.category || 'none',
    filter_city: params.city || 'none',
    results_count: params.resultsCount,
  })
}

/**
 * Track when a user applies filters (without search query)
 * 
 * @param category - Selected category filter (if any)
 * @param city - Selected city filter (if any)
 */
export const trackFilterUsed = (params: {
  category?: string
  city?: string
}): void => {
  trackEvent('filter_used', {
    filter_category: params.category || 'none',
    filter_city: params.city || 'none',
  })
}

// ============================================================================
// ADDITIONAL USEFUL EVENTS (Optional - can be implemented later)
// ============================================================================

/**
 * Track when a user views a business detail page
 * 
 * @param businessId - Unique identifier of the business
 * @param businessName - Name of the business
 * @param category - Business category
 * @param city - Business city
 */
export const trackBusinessView = (params: {
  businessId: number
  businessName: string
  category: string
  city: string
}): void => {
  trackEvent('business_view', {
    business_id: params.businessId,
    business_name: params.businessName,
    category: params.category,
    city: params.city,
  })
}

/**
 * Track when a user clicks on a category card
 * 
 * @param categoryName - Name of the category
 * @param categorySlug - URL slug of the category
 * @param location - Where the category was clicked
 */
export const trackCategoryClick = (params: {
  categoryName: string
  categorySlug: string
  location: string
}): void => {
  trackEvent('category_click', {
    category_name: params.categoryName,
    category_slug: params.categorySlug,
    click_location: params.location,
  })
}

/**
 * Track when a user clicks on a brand
 * 
 * @param brandName - Name of the brand
 * @param brandSlug - URL slug of the brand
 * @param location - Where the brand was clicked
 */
export const trackBrandClick = (params: {
  brandName: string
  brandSlug: string
  location: string
}): void => {
  trackEvent('brand_click', {
    brand_name: params.brandName,
    brand_slug: params.brandSlug,
    click_location: params.location,
  })
}

/**
 * Track when a user clicks on social media links
 * 
 * @param platform - Social media platform ('instagram', 'facebook', 'youtube', 'tiktok')
 * @param businessId - Unique identifier of the business
 * @param businessName - Name of the business
 */
export const trackSocialMediaClick = (params: {
  platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok'
  businessId: number
  businessName: string
}): void => {
  trackEvent('social_media_click', {
    platform: params.platform,
    business_id: params.businessId,
    business_name: params.businessName,
  })
}

/**
 * Track when a user scrolls to a specific section
 * 
 * @param section - Name of the section
 * @param page - Current page
 */
export const trackScrollToSection = (params: {
  section: string
  page: string
}): void => {
  trackEvent('scroll_to_section', {
    section_name: params.section,
    page_path: params.page,
  })
}

