import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { negociosService } from '@/lib/supabase'
import { formatPhoneNumber, formatWhatsAppUrl, formatBusinessHours, getCategoryIcon, generateMetaTitle, generateMetaDescription } from '@/lib/utils'
import { BusinessStructuredData } from '@/components/seo/StructuredData'

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const business = await negociosService.getById(parseInt(id))
    
    return {
      title: generateMetaTitle(`${business.nombre} - ${business.categoria}`),
      description: generateMetaDescription(business.descripcion || `${business.nombre} en ${business.ciudad}, ${business.departamento}. ${business.categoria}.`),
      keywords: `${business.nombre}, ${business.categoria}, ${business.ciudad}, patinetas eléctricas, ${business.departamento}`,
      openGraph: {
        title: `${business.nombre} - ${business.categoria}`,
        description: business.descripcion || `${business.nombre} en ${business.ciudad}, ${business.departamento}`,
        images: business.imagen_url ? [business.imagen_url] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${business.nombre} - ${business.categoria}`,
        description: business.descripcion || `${business.nombre} en ${business.ciudad}, ${business.departamento}`,
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

export default async function NegocioPage({ params }: PageProps) {
  const { id } = await params
  
  let business
  try {
    business = await negociosService.getById(parseInt(id))
  } catch {
    notFound()
  }

  const categoryIcon = getCategoryIcon(business.categoria)
  const whatsappUrl = business.whatsapp ? formatWhatsAppUrl(business.whatsapp, `Hola, me interesa conocer más sobre ${business.nombre}`) : null
  const formattedPhone = business.telefono ? formatPhoneNumber(business.telefono) : null
  const formattedHours = business.horario_atencion ? formatBusinessHours(business.horario_atencion) : null

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
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 right-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li className="text-white/60">/</li>
              <li>
                <Link href="/directorio" className="text-white/80 hover:text-white">
                  Directorio
                </Link>
              </li>
              <li className="text-white/60">/</li>
              <li className="text-white font-medium truncate">
                {business.nombre}
              </li>
            </ol>
          </nav>
        </div>

        {/* Business Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {business.nombre}
                </h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    {business.categoria}
                  </span>
                  <span className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-gray-700 leading-relaxed">
                  {business.descripcion}
                </p>
              </div>
            )}

            {/* Services */}
            {business.servicios && business.servicios.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Servicios Ofrecidos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.servicios.map((servicio, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{servicio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {business.direccion && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ubicación
                </h2>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-700">{business.direccion}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {business.ciudad}, {business.departamento}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                {/* Phone */}
                {formattedPhone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium text-gray-900">{formattedPhone}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${business.telefono}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Llamar
                    </a>
                  </div>
                )}

                {/* WhatsApp */}
                {whatsappUrl && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <p className="font-medium text-gray-900">Enviar mensaje</p>
                      </div>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}

                {/* Email */}
                {business.email && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 text-sm">{business.email}</p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${business.email}`}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Enviar
                    </a>
                  </div>
                )}

                {/* Website */}
                {business.sitio_web && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sitio Web</p>
                        <p className="font-medium text-gray-900 text-sm">Visitar página</p>
                      </div>
                    </div>
                    <a
                      href={business.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Visitar
                    </a>
                  </div>
                )}

                {/* Business Hours */}
                {formattedHours && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Horario de Atención</p>
                        <p className="font-medium text-gray-900">{formattedHours}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Back to Directory */}
            <div className="text-center">
              <Link
                href="/directorio"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
