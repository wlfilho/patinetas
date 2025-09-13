import { ModeloPatineta } from '@/lib/supabase'

interface CatalogStructuredDataProps {
  models?: ModeloPatineta[]
}

export function CatalogStructuredData({ models = [] }: CatalogStructuredDataProps) {
  const baseUrl = 'https://staging.motoselectricas.com.co'

  // Product catalog structured data
  const catalogData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Catálogo de Patinetas Eléctricas Colombia",
    "description": "Catálogo completo de patinetas eléctricas disponibles en Colombia con especificaciones y precios",
    "url": `${baseUrl}/catalogo`,
    "numberOfItems": models.length,
    "itemListElement": models.map((model, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${model.marca?.nombre} ${model.nombre}`,
        "description": model.descripcion,
        "brand": {
          "@type": "Brand",
          "name": model.marca?.nombre,
          "url": model.marca?.sitio_web
        },
        "image": model.imagen_url,
        "url": `${baseUrl}/catalogo/${model.id}`,
        ...(model.precio_min && model.precio_max && {
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "COP",
            "lowPrice": model.precio_min,
            "highPrice": model.precio_max,
            "availability": "https://schema.org/InStock"
          }
        }),
        "additionalProperty": [
          ...(model.velocidad_maxima ? [{
            "@type": "PropertyValue",
            "name": "Velocidad Máxima",
            "value": `${model.velocidad_maxima} km/h`
          }] : []),
          ...(model.autonomia ? [{
            "@type": "PropertyValue",
            "name": "Autonomía",
            "value": `${model.autonomia} km`
          }] : []),
          ...(model.peso ? [{
            "@type": "PropertyValue",
            "name": "Peso",
            "value": `${model.peso} kg`
          }] : []),
          ...(model.potencia ? [{
            "@type": "PropertyValue",
            "name": "Potencia",
            "value": `${model.potencia} W`
          }] : [])
        ]
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogData) }}
    />
  )
}

interface ModelStructuredDataProps {
  model: ModeloPatineta
}

export function ModelStructuredData({ model }: ModelStructuredDataProps) {
  const baseUrl = 'https://staging.motoselectricas.com.co'

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${model.marca?.nombre} ${model.nombre}`,
    "description": model.descripcion,
    "brand": {
      "@type": "Brand",
      "name": model.marca?.nombre,
      "url": model.marca?.sitio_web
    },
    "image": model.imagen_url,
    "url": `${baseUrl}/catalogo/${model.id}`,
    ...(model.precio_min && model.precio_max && {
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "COP",
        "lowPrice": model.precio_min,
        "highPrice": model.precio_max,
        "availability": "https://schema.org/InStock"
      }
    }),
    "additionalProperty": [
      ...(model.velocidad_maxima ? [{
        "@type": "PropertyValue",
        "name": "Velocidad Máxima",
        "value": `${model.velocidad_maxima} km/h`
      }] : []),
      ...(model.autonomia ? [{
        "@type": "PropertyValue",
        "name": "Autonomía",
        "value": `${model.autonomia} km`
      }] : []),
      ...(model.peso ? [{
        "@type": "PropertyValue",
        "name": "Peso",
        "value": `${model.peso} kg`
      }] : []),
      ...(model.potencia ? [{
        "@type": "PropertyValue",
        "name": "Potencia",
        "value": `${model.potencia} W`
      }] : []),
      ...(model.tiempo_carga ? [{
        "@type": "PropertyValue",
        "name": "Tiempo de Carga",
        "value": `${model.tiempo_carga} horas`
      }] : [])
    ],
    "category": "Patinetas Eléctricas",
    "manufacturer": {
      "@type": "Organization",
      "name": model.marca?.nombre,
      "url": model.marca?.sitio_web
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
    />
  )
}
