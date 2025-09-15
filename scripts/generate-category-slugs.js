const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
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

function generateUniqueCategorySlug(categoryName, existingCategories = []) {
  const baseSlug = getCategorySlug(categoryName)
  
  // Check for conflicts
  const conflictingCategories = existingCategories.filter(
    category => 
      category.slug === baseSlug || 
      getCategorySlug(category.nombre) === baseSlug
  )
  
  if (conflictingCategories.length === 0) {
    return baseSlug
  }
  
  // Generate unique slug with number suffix
  let counter = 2
  let uniqueSlug = `${baseSlug}-${counter}`
  
  while (existingCategories.some(category => 
    category.slug === uniqueSlug || 
    getCategorySlug(category.nombre) === uniqueSlug
  )) {
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
  }
  
  return uniqueSlug
}

async function generateCategorySlugs() {
  try {
    console.log('🚀 Starting category slug generation...')
    
    // Get all categories
    const { data: categories, error: fetchError } = await supabase
      .from('categorias_patinetas')
      .select('*')
      .order('orden', { ascending: true })
    
    if (fetchError) {
      throw fetchError
    }
    
    console.log(`📊 Found ${categories.length} categories`)
    
    // Filter categories without slugs
    const categoriesWithoutSlugs = categories.filter(cat => !cat.slug)
    
    if (categoriesWithoutSlugs.length === 0) {
      console.log('✅ All categories already have slugs')
      return
    }
    
    console.log(`🔧 Generating slugs for ${categoriesWithoutSlugs.length} categories...`)
    
    let updated = 0
    
    for (const category of categoriesWithoutSlugs) {
      const slug = generateUniqueCategorySlug(category.nombre, categories)
      
      console.log(`📝 Generating slug for "${category.nombre}": ${slug}`)
      
      const { error: updateError } = await supabase
        .from('categorias_patinetas')
        .update({ slug })
        .eq('id', category.id)
      
      if (updateError) {
        console.error(`❌ Error updating slug for category ${category.nombre}:`, updateError)
      } else {
        console.log(`✅ Updated category "${category.nombre}" with slug: ${slug}`)
        updated++
        // Update the local array to prevent conflicts
        category.slug = slug
      }
    }
    
    console.log(`🎉 Successfully generated slugs for ${updated}/${categoriesWithoutSlugs.length} categories`)
    
  } catch (error) {
    console.error('💥 Error generating category slugs:', error)
    process.exit(1)
  }
}

// Run the script
generateCategorySlugs()
