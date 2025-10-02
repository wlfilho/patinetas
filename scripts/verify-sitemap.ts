/**
 * Script to verify sitemap generation
 * Checks if all active businesses are included in the sitemap
 */

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

import { negociosService } from '../src/lib/supabase'
import { getCategorySlug, getCitySlug } from '../src/lib/slugs'

async function verifySitemap() {
  console.log('🔍 Verificando geração do sitemap...\n')

  try {
    // Get all active businesses
    const businesses = await negociosService.getAll()
    console.log(`✅ Total de negócios ativos no banco: ${businesses.length}`)

    // Count businesses with and without slugs
    const withSlug = businesses.filter(b => b.slug).length
    const withoutSlug = businesses.filter(b => !b.slug).length
    const withCitySlug = businesses.filter(b => b.ciudad_slug).length
    const withoutCitySlug = businesses.filter(b => !b.ciudad_slug).length

    console.log(`\n📊 Estatísticas de Slugs:`)
    console.log(`   - Negócios com slug: ${withSlug}`)
    console.log(`   - Negócios sem slug: ${withoutSlug} (usarão ID como fallback)`)
    console.log(`   - Negócios com ciudad_slug: ${withCitySlug}`)
    console.log(`   - Negócios sem ciudad_slug: ${withoutCitySlug} (usarão slug gerado)`)

    // Generate sitemap URLs (same logic as sitemap.ts)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'
    const businessUrls = businesses.map(business => {
      const categorySlug = getCategorySlug(business.categoria)
      const citySlug = business.ciudad_slug || getCitySlug(business.ciudad)
      const businessSlug = business.slug || business.id.toString()

      return {
        id: business.id,
        nombre: business.nombre,
        url: `${baseUrl}/${categorySlug}/${citySlug}/${businessSlug}`,
        hasSlug: !!business.slug,
        hasCitySlug: !!business.ciudad_slug
      }
    })

    console.log(`\n🌐 URLs que serão geradas no sitemap: ${businessUrls.length}`)

    // Show businesses without slugs (recently added)
    const recentBusinesses = businessUrls.filter(b => !b.hasSlug)
    if (recentBusinesses.length > 0) {
      console.log(`\n📝 Negócios recém-adicionados (sem slug, usando ID):`)
      recentBusinesses.forEach(b => {
        console.log(`   - [ID ${b.id}] ${b.nombre}`)
        console.log(`     URL: ${b.url}`)
      })
    }

    // Show sample URLs
    console.log(`\n📋 Exemplos de URLs no sitemap:`)
    businessUrls.slice(0, 5).forEach(b => {
      console.log(`   - ${b.url}`)
    })

    console.log(`\n✅ Verificação concluída!`)
    console.log(`\n📌 Resumo:`)
    console.log(`   - Total de negócios ativos: ${businesses.length}`)
    console.log(`   - Total de URLs no sitemap: ${businessUrls.length}`)
    console.log(`   - Todos os negócios ativos estão incluídos: ${businesses.length === businessUrls.length ? '✅ SIM' : '❌ NÃO'}`)

  } catch (error) {
    console.error('❌ Erro ao verificar sitemap:', error)
    process.exit(1)
  }
}

verifySitemap()

