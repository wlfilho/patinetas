import { redirect } from 'next/navigation'
import DirectorioPage from '../../page'

interface PageProps {
  params: Promise<{
    page: string
  }>
}

export default async function DirectorioPaginationPage({ params }: PageProps) {
  const { page } = await params
  const pageNumber = parseInt(page, 10)

  // Redirect invalid page numbers to page 1
  if (isNaN(pageNumber) || pageNumber < 1) {
    redirect('/directorio')
  }

  // Redirect page 1 to the clean URL without pagination
  if (pageNumber === 1) {
    redirect('/directorio')
  }

  // Render the main directory page with the page parameter
  return <DirectorioPage initialPage={pageNumber} />
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { page } = await params
  const pageNumber = parseInt(page, 10)

  return {
    title: `Directorio de Negocios - Página ${pageNumber} | Patinetas Eléctricas`,
    description: `Explora negocios de patinetas eléctricas en Colombia - Página ${pageNumber}. Encuentra tiendas, servicios de reparación y más.`,
    robots: pageNumber > 1 ? 'noindex, follow' : 'index, follow', // Only index page 1
  }
}
