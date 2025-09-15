const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Category slug generation functions
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    // Normalize Spanish characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
}

const CATEGORY_SLUG_MAPPINGS = {
  'venta de patinetas eléctricas': 'venta-patinetas-electricas',
  'reparación y mantenimiento': 'reparacion-mantenimiento',
  'repuestos y accesorios': 'repuestos-accesorios',
  'alquiler de patinetas': 'alquiler-patinetas',
  'servicio técnico': 'servicio-tecnico',
  'capacitación y cursos': 'capacitacion-cursos',
  'seguros y garantías': 'seguros-garantias',
  'financiamiento': 'financiamiento',
  'importación y distribución': 'importacion-distribucion',
  'personalización y modificación': 'personalizacion-modificacion'
}

function getCategorySlug(categoryName) {
  const normalizedName = categoryName.toLowerCase().trim()
  
  // Check if we have a predefined mapping
  if (CATEGORY_SLUG_MAPPINGS[normalizedName]) {
    return CATEGORY_SLUG_MAPPINGS[normalizedName]
  }
  
  // Fall back to generated slug
  return generateSlug(categoryName)
}

async function cleanupCategorySlugs() {
  try {
    console.log('🧹 Starting category slug cleanup...')
    
    // Get all categories
    const { data: categories, error: fetchError } = await supabase
      .from('categorias_patinetas')
      .select('*')
      .order('orden', { ascending: true })
    
    if (fetchError) {
      throw fetchError
    }
    
    console.log(`📊 Found ${categories.length} categories`)
    
    let updated = 0
    let cleaned = 0
    
    for (const category of categories) {
      const cleanSlug = getCategorySlug(category.nombre)
      
      // Check if current slug has unwanted suffix (like -2, -3, etc.)
      const hasNumericSuffix = category.slug && /-\d+$/.test(category.slug)
      const needsUpdate = !category.slug || category.slug !== cleanSlug || hasNumericSuffix
      
      if (needsUpdate) {
        console.log(`🔧 Updating "${category.nombre}":`)
        console.log(`   Old slug: ${category.slug || 'null'}`)
        console.log(`   New slug: ${cleanSlug}`)
        
        // Check if the clean slug is already taken by another category
        const { data: existingCategory, error: checkError } = await supabase
          .from('categorias_patinetas')
          .select('id, nombre')
          .eq('slug', cleanSlug)
          .neq('id', category.id)
          .single()
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`❌ Error checking slug availability for ${cleanSlug}:`, checkError)
          continue
        }
        
        if (existingCategory) {
          console.log(`⚠️  Slug "${cleanSlug}" is already used by "${existingCategory.nombre}". Skipping...`)
          continue
        }
        
        // Update the category with the clean slug
        const { error: updateError } = await supabase
          .from('categorias_patinetas')
          .update({ slug: cleanSlug })
          .eq('id', category.id)
        
        if (updateError) {
          console.error(`❌ Error updating slug for category ${category.nombre}:`, updateError)
        } else {
          console.log(`✅ Updated category "${category.nombre}" with clean slug: ${cleanSlug}`)
          updated++
          
          if (hasNumericSuffix) {
            cleaned++
          }
        }
      } else {
        console.log(`✓ Category "${category.nombre}" already has correct slug: ${category.slug}`)
      }
    }
    
    console.log('\n🎉 Category slug cleanup completed!')
    console.log(`📈 Statistics:`)
    console.log(`   - Total categories: ${categories.length}`)
    console.log(`   - Categories updated: ${updated}`)
    console.log(`   - Numeric suffixes cleaned: ${cleaned}`)
    
    if (cleaned > 0) {
      console.log('\n🔗 URLs that should now work without suffixes:')
      const cleanedCategories = categories.filter(cat => {
        const cleanSlug = getCategorySlug(cat.nombre)
        return cat.slug && /-\d+$/.test(cat.slug) && cleanSlug
      })
      
      cleanedCategories.forEach(cat => {
        const cleanSlug = getCategorySlug(cat.nombre)
        console.log(`   - http://localhost:3000/directorio/${cleanSlug}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error during category slug cleanup:', error)
    process.exit(1)
  }
}

// Run the cleanup
cleanupCategorySlugs()
  .then(() => {
    console.log('\n✨ Cleanup script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Cleanup script failed:', error)
    process.exit(1)
  })
