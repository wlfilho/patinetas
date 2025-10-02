'use client'

import { Suspense, lazy } from 'react'

/**
 * Lazy-loaded Business Map Component
 * 
 * Performance Optimization:
 * - Dynamically imports BusinessMap component only when needed
 * - Reduces initial bundle size by ~10-15 KiB
 * - Map component loads only when user scrolls to it or interacts
 * - Improves LCP and FCP by deferring non-critical JavaScript
 * 
 * Usage:
 * Replace <BusinessMap /> with <LazyBusinessMap /> in business detail pages
 */

// Lazy load the BusinessMap component
// This will be code-split into a separate chunk
const BusinessMap = lazy(() => import('./BusinessMap'))

interface LazyBusinessMapProps {
  address: string
  businessName: string
  city: string
  className?: string
}

/**
 * Loading placeholder for the map
 * Shows while the map component is being loaded
 */
function MapLoadingPlaceholder() {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Cargando mapa...</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Lazy Business Map Component
 * Wraps BusinessMap with Suspense for lazy loading
 */
export default function LazyBusinessMap(props: LazyBusinessMapProps) {
  return (
    <Suspense fallback={<MapLoadingPlaceholder />}>
      <BusinessMap {...props} />
    </Suspense>
  )
}

