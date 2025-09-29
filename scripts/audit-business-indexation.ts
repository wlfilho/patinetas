/**
 * Script to audit business indexation for SEO
 * Analyzes all businesses in the database and generates a comprehensive report
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface NegocioDirectorio {
  id: number
  nombre: string
  descripcion?: string
  categoria: string
  telefono?: string
  email?: string
  direccion?: string
  ciudad: string
  departamento: string
  sitio_web?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  youtube?: string
  tiktok?: string
  google_business_url?: string
  numero_resenhas?: number
  valoracion?: number
  horario_atencion?: string
  horarios_funcionamento?: string
  servicios?: string[]
  outras_especialidades?: string[]
  imagen_url?: string
  activo: boolean
  fecha_creacion: string
  fecha_actualizacion: string
  category_id?: string
  slug?: string
  ciudad_slug?: string
}

interface AuditResult {
  totalBusinesses: number
  activeBusinesses: number
  inactiveBusinesses: number
  readyForIndexation: number
  criticalIssues: BusinessIssue[]
  highImpactIssues: BusinessIssue[]
  mediumImpactIssues: BusinessIssue[]
  byCategory: CategoryStats[]
  byCity: CityStats[]
  dataCompleteness: DataCompletenessStats
}

interface BusinessIssue {
  businessId: number
  businessName: string
  issue: string
  priority: 'P0' | 'P1' | 'P2'
  impact: string
  solution: string
}

interface CategoryStats {
  category: string
  total: number
  active: number
  withCompleteData: number
  completenessPercentage: number
  issues: string[]
}

interface CityStats {
  city: string
  department: string
  total: number
  active: number
  withCompleteData: number
  completenessPercentage: number
  issues: string[]
}

interface DataCompletenessStats {
  withDescription: number
  withImage: number
  withPhone: number
  withEmail: number
  withAddress: number
  withWebsite: number
  withWhatsApp: number
  withSocialMedia: number
  withHours: number
  withServices: number
  withSlug: number
  withCitySlug: number
}

// Helper functions
function isDescriptionAdequate(description?: string): boolean {
  return !!description && description.trim().length >= 50
}

function hasCompleteContactInfo(business: NegocioDirectorio): boolean {
  return !!(business.telefono || business.email || business.whatsapp)
}

function hasCompleteSEOData(business: NegocioDirectorio): boolean {
  return !!(
    business.nombre &&
    business.categoria &&
    business.ciudad &&
    business.departamento &&
    isDescriptionAdequate(business.descripcion) &&
    business.slug &&
    business.ciudad_slug
  )
}

function calculateCompletenessScore(business: NegocioDirectorio): number {
  let score = 0
  const maxScore = 15

  // Essential fields (5 points each)
  if (business.nombre) score += 5
  if (business.categoria) score += 5
  if (business.ciudad && business.departamento) score += 5

  // Important fields (3 points each)
  if (isDescriptionAdequate(business.descripcion)) score += 3
  if (business.imagen_url) score += 3
  if (business.slug && business.ciudad_slug) score += 3

  // Contact fields (2 points each)
  if (business.telefono) score += 2
  if (business.email) score += 2
  if (business.whatsapp) score += 2

  // Additional fields (1 point each)
  if (business.direccion) score += 1
  if (business.sitio_web) score += 1
  if (business.horario_atencion || business.horarios_funcionamento) score += 1
  if (business.servicios && business.servicios.length > 0) score += 1
  if (business.instagram || business.facebook) score += 1
  if (business.google_business_url) score += 1

  return Math.round((score / maxScore) * 100)
}

async function auditBusinesses(): Promise<AuditResult> {
  console.log('🔍 Starting business indexation audit...\n')

  // Fetch all businesses (including inactive)
  const { data: businesses, error } = await supabase
    .from('diretorio_patinetas')
    .select('*')
    .order('nombre')

  if (error) {
    console.error('❌ Error fetching businesses:', error)
    throw error
  }

  if (!businesses || businesses.length === 0) {
    console.log('⚠️  No businesses found in database')
    return {
      totalBusinesses: 0,
      activeBusinesses: 0,
      inactiveBusinesses: 0,
      readyForIndexation: 0,
      criticalIssues: [],
      highImpactIssues: [],
      mediumImpactIssues: [],
      byCategory: [],
      byCity: [],
      dataCompleteness: {
        withDescription: 0,
        withImage: 0,
        withPhone: 0,
        withEmail: 0,
        withAddress: 0,
        withWebsite: 0,
        withWhatsApp: 0,
        withSocialMedia: 0,
        withHours: 0,
        withServices: 0,
        withSlug: 0,
        withCitySlug: 0,
      },
    }
  }

  console.log(`📊 Found ${businesses.length} businesses in database\n`)

  const activeBusinesses = businesses.filter(b => b.activo)
  const inactiveBusinesses = businesses.filter(b => !b.activo)

  const criticalIssues: BusinessIssue[] = []
  const highImpactIssues: BusinessIssue[] = []
  const mediumImpactIssues: BusinessIssue[] = []

  let readyForIndexation = 0

  // Data completeness stats
  const dataCompleteness: DataCompletenessStats = {
    withDescription: 0,
    withImage: 0,
    withPhone: 0,
    withEmail: 0,
    withAddress: 0,
    withWebsite: 0,
    withWhatsApp: 0,
    withSocialMedia: 0,
    withHours: 0,
    withServices: 0,
    withSlug: 0,
    withCitySlug: 0,
  }

  // Analyze each business
  for (const business of activeBusinesses) {
    let hasIssues = false

    // P0 - Critical issues (prevent indexation)
    if (!business.nombre || business.nombre.trim().length === 0) {
      criticalIssues.push({
        businessId: business.id,
        businessName: business.nombre || `ID: ${business.id}`,
        issue: 'Missing business name',
        priority: 'P0',
        impact: 'CRITICAL - Page cannot be indexed without a name',
        solution: 'Add a valid business name',
      })
      hasIssues = true
    }

    if (!business.categoria) {
      criticalIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing category',
        priority: 'P0',
        impact: 'CRITICAL - Business cannot be categorized or found',
        solution: 'Assign a valid category',
      })
      hasIssues = true
    }

    if (!business.ciudad || !business.departamento) {
      criticalIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing location (city/department)',
        priority: 'P0',
        impact: 'CRITICAL - LocalBusiness schema incomplete, location-based searches fail',
        solution: 'Add city and department information',
      })
      hasIssues = true
    }

    if (!business.slug || !business.ciudad_slug) {
      criticalIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing SEO-friendly slug',
        priority: 'P0',
        impact: 'CRITICAL - URL cannot be generated, page not accessible',
        solution: 'Run slug generation script: npm run generate-slugs',
      })
      hasIssues = true
    }

    // P1 - High impact issues (hurt SEO significantly)
    if (!isDescriptionAdequate(business.descripcion)) {
      highImpactIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: business.descripcion ? 'Description too short (<50 chars)' : 'Missing description',
        priority: 'P1',
        impact: 'HIGH - Poor meta description, low click-through rate, thin content',
        solution: 'Add detailed description (minimum 150 characters recommended)',
      })
      hasIssues = true
    }

    if (!business.imagen_url) {
      highImpactIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing business image/logo',
        priority: 'P1',
        impact: 'HIGH - No Open Graph image, poor social sharing, less visual appeal',
        solution: 'Upload business logo or representative image',
      })
      hasIssues = true
    }

    if (!hasCompleteContactInfo(business)) {
      highImpactIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing contact information',
        priority: 'P1',
        impact: 'HIGH - Users cannot contact business, incomplete LocalBusiness schema',
        solution: 'Add at least phone, email, or WhatsApp',
      })
      hasIssues = true
    }

    // P2 - Medium impact issues (nice to have)
    if (!business.horario_atencion && !business.horarios_funcionamento) {
      mediumImpactIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing business hours',
        priority: 'P2',
        impact: 'MEDIUM - Incomplete LocalBusiness schema, users don\'t know when to visit',
        solution: 'Add business hours information',
      })
    }

    if (!business.google_business_url) {
      mediumImpactIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing Google Business link',
        priority: 'P2',
        impact: 'MEDIUM - Cannot show Google ratings/reviews',
        solution: 'Add Google Business Profile URL',
      })
    }

    if (!business.instagram && !business.facebook) {
      mediumImpactIssues.push({
        businessId: business.id,
        businessName: business.nombre,
        issue: 'Missing social media links',
        priority: 'P2',
        impact: 'MEDIUM - Less social proof, fewer backlinks',
        solution: 'Add Instagram and/or Facebook links',
      })
    }

    // Count data completeness
    if (isDescriptionAdequate(business.descripcion)) dataCompleteness.withDescription++
    if (business.imagen_url) dataCompleteness.withImage++
    if (business.telefono) dataCompleteness.withPhone++
    if (business.email) dataCompleteness.withEmail++
    if (business.direccion) dataCompleteness.withAddress++
    if (business.sitio_web) dataCompleteness.withWebsite++
    if (business.whatsapp) dataCompleteness.withWhatsApp++
    if (business.instagram || business.facebook) dataCompleteness.withSocialMedia++
    if (business.horario_atencion || business.horarios_funcionamento) dataCompleteness.withHours++
    if (business.servicios && business.servicios.length > 0) dataCompleteness.withServices++
    if (business.slug) dataCompleteness.withSlug++
    if (business.ciudad_slug) dataCompleteness.withCitySlug++

    // Check if ready for indexation
    if (!hasIssues && hasCompleteSEOData(business)) {
      readyForIndexation++
    }
  }

  // Analyze by category
  const categoriesMap = new Map<string, NegocioDirectorio[]>()
  for (const business of businesses) {
    if (!categoriesMap.has(business.categoria)) {
      categoriesMap.set(business.categoria, [])
    }
    categoriesMap.get(business.categoria)!.push(business)
  }

  const byCategory: CategoryStats[] = Array.from(categoriesMap.entries()).map(([category, businessList]) => {
    const active = businessList.filter(b => b.activo)
    const withCompleteData = active.filter(b => hasCompleteSEOData(b))
    const issues: string[] = []

    if (active.length === 0) issues.push('No active businesses')
    if (withCompleteData.length < active.length * 0.5) issues.push('Less than 50% have complete data')

    return {
      category,
      total: businessList.length,
      active: active.length,
      withCompleteData: withCompleteData.length,
      completenessPercentage: active.length > 0 ? Math.round((withCompleteData.length / active.length) * 100) : 0,
      issues,
    }
  }).sort((a, b) => b.active - a.active)

  // Analyze by city
  const citiesMap = new Map<string, NegocioDirectorio[]>()
  for (const business of businesses) {
    const cityKey = `${business.ciudad}|${business.departamento}`
    if (!citiesMap.has(cityKey)) {
      citiesMap.set(cityKey, [])
    }
    citiesMap.get(cityKey)!.push(business)
  }

  const byCity: CityStats[] = Array.from(citiesMap.entries()).map(([cityKey, businessList]) => {
    const [city, department] = cityKey.split('|')
    const active = businessList.filter(b => b.activo)
    const withCompleteData = active.filter(b => hasCompleteSEOData(b))
    const issues: string[] = []

    if (active.length === 0) issues.push('No active businesses')
    if (withCompleteData.length < active.length * 0.5) issues.push('Less than 50% have complete data')

    return {
      city,
      department,
      total: businessList.length,
      active: active.length,
      withCompleteData: withCompleteData.length,
      completenessPercentage: active.length > 0 ? Math.round((withCompleteData.length / active.length) * 100) : 0,
      issues,
    }
  }).sort((a, b) => b.active - a.active)

  return {
    totalBusinesses: businesses.length,
    activeBusinesses: activeBusinesses.length,
    inactiveBusinesses: inactiveBusinesses.length,
    readyForIndexation,
    criticalIssues,
    highImpactIssues,
    mediumImpactIssues,
    byCategory,
    byCity,
    dataCompleteness,
  }
}

async function generateReport(audit: AuditResult): Promise<string> {
  const timestamp = new Date().toISOString().split('T')[0]
  
  let report = `# 🔍 AUDITORIA COMPLETA DE INDEXAÇÃO - PÁGINAS DE NEGÓCIOS\n\n`
  report += `**Data da Auditoria:** ${timestamp}\n`
  report += `**Site:** patinetaelectrica.com.co\n`
  report += `**Plataforma:** Next.js + Supabase + Vercel\n\n`
  report += `---\n\n`

  // Executive Summary
  report += `## 📊 RESUMO EXECUTIVO\n\n`
  report += `### Estatísticas Gerais\n\n`
  report += `| Métrica | Valor | Percentual |\n`
  report += `|---------|-------|------------|\n`
  report += `| **Total de Negócios** | ${audit.totalBusinesses} | 100% |\n`
  report += `| **Negócios Ativos** | ${audit.activeBusinesses} | ${Math.round((audit.activeBusinesses / audit.totalBusinesses) * 100)}% |\n`
  report += `| **Negócios Inativos** | ${audit.inactiveBusinesses} | ${Math.round((audit.inactiveBusinesses / audit.totalBusinesses) * 100)}% |\n`
  report += `| **Prontos para Indexação** | ${audit.readyForIndexation} | ${Math.round((audit.readyForIndexation / audit.activeBusinesses) * 100)}% |\n`
  report += `| **Com Problemas Críticos (P0)** | ${audit.criticalIssues.length} | - |\n`
  report += `| **Com Problemas de Alto Impacto (P1)** | ${audit.highImpactIssues.length} | - |\n`
  report += `| **Com Problemas de Médio Impacto (P2)** | ${audit.mediumImpactIssues.length} | - |\n\n`

  // Data Completeness
  report += `### Completude dos Dados (Negócios Ativos)\n\n`
  report += `| Campo | Quantidade | Percentual |\n`
  report += `|-------|------------|------------|\n`
  report += `| Descrição Adequada (≥50 chars) | ${audit.dataCompleteness.withDescription} | ${Math.round((audit.dataCompleteness.withDescription / audit.activeBusinesses) * 100)}% |\n`
  report += `| Imagem/Logo | ${audit.dataCompleteness.withImage} | ${Math.round((audit.dataCompleteness.withImage / audit.activeBusinesses) * 100)}% |\n`
  report += `| Telefone | ${audit.dataCompleteness.withPhone} | ${Math.round((audit.dataCompleteness.withPhone / audit.activeBusinesses) * 100)}% |\n`
  report += `| Email | ${audit.dataCompleteness.withEmail} | ${Math.round((audit.dataCompleteness.withEmail / audit.activeBusinesses) * 100)}% |\n`
  report += `| Endereço | ${audit.dataCompleteness.withAddress} | ${Math.round((audit.dataCompleteness.withAddress / audit.activeBusinesses) * 100)}% |\n`
  report += `| Website | ${audit.dataCompleteness.withWebsite} | ${Math.round((audit.dataCompleteness.withWebsite / audit.activeBusinesses) * 100)}% |\n`
  report += `| WhatsApp | ${audit.dataCompleteness.withWhatsApp} | ${Math.round((audit.dataCompleteness.withWhatsApp / audit.activeBusinesses) * 100)}% |\n`
  report += `| Redes Sociais | ${audit.dataCompleteness.withSocialMedia} | ${Math.round((audit.dataCompleteness.withSocialMedia / audit.activeBusinesses) * 100)}% |\n`
  report += `| Horário de Atendimento | ${audit.dataCompleteness.withHours} | ${Math.round((audit.dataCompleteness.withHours / audit.activeBusinesses) * 100)}% |\n`
  report += `| Serviços | ${audit.dataCompleteness.withServices} | ${Math.round((audit.dataCompleteness.withServices / audit.activeBusinesses) * 100)}% |\n`
  report += `| Slug SEO | ${audit.dataCompleteness.withSlug} | ${Math.round((audit.dataCompleteness.withSlug / audit.activeBusinesses) * 100)}% |\n`
  report += `| Slug da Cidade | ${audit.dataCompleteness.withCitySlug} | ${Math.round((audit.dataCompleteness.withCitySlug / audit.activeBusinesses) * 100)}% |\n\n`

  report += `---\n\n`

  // Analysis by Category
  report += `## 📂 ANÁLISE POR CATEGORIA\n\n`
  report += `| Categoria | Total | Ativos | Dados Completos | % Completude | Problemas |\n`
  report += `|-----------|-------|--------|-----------------|--------------|----------|\n`
  for (const cat of audit.byCategory) {
    const issues = cat.issues.length > 0 ? cat.issues.join(', ') : '✅ Nenhum'
    report += `| ${cat.category} | ${cat.total} | ${cat.active} | ${cat.withCompleteData} | ${cat.completenessPercentage}% | ${issues} |\n`
  }
  report += `\n---\n\n`

  // Analysis by City
  report += `## 🏙️ ANÁLISE POR CIDADE\n\n`
  report += `| Cidade | Departamento | Total | Ativos | Dados Completos | % Completude | Problemas |\n`
  report += `|--------|--------------|-------|--------|-----------------|--------------|----------|\n`
  for (const city of audit.byCity.slice(0, 20)) { // Top 20 cities
    const issues = city.issues.length > 0 ? city.issues.join(', ') : '✅ Nenhum'
    report += `| ${city.city} | ${city.department} | ${city.total} | ${city.active} | ${city.withCompleteData} | ${city.completenessPercentage}% | ${issues} |\n`
  }
  if (audit.byCity.length > 20) {
    report += `\n*Mostrando top 20 cidades. Total de cidades: ${audit.byCity.length}*\n`
  }
  report += `\n---\n\n`

  // Critical Issues (P0)
  report += `## 🚨 PROBLEMAS CRÍTICOS (P0) - IMPEDEM INDEXAÇÃO\n\n`
  if (audit.criticalIssues.length === 0) {
    report += `✅ **Nenhum problema crítico encontrado!**\n\n`
  } else {
    report += `**Total:** ${audit.criticalIssues.length} problemas\n\n`
    
    // Group by issue type
    const issuesByType = new Map<string, BusinessIssue[]>()
    for (const issue of audit.criticalIssues) {
      if (!issuesByType.has(issue.issue)) {
        issuesByType.set(issue.issue, [])
      }
      issuesByType.get(issue.issue)!.push(issue)
    }

    for (const [issueType, issues] of issuesByType.entries()) {
      report += `### ${issueType}\n\n`
      report += `**Negócios afetados:** ${issues.length}\n\n`
      report += `**Impacto:** ${issues[0].impact}\n\n`
      report += `**Solução:** ${issues[0].solution}\n\n`
      report += `**Lista de negócios:**\n`
      for (const issue of issues.slice(0, 10)) {
        report += `- ID ${issue.businessId}: ${issue.businessName}\n`
      }
      if (issues.length > 10) {
        report += `- ... e mais ${issues.length - 10} negócios\n`
      }
      report += `\n`
    }
  }
  report += `---\n\n`

  // High Impact Issues (P1)
  report += `## ⚠️ PROBLEMAS DE ALTO IMPACTO (P1) - PREJUDICAM SEO\n\n`
  if (audit.highImpactIssues.length === 0) {
    report += `✅ **Nenhum problema de alto impacto encontrado!**\n\n`
  } else {
    report += `**Total:** ${audit.highImpactIssues.length} problemas\n\n`
    
    const issuesByType = new Map<string, BusinessIssue[]>()
    for (const issue of audit.highImpactIssues) {
      if (!issuesByType.has(issue.issue)) {
        issuesByType.set(issue.issue, [])
      }
      issuesByType.get(issue.issue)!.push(issue)
    }

    for (const [issueType, issues] of issuesByType.entries()) {
      report += `### ${issueType}\n\n`
      report += `**Negócios afetados:** ${issues.length}\n\n`
      report += `**Impacto:** ${issues[0].impact}\n\n`
      report += `**Solução:** ${issues[0].solution}\n\n`
    }
  }
  report += `---\n\n`

  // Medium Impact Issues (P2)
  report += `## 📝 PROBLEMAS DE MÉDIO IMPACTO (P2) - MELHORIAS RECOMENDADAS\n\n`
  if (audit.mediumImpactIssues.length === 0) {
    report += `✅ **Nenhum problema de médio impacto encontrado!**\n\n`
  } else {
    report += `**Total:** ${audit.mediumImpactIssues.length} problemas\n\n`
    
    const issuesByType = new Map<string, BusinessIssue[]>()
    for (const issue of audit.mediumImpactIssues) {
      if (!issuesByType.has(issue.issue)) {
        issuesByType.set(issue.issue, [])
      }
      issuesByType.get(issue.issue)!.push(issue)
    }

    for (const [issueType, issues] of issuesByType.entries()) {
      report += `### ${issueType}\n\n`
      report += `**Negócios afetados:** ${issues.length}\n\n`
      report += `**Impacto:** ${issues[0].impact}\n\n`
      report += `**Solução:** ${issues[0].solution}\n\n`
    }
  }

  return report
}

// Main execution
async function main() {
  try {
    const audit = await auditBusinesses()
    const report = await generateReport(audit)

    // Save report to file
    const outputPath = path.join(process.cwd(), 'AUDITORIA_INDEXACAO_NEGOCIOS.md')
    fs.writeFileSync(outputPath, report, 'utf-8')

    console.log(`\n✅ Audit complete!`)
    console.log(`📄 Report saved to: ${outputPath}`)
    console.log(`\n📊 Summary:`)
    console.log(`   Total businesses: ${audit.totalBusinesses}`)
    console.log(`   Active businesses: ${audit.activeBusinesses}`)
    console.log(`   Ready for indexation: ${audit.readyForIndexation} (${Math.round((audit.readyForIndexation / audit.activeBusinesses) * 100)}%)`)
    console.log(`   Critical issues (P0): ${audit.criticalIssues.length}`)
    console.log(`   High impact issues (P1): ${audit.highImpactIssues.length}`)
    console.log(`   Medium impact issues (P2): ${audit.mediumImpactIssues.length}`)
  } catch (error) {
    console.error('❌ Audit failed:', error)
    process.exit(1)
  }
}

main()

