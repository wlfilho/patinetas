import { Metadata } from 'next'
import Link from 'next/link'
import { negociosService } from '@/lib/supabase'
import { getDepartmentSlug } from '@/lib/slugs'
import DepartmentSelector from '@/components/ui/DepartmentSelector'

export const metadata: Metadata = {
  title: 'Departamentos de Colombia | Directorio de Patinetas Eléctricas',
  description: 'Encuentra negocios de patinetas eléctricas en todos los departamentos de Colombia. Directorio completo organizado por departamento.',
  keywords: 'departamentos colombia, patinetas eléctricas, directorio, negocios por departamento',
  openGraph: {
    title: 'Departamentos de Colombia | Patinetas Eléctricas',
    description: 'Directorio de negocios de patinetas eléctricas organizados por departamento',
    type: 'website',
    locale: 'es_CO',
  },
}

// Department emoji mapping
const DEPARTMENT_EMOJIS: Record<string, string> = {
  'bogotá d.c.': '🏛️',
  'bogotá': '🏛️',
  'cundinamarca': '🏔️',
  'antioquia': '🌄',
  'valle del cauca': '🌴',
  'atlántico': '🌊',
  'bolívar': '🏖️',
  'santander': '⛰️',
  'norte de santander': '🏞️',
  'tolima': '🌋',
  'huila': '☕',
  'meta': '🌾',
  'caldas': '☕',
  'risaralda': '🌿',
  'quindío': '🦜',
  'nariño': '🌋',
  'cauca': '🏔️',
  'magdalena': '🏝️',
  'cesar': '🌴',
  'córdoba': '🐄',
  'sucre': '🌊',
  'la guajira': '🏜️',
  'boyacá': '⛰️',
  'casanare': '🐎',
  'arauca': '🌾',
  'caquetá': '🌳',
  'putumayo': '🌿',
  'amazonas': '🌴',
  'guainía': '🌳',
  'guaviare': '🌳',
  'vaupés': '🌳',
  'vichada': '🌾',
  'chocó': '🌧️',
  'san andrés y providencia': '🏝️'
}

function getDepartmentEmoji(departmentName: string): string {
  const normalized = departmentName.toLowerCase().trim()
  return DEPARTMENT_EMOJIS[normalized] || '🏙️'
}

// Group departments by first letter
function groupDepartmentsByLetter(departments: { departamento: string; count: number; citiesCount: number }[]) {
  const grouped: Record<string, { departamento: string; count: number; citiesCount: number }[]> = {}

  departments.forEach(dept => {
    const firstLetter = dept.departamento.charAt(0).toUpperCase()
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = []
    }
    grouped[firstLetter].push(dept)
  })

  return grouped
}

// Get only the letters that have departments (derived from actual data)
function getAvailableLetters(groupedDepartments: Record<string, { departamento: string; count: number; citiesCount: number }[]>) {
  return Object.keys(groupedDepartments).sort()
}

