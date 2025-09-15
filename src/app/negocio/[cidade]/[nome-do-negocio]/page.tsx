import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { negociosService } from '@/lib/supabase'
import { formatPhoneNumber, formatWhatsAppUrl, formatBusinessHours, getCategoryIcon, generateMetaTitle, generateMetaDescription } from '@/lib/utils'
import { markdownToPlainText } from '@/lib/markdown'
import { BusinessStructuredData } from '@/components/seo/StructuredData'
import MarkdownContent from '@/components/ui/MarkdownContent'

interface PageProps {
  params: Promise<{ cidade: string; 'nome-do-negocio': string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cidade, 'nome-do-negocio': nomeDoNegocio } = await params
  
  try {
    const business = await negociosService.getBySlugs(cidade, nomeDoNegocio)

    // Convert markdown description to plain text for SEO
    const plainDescription = business.descripcion
      ? markdownToPlainText(business.descripcion, 160)
      : `${business.nombre} en ${business.ciudad}, ${business.departamento}. ${business.categoria} especializada en patinetas eléctricas.`

    return {
      title: generateMetaTitle(`${business.nombre} - ${business.categoria} en ${business.ciudad}`),
      description: generateMetaDescription(plainDescription),
      keywords: `${business.nombre}, ${business.categoria}, patinetas eléctricas, ${business.ciudad}, ${business.departamento}, Colombia`,
      openGraph: {
        title: `${business.nombre} - ${business.categoria}`,
        description: plainDescription,
        images: business.imagen_url ? [business.imagen_url] : [],
        type: 'website',
        locale: 'es_CO',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${business.nombre} - ${business.categoria}`,
        description: plainDescription,
        images: business.imagen_url ? [business.imagen_url] : [],
      },
    }
  } catch {
    return {
      title: 'Negocio no encontrado',
      description: 'El negocio que buscas no existe o no está disponible.',
    }
  }
}

export default async function NegocioSlugPage({ params }: PageProps) {
  const { cidade, 'nome-do-negocio': nomeDoNegocio } = await params
  
  let business
  try {
    business = await negociosService.getBySlugs(cidade, nomeDoNegocio)
  } catch {
    notFound()
  }

  if (!business) {
    notFound()
  }

  const categoryIcon = getCategoryIcon(business.categoria)

  return (
    <>
      <BusinessStructuredData business={business} />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
        {business.imagen_url ? (
          <Image
            src={business.imagen_url}
            alt={business.nombre}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-8xl opacity-50">
              {categoryIcon}
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <div className="text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                  {business.categoria}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {business.nombre}
              </h1>
              <div className="flex items-center space-x-4 text-sm sm:text-base">
                <div className="flex items-center">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {business.ciudad}, {business.departamento}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {business.descripcion && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Acerca de {business.nombre}
                </h2>
                <MarkdownContent
                  content={business.descripcion}
                  className="text-gray-700 leading-relaxed"
                />
              </div>
            )}

            {/* Services */}
            {business.servicios && business.servicios.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Servicios
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.servicios.map((servicio, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{servicio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                {/* Address */}
                {business.direccion && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-900 font-medium">Dirección</p>
                      <p className="text-gray-600">{business.direccion}</p>
                      <p className="text-gray-600">{business.ciudad}, {business.departamento}</p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {business.telefono && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-gray-900 font-medium">Teléfono</p>
                      <a href={`tel:${business.telefono}`} className="text-primary hover:text-primary-dark">
                        {formatPhoneNumber(business.telefono)}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {business.email && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-gray-900 font-medium">Email</p>
                      <a href={`mailto:${business.email}`} className="text-primary hover:text-primary-dark">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {business.horario_atencion && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-900 font-medium">Horario de Atención</p>
                      <div className="text-gray-600 whitespace-pre-line">
                        {formatBusinessHours(business.horario_atencion)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media & Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Conecta con Nosotros
              </h3>
              <div className="space-y-3">
                {/* WhatsApp */}
                {business.whatsapp && (
                  <a
                    href={formatWhatsAppUrl(business.whatsapp, `Hola, me interesa conocer más sobre ${business.nombre}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                )}

                {/* Website */}
                {business.sitio_web && (
                  <a
                    href={business.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    Visitar Sitio Web
                  </a>
                )}

                {/* Social Media Links */}
                <div className="flex space-x-3">
                  {business.instagram && (
                    <a
                      href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      title="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-1.297c-.875.807-2.026 1.218-3.323 1.218s-2.448-.411-3.323-1.218c-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.926 2.026-1.416 3.323-1.416s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323z"/>
                      </svg>
                    </a>
                  )}

                  {business.facebook && (
                    <a
                      href={`https://facebook.com/${business.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Back to Directory */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Link
                href="/directorio"
                className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Directorio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
