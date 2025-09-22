import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use environment variable for base URL, fallback to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

  return {
    rules: [
      // Allow all search engines to crawl public content
      {
        userAgent: '*',
        allow: [
          '/',
          '/directorio',
          '/directorio/*',
          '/catalogo',
          '/catalogo/*',
          '/categorias',
          '/categorias/*',
          '/ciudades',
          '/ciudades/*',
          '/negocio/*',
          '/buscar',
          '/contacto',
          '/acerca',
          '/guia',
          '/faq',
          '/terminos',
          '/privacidad',
          '/ayuda',
          '/agregar-negocio',
        ],
        disallow: [
          // Block admin areas
          '/admin',
          '/admin/*',
          // Block API endpoints
          '/api/',
          '/api/*',
          // Block Next.js internal files
          '/_next/',
          '/_next/*',
          // Block private/internal paths
          '/private/',
          '/private/*',
          // Block temporary/development paths
          '/temp/',
          '/temp/*',
          '/test/',
          '/test/*',
          // Block pagination beyond reasonable limits (avoid infinite crawling)
          '/directorio/p/[5-9][0-9]*',
          '/directorio/p/[1-9][0-9][0-9]*',
          // Block search result pages with complex parameters
          '/buscar?*&*&*',
        ],
        crawlDelay: 1, // Be respectful to server resources
      },
      // Specific rules for Googlebot (more permissive)
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/directorio',
          '/directorio/*',
          '/catalogo',
          '/catalogo/*',
          '/categorias',
          '/categorias/*',
          '/ciudades',
          '/ciudades/*',
          '/negocio/*',
          '/buscar',
          '/contacto',
          '/acerca',
          '/guia',
          '/faq',
          '/terminos',
          '/privacidad',
          '/ayuda',
          '/agregar-negocio',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/',
          '/api/*',
          '/_next/',
          '/_next/*',
          '/private/',
          '/private/*',
        ],
      },
      // Rules for Bingbot
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/directorio',
          '/directorio/*',
          '/catalogo',
          '/catalogo/*',
          '/categorias',
          '/categorias/*',
          '/ciudades',
          '/ciudades/*',
          '/negocio/*',
          '/buscar',
          '/contacto',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/',
          '/api/*',
          '/_next/',
          '/_next/*',
          '/private/',
          '/private/*',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
