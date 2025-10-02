const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Slug generation functions
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateCitySlug(cityName) {
  const cityMappings = {
    'bogotá': 'bogota',
    'bogota': 'bogota',
    'medellín': 'medellin',
    'medellin': 'medellin',
    'cali': 'cali',
    'barranquilla': 'barranquilla',
    'cartagena': 'cartagena',
    'cúcuta': 'cucuta',
    'cucuta': 'cucuta',
    'bucaramanga': 'bucaramanga',
    'pereira': 'pereira',
    'santa marta': 'santa-marta',
    'ibagué': 'ibague',
    'ibague': 'ibague',
    'pasto': 'pasto',
    'manizales': 'manizales',
    'neiva': 'neiva',
    'villavicencio': 'villavicencio',
    'armenia': 'armenia',
    'valledupar': 'valledupar',
    'montería': 'monteria',
    'monteria': 'monteria',
    'envigado': 'envigado',
    'soacha': 'soacha'
  }
  
  const normalizedName = cityName.toLowerCase().trim()
  return cityMappings[normalizedName] || generateSlug(cityName)
}

async function fixBusinessSlugs() {
  try {
    console.log('🔍 Fetching all businesses...')
    
    // Get all businesses
    const { data: businesses, error } = await supabase
      .from('diretorio_patinetas')
      .select('*')
      .order('id')

    if (error) throw error

    console.log(`✅ Found ${businesses.length} businesses\n`)

    // Track slugs by city to detect real conflicts
    const slugsByCity = {}
    const updates = []
    
    for (const business of businesses) {
      const citySlug = generateCitySlug(business.ciudad)
      const baseSlug = generateSlug(business.nombre)
      
      // Initialize city tracking
      if (!slugsByCity[citySlug]) {
        slugsByCity[citySlug] = {}
      }
      
      // Check for real conflicts (same slug in same city)
      let finalSlug = baseSlug
      if (slugsByCity[citySlug][baseSlug]) {
        // Real conflict - append number
        let counter = 2
        finalSlug = `${baseSlug}-${counter}`
        while (slugsByCity[citySlug][finalSlug]) {
          counter++
          finalSlug = `${baseSlug}-${counter}`
        }
        console.log(`⚠️  Conflict detected: ${business.nombre} in ${business.ciudad}`)
        console.log(`   Using slug: ${finalSlug}`)
      }
      
      // Mark this slug as used in this city
      slugsByCity[citySlug][finalSlug] = business.id

      updates.push({
        id: business.id,
        slug: finalSlug,
        ciudad_slug: citySlug,
        nombre: business.nombre,
        ciudad: business.ciudad
      })
    }

    console.log('\n📋 Generated slugs:')
    updates.forEach(update => {
      console.log(`  ${update.id}. ${update.nombre} (${update.ciudad})`)
      console.log(`     → /${update.ciudad_slug}/${update.slug}`)
    })

    console.log('\n🔄 Updating database...')
    
    let successCount = 0
    let errorCount = 0
    
    // Update all businesses with their slugs
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('diretorio_patinetas')
        .update({
          slug: update.slug,
          ciudad_slug: update.ciudad_slug,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', update.id)

      if (updateError) {
        console.error(`❌ Error updating business ${update.id}:`, updateError)
        errorCount++
      } else {
        successCount++
        console.log(`✓ Updated ${update.nombre}`)
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Successfully updated: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📝 Total: ${updates.length}`)
    
    return { success: true, updated: successCount, errors: errorCount }
  } catch (error) {
    console.error('❌ Error fixing slugs:', error)
    throw error
  }
}

// Run the script
fixBusinessSlugs()
  .then(result => {
    console.log('\n🎉 Script completed successfully!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })

