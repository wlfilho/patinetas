import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle model catalog routes (brand/model structure)
  if (pathname.match(/^\/catalogo\/marcas\/[a-z0-9-]+\/[a-z0-9-]+$/)) {
    const pathParts = pathname.split('/')
    const brandSlug = pathParts[3]
    const modelSlug = pathParts[4]

    // Validate slug formats
    if (brandSlug && modelSlug && /^[a-z0-9-]+$/.test(brandSlug) && /^[a-z0-9-]+$/.test(modelSlug)) {
      console.log(`[MIDDLEWARE] Handling model route: ${brandSlug}/${modelSlug}`)
      return NextResponse.next()
    } else {
      console.log(`[MIDDLEWARE] Invalid model slug format: ${brandSlug}/${modelSlug}`)
      return NextResponse.rewrite(new URL('/404', request.url))
    }
  }

  // Handle brand catalog routes (single brand)
  if (pathname.startsWith('/catalogo/marcas/') && pathname !== '/catalogo/marcas' && !pathname.match(/^\/catalogo\/marcas\/[a-z0-9-]+\/[a-z0-9-]+$/)) {
    const slug = pathname.split('/').pop()

    // Validate slug format (basic validation)
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      console.log(`[MIDDLEWARE] Handling brand slug route: ${slug}`)
      // Allow the request to proceed to the dynamic route
      return NextResponse.next()
    } else {
      console.log(`[MIDDLEWARE] Invalid brand slug format: ${slug}`)
      // Redirect to 404 for invalid slugs
      return NextResponse.rewrite(new URL('/404', request.url))
    }
  }

  // Handle API model routes
  if (pathname.match(/^\/api\/models\/[a-z0-9-]+\/[a-z0-9-]+$/)) {
    const pathParts = pathname.split('/')
    const brandSlug = pathParts[3]
    const modelSlug = pathParts[4]

    // Validate slug formats
    if (brandSlug && modelSlug && /^[a-z0-9-]+$/.test(brandSlug) && /^[a-z0-9-]+$/.test(modelSlug)) {
      console.log(`[MIDDLEWARE] Handling API model route: ${brandSlug}/${modelSlug}`)
      return NextResponse.next()
    } else {
      console.log(`[MIDDLEWARE] Invalid API model slug format: ${brandSlug}/${modelSlug}`)
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }
  }

  // Handle API brand routes
  if (pathname.startsWith('/api/brands/') && pathname !== '/api/brands') {
    const slug = pathname.split('/').pop()

    // Validate slug format (basic validation)
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      console.log(`[MIDDLEWARE] Handling API brand slug route: ${slug}`)
      // Allow the request to proceed to the dynamic API route
      return NextResponse.next()
    } else {
      console.log(`[MIDDLEWARE] Invalid API brand slug format: ${slug}`)
      // Return 400 for invalid API slugs
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }
  }

  // Allow all other requests to proceed normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/catalogo/marcas/:path*',
    '/api/brands/:path*',
    '/api/models/:path*'
  ]
}
