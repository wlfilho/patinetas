import { notFound, permanentRedirect } from 'next/navigation'
import { Metadata } from 'next'
import { negociosService, NegocioDirectorio } from '@/lib/supabase'
import { getCategorySlug } from '@/lib/slugs'

interface PageProps {
  params: Promise<{ cidade: string; 'nome-do-negocio': string }>
}

// Generate metadata for SEO - This will trigger redirect before metadata is used
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cidade, 'nome-do-negocio': nomeDoNegocio } = await params

  try {
    const business = await negociosService.getBySlugs(cidade, nomeDoNegocio)

    // Generate category slug and redirect to new URL structure (308 Permanent Redirect)
    const categorySlug = getCategorySlug(business.categoria)
    const newUrl = `/${categorySlug}/${cidade}/${nomeDoNegocio}`

    // Permanent redirect (308) to new URL structure
    permanentRedirect(newUrl)
  } catch {
    // If business not found, return 404
    notFound()
  }
}

export default async function NegocioSlugPage({ params }: PageProps) {
  const { cidade, 'nome-do-negocio': nomeDoNegocio } = await params

  // Fetch business to get category information
  let business: NegocioDirectorio
  try {
    business = await negociosService.getBySlugs(cidade, nomeDoNegocio)
  } catch {
    notFound()
  }

  if (!business) {
    notFound()
  }

<<<<<<< HEAD
  const categoryIcon = getCategoryIcon(business.categoria)
  const businessUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'}/negocio/${cidade}/${nomeDoNegocio}`
=======
  // Generate category slug and redirect to new URL structure (308 Permanent Redirect)
  const categorySlug = getCategorySlug(business.categoria)
  const newUrl = `/${categorySlug}/${cidade}/${nomeDoNegocio}`
>>>>>>> staging

  // Permanent redirect (308) to new URL structure
  // This throws an error that Next.js catches to perform the redirect
  // All code after this line is unreachable
  permanentRedirect(newUrl)
}
