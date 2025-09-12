import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format phone number for Colombian format
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Colombian mobile format: +57 3XX XXX XXXX
  if (cleaned.length === 10 && cleaned.startsWith('3')) {
    return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  
  // Colombian landline format: +57 X XXX XXXX
  if (cleaned.length === 7 || cleaned.length === 8) {
    return `+57 ${cleaned}`
  }
  
  return phone
}

// Format WhatsApp URL
export function formatWhatsAppUrl(phone: string, message?: string): string {
  if (!phone) return ''
  
  const cleaned = phone.replace(/\D/g, '')
  const colombianNumber = cleaned.startsWith('57') ? cleaned : `57${cleaned}`
  
  const baseUrl = `https://wa.me/${colombianNumber}`
  
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`
  }
  
  return baseUrl
}

// Generate slug from string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Validate Colombian phone number
export function isValidColombianPhone(phone: string): boolean {
  if (!phone) return false
  
  const cleaned = phone.replace(/\D/g, '')
  
  // Mobile: 10 digits starting with 3
  if (cleaned.length === 10 && cleaned.startsWith('3')) {
    return true
  }
  
  // Landline: 7-8 digits
  if (cleaned.length >= 7 && cleaned.length <= 8) {
    return true
  }
  
  return false
}

// Validate email
export function isValidEmail(email: string): boolean {
  if (!email) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Format business hours
export function formatBusinessHours(hours: string): string {
  if (!hours) return 'Horario no especificado'
  
  // Common patterns for Colombian business hours
  const patterns = [
    { regex: /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/, format: '$1:$2 - $3:$4' },
    { regex: /(\d{1,2})\s*-\s*(\d{1,2})/, format: '$1:00 - $2:00' }
  ]
  
  for (const pattern of patterns) {
    if (pattern.regex.test(hours)) {
      return hours.replace(pattern.regex, pattern.format)
    }
  }
  
  return hours
}

// Get business category icon
export function getCategoryIcon(categoria: string): string {
  const iconMap: Record<string, string> = {
    'Venta de Patinetas Eléctricas': '🛴',
    'Reparación y Mantenimiento': '🔧',
    'Repuestos y Accesorios': '⚙️',
    'Alquiler de Patinetas': '📅',
    'Servicio Técnico Especializado': '🔬',
    'Importadores y Distribuidores': '📦',
    'Tiendas Multimarca': '🏪',
    'Servicio de Delivery': '🚚',
    'Escuelas de Conducción': '🎓',
    'Seguros para Patinetas': '🛡️'
  }
  
  return iconMap[categoria] || '🛴'
}

// SEO helpers
export function generateMetaTitle(title: string, includeBase = true): string {
  const baseTitle = 'Patinetas Eléctricas Colombia'
  
  if (!includeBase) return title
  
  return title ? `${title} | ${baseTitle}` : baseTitle
}

export function generateMetaDescription(description: string, maxLength = 160): string {
  const defaultDescription = 'Encuentra las mejores patinetas eléctricas en Colombia. Directorio completo de tiendas, servicios técnicos, repuestos y más.'
  
  if (!description) return defaultDescription
  
  return truncateText(description, maxLength)
}
