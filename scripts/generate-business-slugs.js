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
    'monteria': 'monteria'
  }
  
  const normalizedName = cityName.toLowerCase().trim()
  return cityMappings[normalizedName] || generateSlug(cityName)
}

function generateUniqueBusinessSlug(businessName, cityName, existingBusinesses) {
  const baseSlug = generateSlug(businessName)
  const citySlug = generateCitySlug(cityName)

  // Check if this slug already exists in the same city
  const conflictingBusiness = existingBusinesses.find(business =>
    generateSlug(business.nombre) === baseSlug &&
    generateCitySlug(business.ciudad) === citySlug
  )

  // If there's a conflict, append a number to make it unique
  if (conflictingBusiness) {
    let counter = 2
    let uniqueSlug = `${baseSlug}-${counter}`
    
    while (existingBusinesses.some(business =>
      generateSlug(business.nombre) === uniqueSlug &&
      generateCitySlug(business.ciudad) === citySlug
    )) {
      counter++
      uniqueSlug = `${baseSlug}-${counter}`
    }
    
    return uniqueSlug
  }

  return baseSlug
}

async function generateSlugsForAllBusinesses() {
  try {
    console.log('Fetching all businesses...')
    
    // Get all businesses
    const { data: businesses, error } = await supabase
      .from('diretorio_patinetas')
      .select('*')
      .order('id')

    if (error) throw error

    console.log(`Found ${businesses.length} businesses`)

    const updates = []
    
    for (const business of businesses) {
      const citySlug = generateCitySlug(business.ciudad)
      const businessSlug = generateUniqueBusinessSlug(
        business.nombre,
        business.ciudad,
        businesses
      )

      updates.push({
        id: business.id,
        slug: businessSlug,
        ciudad_slug: citySlug,
        nombre: business.nombre,
        ciudad: business.ciudad
      })
    }

    console.log('Generated slugs:')
    updates.forEach(update => {
      console.log(`  ${update.nombre} (${update.ciudad}) -> /negocio/${update.ciudad_slug}/${update.slug}`)
    })

    console.log('\nUpdating database...')
    
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
        console.error(`Error updating business ${update.id}:`, updateError)
      } else {
        console.log(`✓ Updated ${update.nombre}`)
      }
    }

    console.log(`\n✅ Successfully updated ${updates.length} businesses with slugs`)
    return { success: true, updated: updates.length }
  } catch (error) {
    console.error('❌ Error generating slugs:', error)
    throw error
  }
}

// Run the migration
generateSlugsForAllBusinesses()
  .then(result => {
    console.log('\n🎉 Migration completed successfully!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })
