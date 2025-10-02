import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { negociosService } from '@/lib/supabase'
import { getDepartmentSlug } from '@/lib/slugs'
import DepartmentPageClient from './DepartmentPageClient'

interface DepartmentPageProps {
  params: Promise<{ departamento: string }>
}

// Department name mappings (slug to full name)
const DEPARTMENT_NAMES: Record<string, string> = {
  'bogota': 'Bogotá D.C.',
  'cundinamarca': 'Cundinamarca',
  'antioquia': 'Antioquia',
  'valle-del-cauca': 'Valle del Cauca',
  'atlantico': 'Atlántico',
  'bolivar': 'Bolívar',
  'santander': 'Santander',
  'norte-de-santander': 'Norte de Santander',
  'tolima': 'Tolima',
  'huila': 'Huila',
  'meta': 'Meta',
  'caldas': 'Caldas',
  'risaralda': 'Risaralda',
  'quindio': 'Quindío',
  'narino': 'Nariño',
  'cauca': 'Cauca',
  'magdalena': 'Magdalena',
  'cesar': 'Cesar',
  'cordoba': 'Córdoba',
  'sucre': 'Sucre',
  'la-guajira': 'La Guajira',
  'boyaca': 'Boyacá',
  'casanare': 'Casanare',
  'arauca': 'Arauca',
  'caqueta': 'Caquetá',
  'putumayo': 'Putumayo',
  'amazonas': 'Amazonas',
  'guainia': 'Guainía',
  'guaviare': 'Guaviare',
  'vaupes': 'Vaupés',
  'vichada': 'Vichada',
  'choco': 'Chocó',
  'san-andres-y-providencia': 'San Andrés y Providencia'
}

function getDepartmentNameFromSlug(slug: string): string | null {
  return DEPARTMENT_NAMES[slug] || null
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const { departamento: departmentSlug } = await params
  const departmentName = getDepartmentNameFromSlug(departmentSlug)
  
  if (!departmentName) {
    return {
      title: 'Departamento no encontrado',
      description: 'El departamento que buscas no existe.'
    }
  }

  // Get businesses to count them
  const businesses = await negociosService.getDepartments()
  const deptData = businesses.find(d => getDepartmentSlug(d.departamento) === departmentSlug)
  const businessCount = deptData?.count || 0

  return {
    title: `Negocios de Patinetas Eléctricas en ${departmentName} | Directorio Colombia`,
    description: `Guía completa de ${businessCount} negocios especializados en patinetas eléctricas en ${departmentName}. Encuentre tiendas, talleres, repuestos y asistencia técnica en su ciudad.`,
    keywords: `${departmentName}, patinetas eléctricas, negocios, directorio, tiendas, talleres, repuestos, Colombia`,
    openGraph: {
      title: `Negocios de Patinetas Eléctricas en ${departmentName}`,
      description: `Directorio completo de ${businessCount} negocios de patinetas eléctricas en ${departmentName}. Tiendas, talleres y servicios especializados.`,
      type: 'website',
      locale: 'es_CO',
    },
  }
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { departamento: departmentSlug } = await params
  const departmentName = getDepartmentNameFromSlug(departmentSlug)
  
  if (!departmentName) {
    notFound()
  }

  // Fetch businesses for this department
  const businesses = await negociosService.getByDepartment(departmentName)

  if (businesses.length === 0) {
    notFound()
  }

  // Group businesses by city
  const businessesByCity = businesses.reduce((acc, business) => {
    const city = business.ciudad
    if (!acc[city]) {
      acc[city] = []
    }
    acc[city].push(business)
    return acc
  }, {} as Record<string, typeof businesses>)

  const cities = Object.keys(businessesByCity).sort((a, b) => a.localeCompare(b, 'es'))
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

  // Get top 3 cities for SEO paragraph
  const topCities = cities.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data - CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `Negocios de Patinetas Eléctricas en ${departmentName}`,
            description: `Directorio completo de ${businesses.length} negocios especializados en patinetas eléctricas en ${departmentName}`,
            url: `${baseUrl}/departamentos/${departmentSlug}`,
            inLanguage: 'es-CO',
            numberOfItems: businesses.length,
          }),
        }}
      />

      {/* JSON-LD Structured Data - Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Departamentos',
                item: `${baseUrl}/departamentos`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: departmentName,
                item: `${baseUrl}/departamentos/${departmentSlug}`,
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors" aria-label="Ir a inicio">
              🏠
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/departamentos" className="hover:text-primary transition-colors">
              Departamentos
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium" aria-current="page">{departmentName}</span>
          </nav>
        </div>
      </div>

      {/* Pass data to client component */}
      <DepartmentPageClient
        departmentName={departmentName}
        businesses={businesses}
        businessesByCity={businessesByCity}
        cities={cities}
        topCities={topCities}
      />
    </div>
  )
}

// Generate static params for all departments
export async function generateStaticParams() {
  try {
    const departments = await negociosService.getDepartments()
    
    return departments.map(({ departamento }) => ({
      departamento: getDepartmentSlug(departamento),
    }))
  } catch (error) {
    console.error('Error generating static params for departments:', error)
    return []
  }
}

