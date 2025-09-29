import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { negociosService } from '@/lib/supabase'
import { formatPhoneNumber, formatWhatsAppUrl, getCategoryIcon, generateMetaTitle, generateMetaDescription } from '@/lib/utils'
import { formatBusinessHours } from '@/utils/businessHours'
import { markdownToPlainText } from '@/lib/markdown'
import { BusinessStructuredData } from '@/components/seo/StructuredData'
import MarkdownContent from '@/components/ui/MarkdownContent'
import GoogleBusinessRating from '@/components/ui/GoogleBusinessRating'
import SocialShareButtons from '@/components/ui/SocialShareButtons'
import NavigationButtons from '@/components/ui/NavigationButtons'
import BusinessMap from '@/components/ui/BusinessMap'
import BusinessHoursGrid from '@/components/ui/BusinessHoursGrid'
import BusinessStatus from '@/components/ui/BusinessStatus'
// import Breadcrumb, { BreadcrumbStructuredData } from '@/components/ui/Breadcrumb'
import { ESPECIALIDADES_NEGOCIO } from '@/constants/especialidades'

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
  const businessUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/negocio/${cidade}/${nomeDoNegocio}`

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Directorio', href: '/directorio' },
    { label: business.categoria, href: `/categorias/${business.categoria.toLowerCase().replace(/\s+/g, '-')}` },
    { label: business.ciudad, href: `/ciudades/${business.ciudad.toLowerCase()}` },
    { label: business.nombre }
  ]

  const breadcrumbStructuredData = [
    { name: 'Inicio', url: businessUrl.replace(`/negocio/${cidade}/${nomeDoNegocio}`, '') },
    { name: 'Directorio', url: businessUrl.replace(`/negocio/${cidade}/${nomeDoNegocio}`, '/directorio') },
    { name: business.categoria, url: businessUrl.replace(`/negocio/${cidade}/${nomeDoNegocio}`, `/categorias/${business.categoria.toLowerCase().replace(/\s+/g, '-')}`) },
    { name: business.ciudad, url: businessUrl.replace(`/negocio/${cidade}/${nomeDoNegocio}`, `/ciudades/${business.ciudad.toLowerCase()}`) },
    { name: business.nombre, url: businessUrl }
  ]

  return (
    <>
      <BusinessStructuredData business={business} />
      {/* <BreadcrumbStructuredData items={breadcrumbStructuredData} /> */}
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-64 sm:min-h-80 lg:min-h-96 xl:min-h-[28rem] pt-4 sm:pt-6 lg:pt-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/30">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center min-h-full py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-white text-center">
              {/* Business Logo */}
              {business.imagen_url && (
                <div className="mb-3 flex justify-center">
                  <div className="inline-block p-2 sm:p-2.5 lg:p-3 bg-white rounded-lg shadow-md">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24">
                      <Image
                        src={business.imagen_url}
                        alt={`Logo de ${business.nombre}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, (max-width: 1024px) 64px, (max-width: 1280px) 80px, 96px"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white">
                  {business.categoria}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                {business.nombre}
              </h1>

              {/* Business Status - Abierto/Cerrado */}
              <div className="flex justify-center mb-3">
                <BusinessStatus
                  hoursData={business.horarios_funcionamento || business.horario_atencion}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm sm:text-base xl:-mb-4 2xl:-mb-6">
                <div className="flex items-center justify-center sm:justify-start">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {business.ciudad}, {business.departamento}
                  </span>
                </div>
                {(business.valoracion || business.numero_resenhas) && (
                  <div className="flex justify-center sm:justify-start">
                    <GoogleBusinessRating
                      rating={business.valoracion}
                      reviewCount={business.numero_resenhas}
                      googleBusinessUrl={business.google_business_url}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* <Breadcrumb items={breadcrumbItems} /> */}
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

                {/* Social Share Buttons - Moved from sidebar */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <SocialShareButtons
                    businessName={business.nombre}
                    businessUrl={businessUrl}
                    businessDescription={business.descripcion}
                  />
                </div>
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
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{servicio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outras Especialidades */}
            {business.outras_especialidades && business.outras_especialidades.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Otras Especialidades
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {business.outras_especialidades.map((especialidadeId, index) => {
                    const especialidade = ESPECIALIDADES_NEGOCIO.find(e => e.id === especialidadeId)
                    if (!especialidade) return null

                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex-shrink-0">
                          <span className="text-xl">{especialidade.icono}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 leading-tight">
                            {especialidade.nombre}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {especialidade.descripcion}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Explorar Más Negocios
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Back to Directory */}
                <Link
                  href="/directorio"
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-sm font-medium">Volver al Directorio</span>
                </Link>

                {/* City-specific button */}
                <Link
                  href={`/ciudades/${business.ciudad.toLowerCase()}`}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">Otros negocios en {business.ciudad}</span>
                </Link>

                {/* Category-specific button */}
                <Link
                  href={`/categorias/${business.categoria.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-lg hover:from-green-200 hover:to-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-2xl mr-2">{categoryIcon}</span>
                  <span className="text-sm font-medium">Otros negocios {business.categoria}</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                {/* Phone */}
                {business.telefono && (
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
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
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Email</p>
                      <a href={`mailto:${business.email}`} className="text-primary hover:text-primary-dark">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {(business.horario_atencion || business.horarios_funcionamento) && (
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-3">Horario de Atención</p>
                      <BusinessHoursGrid
                        hoursData={business.horarios_funcionamento || business.horario_atencion}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Action Buttons */}
              <div className="mt-6 space-y-3">
                {/* WhatsApp */}
                {business.whatsapp && (
                  <a
                    href={formatWhatsAppUrl(business.whatsapp, `Hola, me interesa conocer más sobre ${business.nombre}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
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
                    rel="nofollow noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visitar Sitio Web
                  </a>
                )}
              </div>

              {/* Social Media Icons */}
              {(business.instagram || business.facebook || business.youtube || business.tiktok) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Redes Sociales</h4>
                  <div className="flex flex-wrap gap-2">
                    {business.instagram && (
                      <a
                        href={business.instagram.startsWith('http') ? business.instagram : `https://instagram.com/${business.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                        title="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}

                    {business.facebook && (
                      <a
                        href={business.facebook.startsWith('http') ? business.facebook : `https://facebook.com/${business.facebook}`}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                        title="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}

                    {business.youtube && (
                      <a
                        href={business.youtube.startsWith('http') ? business.youtube : `https://youtube.com/${business.youtube}`}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        title="YouTube"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}

                    {business.tiktok && (
                      <a
                        href={business.tiktok.startsWith('http') ? business.tiktok : `https://tiktok.com/${business.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
                        title="TikTok"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            {business.direccion && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h3>

                {/* Business Address Information */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{business.nombre}</p>
                      <p className="text-sm text-gray-600">{business.direccion}</p>
                      <p className="text-sm text-gray-600">{business.ciudad}, Colombia</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Map */}
                <div className="mb-4">
                  <BusinessMap
                    address={business.direccion}
                    businessName={business.nombre}
                    city={business.ciudad}
                  />
                </div>

                {/* Navigation Buttons */}
                <NavigationButtons
                  address={business.direccion}
                  businessName={business.nombre}
                />
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
    </>
  )
}
