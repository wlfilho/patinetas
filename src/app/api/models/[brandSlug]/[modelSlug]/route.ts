import { NextRequest, NextResponse } from 'next/server'
import { modelService } from '@/lib/supabase'
import { isValidSlug } from '@/lib/slugs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandSlug: string; modelSlug: string }> }
) {
  try {
    const { brandSlug, modelSlug } = await params
    console.log(`[API] Model API called with brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)

    // Validate slug formats
    if (!isValidSlug(brandSlug) || !isValidSlug(modelSlug)) {
      console.log(`[API] Invalid slug format - brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }

    const model = await modelService.getByBrandAndModelSlugs(brandSlug, modelSlug)
    
    if (!model) {
      console.log(`[API] Model not found for brandSlug: ${brandSlug}, modelSlug: ${modelSlug}`)
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    console.log(`[API] Model found: ${model.nombre} by ${model.marca?.nombre}`)
    
    return NextResponse.json({ model })
  } catch (error) {
    console.error('[API] Error in model API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
