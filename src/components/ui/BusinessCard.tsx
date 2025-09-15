import Link from 'next/link'
import Image from 'next/image'
import { NegocioDirectorio } from '@/types'
import { formatWhatsAppUrl, getCategoryIcon } from '@/lib/utils'
import { getCitySlug, generateBusinessSlug } from '@/lib/slugs'

interface BusinessCardProps {
  business: NegocioDirectorio
  featured?: boolean
}

export default function BusinessCard({ business, featured = false }: BusinessCardProps) {
  const categoryIcon = getCategoryIcon(business.categoria)
  const whatsappUrl = business.whatsapp ? formatWhatsAppUrl(business.whatsapp, `Hola, me interesa conocer más sobre ${business.nombre}`) : null

  // Generate SEO-friendly URL
  const citySlug = business.ciudad_slug || getCitySlug(business.ciudad)
  const businessSlug = business.slug || generateBusinessSlug(business.nombre)
  const businessUrl = `/negocio/${citySlug}/${businessSlug}`

  return (
    <div className={`
      bg-white rounded-xl border border-gray-200 overflow-hidden
      hover:shadow-lg hover:border-primary/30 transition-all duration-300
      ${featured ? 'ring-2 ring-primary/20 shadow-md' : ''}
    `}>
      {/* Business Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {business.imagen_url ? (
          <Image
            src={business.imagen_url}
            alt={business.nombre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-6xl opacity-50">
              {categoryIcon}
            </div>
          </div>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
            Destacado
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
          {business.categoria}
        </div>
      </div>

      {/* Business Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {business.nombre}
          </h3>
        </div>

        {business.descripcion && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {business.descripcion}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">
            {business.ciudad}, {business.departamento}
          </span>
        </div>

        {/* Services */}
        {business.servicios && business.servicios.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {business.servicios.slice(0, 3).map((servicio, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {servicio}
                </span>
              ))}
              {business.servicios.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{business.servicios.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            {/* WhatsApp */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                title="Contactar por WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                </svg>
              </a>
            )}

            {/* Phone */}
            {business.telefono && (
              <a
                href={`tel:${business.telefono}`}
                className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                title="Llamar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}

            {/* Website */}
            {business.sitio_web && (
              <a
                href={business.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                title="Visitar sitio web"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </a>
            )}
          </div>

          {/* View Details Button */}
          <Link
            href={businessUrl}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  )
}
