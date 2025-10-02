/**
 * Script to check the last 10 URLs in the sitemap
 */

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { getCategorySlug, getCitySlug } from '../src/lib/slugs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSitemapUrls() {
  console.log('🔍 Verificando as últimas 10 URLs do sitemap...\n')

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patinetaelectrica.com.co'

    // Get the last 10 businesses by creation date
    const { data: businesses, error } = await supabase
      .from('diretorio_patinetas')
      .select('id, nombre, slug, ciudad, ciudad_slug, categoria, departamento, fecha_creacion')
      .eq('activo', true)
      .order('fecha_creacion', { ascending: false })
      .limit(10)

    if (error) throw error

    console.log(`✅ Encontrados ${businesses.length} negócios mais recentes\n`)
    console.log('📋 URLs geradas para o sitemap:\n')

    businesses.forEach((business, index) => {
      const categorySlug = getCategorySlug(business.categoria)
      const citySlug = business.ciudad_slug || getCitySlug(business.ciudad)
      const businessSlug = business.slug || business.id.toString()

      const url = `${baseUrl}/${categorySlug}/${citySlug}/${businessSlug}`

      console.log(`${index + 1}. ${business.nombre}`)
      console.log(`   ID: ${business.id}`)
      console.log(`   Categoria: ${business.categoria} → ${categorySlug}`)
      console.log(`   Cidade: ${business.ciudad} → ${citySlug}`)
      console.log(`   Slug: ${business.slug || `${business.id} (ID como fallback)`}`)
      console.log(`   URL: ${url}`)
      console.log(`   Criado em: ${new Date(business.fecha_creacion).toLocaleString('pt-BR')}`)
      console.log('')
    })

    // Check for category mapping issues
    console.log('\n🔍 Verificando mapeamentos de categorias:\n')
    
    const categories = [...new Set(businesses.map(b => b.categoria))]
    categories.forEach(cat => {
      const slug = getCategorySlug(cat)
      console.log(`   "${cat}" → "${slug}"`)
    })

    // Check for city mapping issues
    console.log('\n🔍 Verificando mapeamentos de cidades:\n')
    
    const cities = [...new Set(businesses.map(b => b.ciudad))]
    cities.forEach(city => {
      const slug = getCitySlug(city)
      console.log(`   "${city}" → "${slug}"`)
    })

    console.log('\n✅ Verificação concluída!')

  } catch (error) {
    console.error('❌ Erro ao verificar URLs:', error)
    process.exit(1)
  }
}

checkSitemapUrls()

