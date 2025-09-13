import { NextRequest, NextResponse } from 'next/server'
import { brandService, modelService } from '@/lib/supabase'
import { isValidSlug } from '@/lib/slugs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log(`[API] Brand API called with slug: ${slug}`)

    if (!isValidSlug(slug)) {
      console.log(`[API] Invalid slug: ${slug}`)
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const brand = await brandService.getBySlug(slug)
    
    if (!brand) {
      console.log(`[API] Brand not found for slug: ${slug}`)
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    console.log(`[API] Brand found: ${brand.nombre} (${brand.id})`)
    
    // Get models for this brand
    const allModels = await modelService.getAll()
    const models = allModels.filter(model => model.marca_id === brand.id && model.activo)
    
    console.log(`[API] Found ${models.length} models for brand: ${brand.nombre}`)

    return NextResponse.json({
      brand,
      models,
    })
  } catch (error) {
    console.error('[API] Error in brand API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