export default async function DepartamentosPage() {
  // Fetch all businesses to calculate cities count per department
  const allBusinesses = await negociosService.getAll()

  // Calculate cities count per department
  const citiesPerDepartment: Record<string, Set<string>> = {}
  allBusinesses.forEach(business => {
    if (!citiesPerDepartment[business.departamento]) {
      citiesPerDepartment[business.departamento] = new Set()
    }
    citiesPerDepartment[business.departamento].add(business.ciudad)
  })

  // Fetch departments with business counts
  const departmentsData = await negociosService.getDepartments()

  // Add cities count to departments
  const departments = departmentsData.map(({ departamento, count }) => ({
    departamento,
    count,
    citiesCount: citiesPerDepartment[departamento]?.size || 0
  }))

  // Prepare departments for selector
  const departmentsForSelector = departments.map(({ departamento, count }) => ({
    departamento,
    count,
    slug: getDepartmentSlug(departamento),
    emoji: getDepartmentEmoji(departamento)
  }))

  // Group by first letter
  const groupedDepartments = groupDepartmentsByLetter(departments)

  // Get only letters that have departments (no empty letters)
  const availableLetters = getAvailableLetters(groupedDepartments)

  // Calculate statistics for hero section
  const totalBusinesses = allBusinesses.length
  const activeDepartments = departments.length
  const totalDepartments = 32 // Total departments in Colombia
  const totalCities = new Set(allBusinesses.map(b => b.ciudad)).size

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

  return (
    <div id="top" className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data - CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Departamentos de Colombia - Directorio de Patinetas Eléctricas',
            description: 'Directorio de negocios de patinetas eléctricas organizados por departamento en Colombia',
            url: `${baseUrl}/departamentos`,
            inLanguage: 'es-CO',
            numberOfItems: departments.length,
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
            ],
          }),
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors" aria-label="Ir a inicio">
              🏠
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium" aria-current="page">
              Departamentos
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-white to-purple-50 border-b border-gray-200 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl mb-6">
              <span className="text-4xl sm:text-5xl">🗺️</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">
              Negocios de Patinetas Eléctricas por Departamento
            </h1>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Total Businesses */}
              <div className="p-4 bg-green-50/50 rounded-lg border border-green-200/50 hover:bg-green-50 hover:border-green-200 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                  {totalBusinesses}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total de Negocios
                </div>
              </div>

              {/* Active Departments */}
              <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200/50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                  {String(activeDepartments).padStart(2, '0')}/{totalDepartments}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Departamentos Activos
                </div>
              </div>

              {/* Total Cities */}
              <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">
                  {totalCities}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Ciudades
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Department Selector Dropdown */}
        <DepartmentSelector departments={departmentsForSelector} />

        {/* Alphabetical Navigation */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12 hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🔤</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Negocios de Patinetas Eléctricas por Departamento de A-Z
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Navegue por diversos tipos de negocios de patinetas eléctricas en su departamento
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {availableLetters.map(letter => (
              <a
                key={letter}
                href={`#${letter}`}
                className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold text-base sm:text-lg transition-all duration-200 bg-gradient-to-br from-primary to-primary-dark text-white hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
                title={`Ver departamentos que empiezan con ${letter}`}
                aria-label={`Ir a departamentos que empiezan con ${letter}`}
              >
                {letter}
                <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
              </a>
            ))}
          </div>
        </div>

        {/* Department Sections */}
        <div className="space-y-12 sm:space-y-16">
          {availableLetters.sort().map(letter => (
            <section key={letter} id={letter} className="scroll-mt-20">
              {/* Section Header */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl font-bold text-2xl sm:text-3xl shadow-md">
                    {letter}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Departamentos que comienzan con '{letter}'
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      {groupedDepartments[letter].length} {groupedDepartments[letter].length === 1 ? 'departamento' : 'departamentos'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {groupedDepartments[letter].map(({ departamento, count, citiesCount }) => {
                  const slug = getDepartmentSlug(departamento)
                  const emoji = getDepartmentEmoji(departamento)

                  return (
                    <Link
                      key={departamento}
                      href={`/departamentos/${slug}`}
                      className="group relative bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative">
                        {/* Department Title */}
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-tight">
                            {departamento}
                          </h3>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {/* Business Count Box */}
                          <div className="p-4 bg-gray-50 group-hover:bg-gray-100 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-all duration-300 text-center">
                            <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">
                              {count}
                            </div>
                            <div className="text-sm font-medium text-gray-900 transition-colors duration-300">
                              {count === 1 ? 'Negocio' : 'Negocios'}
                            </div>
                          </div>

                          {/* Cities Count Box */}
                          <div className="p-4 bg-gray-50 group-hover:bg-gray-100 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-all duration-300 text-center">
                            <div className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
                              {citiesCount}
                            </div>
                            <div className="text-sm font-medium text-gray-900 transition-colors duration-300">
                              {citiesCount === 1 ? 'Ciudad' : 'Ciudades'}
                            </div>
                          </div>
                        </div>

                        {/* Link Button */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-primary/20 transition-colors duration-300">
                          <span className="text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors">
                            Ver negocios
                          </span>
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                            <svg className="w-4 h-4 text-primary group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Empty State */}
        {departments.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 sm:p-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md mb-6">
              <span className="text-6xl">🗺️</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              No hay departamentos disponibles
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Aún no hay negocios registrados en ningún departamento.
            </p>
            <Link
              href="/directorio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar directorio
            </Link>
          </div>
        )}

        {/* Back to Top Button - Only show if there are departments */}
        {departments.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Volver arriba
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

