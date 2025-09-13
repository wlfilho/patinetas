import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle brand catalog routes
  if (pathname.startsWith('/catalogo/marcas/') && pathname !== '/catalogo/marcas') {
    const slug = pathname.split('/').pop()
    
    // Validate slug format (basic validation)
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      console.log(`[MIDDLEWARE] Handling brand slug route: ${slug}`)
      // Allow the request to proceed to the dynamic route
      return NextResponse.next()
    } else {
      console.log(`[MIDDLEWARE] Invalid slug format: ${slug}`)
      // Redirect to 404 for invalid slugs
      return NextResponse.rewrite(new URL('/404', request.url))
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
      console.log(`[MIDDLEWARE] Invalid API slug format: ${slug}`)
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
    '/api/brands/:path*'
  ]
}
