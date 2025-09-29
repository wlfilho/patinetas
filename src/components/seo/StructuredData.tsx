import { NegocioDirectorio } from '@/types'

interface BusinessStructuredDataProps {
  business: NegocioDirectorio
}

export function BusinessStructuredData({ business }: BusinessStructuredDataProps) {
  // Generate URL using slugs if available, fallback to ID
  const businessUrl = business.slug && business.ciudad_slug
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/negocio/${business.ciudad_slug}/${business.slug}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/negocio/${business.id}`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.nombre,
    "description": business.descripcion || `${business.nombre} - ${business.categoria} en ${business.ciudad}, ${business.departamento}`,
    "url": businessUrl,
    "telephone": business.telefono,
    "email": business.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.direccion,
      "addressLocality": business.ciudad,
      "addressRegion": business.departamento,
      "addressCountry": "CO"
    },
    "geo": business.direccion ? {
      "@type": "GeoCoordinates",
      "addressCountry": "CO"
    } : undefined,
    "openingHours": business.horario_atencion,
    "image": business.imagen_url,
    "priceRange": "$$",
    "servesCuisine": undefined,
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "addressCountry": "CO"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": business.categoria,
      "itemListElement": business.servicios?.map((servicio, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": servicio
        },
        "position": index + 1
      }))
    },
    "sameAs": [
      business.sitio_web,
      business.facebook,
      business.instagram
    ].filter(Boolean),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "10"
    }
  }

  // Clean up undefined values
  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData) }}
    />
  )
}

interface DirectoryStructuredDataProps {
  businesses: NegocioDirectorio[]
  category?: string
  city?: string
}

export function DirectoryStructuredData({ businesses, category, city }: DirectoryStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Directorio de Patinetas Eléctricas${category ? ` - ${category}` : ''}${city ? ` en ${city}` : ''} - Colombia`,
    "description": `Encuentra los mejores negocios de patinetas eléctricas${category ? ` especializados en ${category.toLowerCase()}` : ''}${city ? ` en ${city}` : ''} en Colombia`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/directorio`,
    "numberOfItems": businesses.length,
    "itemListElement": businesses.slice(0, 20).map((business, index) => {
      // Generate URL using slugs if available, fallback to ID
      const businessUrl = business.slug && business.ciudad_slug
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/negocio/${business.ciudad_slug}/${business.slug}`
        : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/negocio/${business.id}`

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": business.nombre,
          "description": business.descripcion,
          "url": businessUrl,
        "telephone": business.telefono,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": business.ciudad,
          "addressRegion": business.departamento,
          "addressCountry": "CO"
        },
        "image": business.imagen_url
        }
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Patinetas Eléctricas Colombia",
    "description": "El directorio más completo de patinetas eléctricas en Colombia. Encuentra tiendas, servicios técnicos, repuestos y más.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://patinetaelectrica.com.co",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/buscar?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.facebook.com/patinetas-electricas-colombia",
      "https://www.instagram.com/patinetas_electricas_co",
      "https://twitter.com/patinetas_co"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Patinetas Eléctricas Colombia",
    "description": "Directorio especializado en patinetas eléctricas y movilidad sostenible en Colombia",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://patinetaelectrica.com.co",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57-300-123-4567",
      "contactType": "customer service",
      "availableLanguage": "Spanish"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CO",
      "addressLocality": "Bogotá"
    },
    "sameAs": [
      "https://www.facebook.com/patinetas-electricas-colombia",
      "https://www.instagram.com/patinetas_electricas_co",
      "https://twitter.com/patinetas_co"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
