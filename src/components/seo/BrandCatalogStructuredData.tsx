import { MarcaPatineta, ModeloPatineta } from '@/lib/supabase'
import { getBrandSlug } from '@/lib/slugs'

interface BrandCatalogStructuredDataProps {
  brand: MarcaPatineta
  models: ModeloPatineta[]
}

export function BrandCatalogStructuredData({ brand, models }: BrandCatalogStructuredDataProps) {
  const baseUrl = 'https://patinetaelectrica.com.co'
  const brandSlug = getBrandSlug(brand.nombre)

  // Brand structured data
  const brandData = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": brand.nombre,
    "description": brand.descripcion || `Patinetas eléctricas ${brand.nombre} disponibles en Colombia`,
    "logo": brand.logo_url,
    "url": `${baseUrl}/catalogo/marcas/${brandSlug}`,
    ...(brand.sitio_web && { "sameAs": brand.sitio_web }),
    ...(brand.pais_origen && {
      "location": {
        "@type": "Country",
        "name": brand.pais_origen
      }
    })
  }

  // Product catalog structured data
  const catalogData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Catálogo de Patinetas Eléctricas ${brand.nombre}`,
    "description": `Todos los modelos de patinetas eléctricas ${brand.nombre} disponibles en Colombia con especificaciones y precios`,
    "url": `${baseUrl}/catalogo/marcas/${brandSlug}`,
    "numberOfItems": models.length,
    "itemListElement": models.map((model, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${brand.nombre} ${model.nombre}`,
        "description": model.descripcion || `Patineta eléctrica ${brand.nombre} ${model.nombre}`,
        "brand": {
          "@type": "Brand",
          "name": brand.nombre,
          "url": brand.sitio_web
        },
        "image": model.imagen_url,
        "url": `${baseUrl}/modelo/${model.id}`,
        ...(model.precio_min && model.precio_max && {
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "COP",
            "lowPrice": model.precio_min,
            "highPrice": model.precio_max,
            "availability": "https://schema.org/InStock"
          }
        }),
        ...(model.precio_min && !model.precio_max && {
          "offers": {
            "@type": "Offer",
            "priceCurrency": "COP",
            "price": model.precio_min,
            "availability": "https://schema.org/InStock"
          }
        }),
        // Additional product properties
        ...(model.velocidad_maxima && {
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Velocidad Máxima",
              "value": `${model.velocidad_maxima} km/h`
            }
          ]
        }),
        ...(model.autonomia && {
          "additionalProperty": [
            ...(model.velocidad_maxima ? [{
              "@type": "PropertyValue",
              "name": "Velocidad Máxima",
              "value": `${model.velocidad_maxima} km/h`
            }] : []),
            {
              "@type": "PropertyValue",
              "name": "Autonomía",
              "value": `${model.autonomia} km`
            }
          ]
        }),
        ...(model.peso && {
          "weight": {
            "@type": "QuantitativeValue",
            "value": model.peso,
            "unitCode": "KGM"
          }
        })
      }
    }))
  }

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Catálogo",
        "item": `${baseUrl}/catalogo`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${brand.nombre}`,
        "item": `${baseUrl}/catalogo/marcas/${brandSlug}`
      }
    ]
  }

  return (
    <>
      {/* Brand structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(brandData)
        }}
      />
      
      {/* Catalog structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(catalogData)
        }}
      />
      
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
    </>
  )
}
