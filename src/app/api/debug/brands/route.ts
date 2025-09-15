import { NextResponse } from 'next/server'
import { brandService } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('[DEBUG API] Starting brand debug check...')
    console.log('[DEBUG API] Environment:', process.env.NODE_ENV)
    console.log('[DEBUG API] Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('[DEBUG API] Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Test basic connection
    const brands = await brandService.getAll()
    console.log('[DEBUG API] Brands fetched successfully:', brands.length)
    
    // Test slug generation
    const { getBrandSlug } = await import('@/lib/slugs')
    const brandSlugs = brands.map(b => ({ 
      id: b.id,
      name: b.nombre, 
      slug: getBrandSlug(b.nombre) 
    }))
    
    console.log('[DEBUG API] Brand slugs generated:', brandSlugs)
    
    // Test specific brand lookup
    const xiaomiBrand = await brandService.getBySlug('xiaomi')
    console.log('[DEBUG API] Xiaomi brand lookup result:', xiaomiBrand ? 'Found' : 'Not found')
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      supabaseConfigured: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      brandsCount: brands.length,
      brandSlugs: brandSlugs,
      xiaomiTest: xiaomiBrand ? {
        id: xiaomiBrand.id,
        name: xiaomiBrand.nombre,
        slug: getBrandSlug(xiaomiBrand.nombre)
      } : null
    })
    
  } catch (error) {
    console.error('[DEBUG API] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: typeof error,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
