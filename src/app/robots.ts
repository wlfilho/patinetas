import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        // TEMPORARY: Hide catalog from search engines until model data is fully populated
        // TODO: Remove these lines once electric scooter specifications are complete
        '/catalogo',
        '/catalogo/*',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/sitemap.xml`,
  }
}
