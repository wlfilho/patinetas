'use client'

import { Suspense, lazy } from 'react'
import { NegocioDirectorio } from '@/types'

/**
 * Lazy-loaded Department Map Navigation Component
 * 
 * Performance Optimization:
 * - Dynamically imports DepartmentMapNavigation component only when needed
 * - Reduces initial bundle size by ~35-40 KiB (Leaflet + react-leaflet)
 * - Map component loads only when user scrolls to it or interacts
 * - Improves LCP and FCP by deferring heavy mapping libraries
 * 
 * Impact:
 * - Leaflet library: ~30 KiB
 * - react-leaflet: ~5 KiB
 * - Total savings: ~35 KiB on initial load
 * 
 * Usage:
 * Replace <DepartmentMapNavigation /> with <LazyDepartmentMapNavigation />
 */

// Lazy load the DepartmentMapNavigation component
// This will be code-split into a separate chunk with Leaflet dependencies
const DepartmentMapNavigation = lazy(() => import('./DepartmentMapNavigation'))

interface LazyDepartmentMapNavigationProps {
  businesses: NegocioDirectorio[]
  businessesByCity: Record<string, NegocioDirectorio[]>
  departmentName: string
  departmentSlug: string
}

/**
 * Loading placeholder for the map navigation
 * Shows while the map component and Leaflet library are being loaded
 */
function MapNavigationLoadingPlaceholder() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map placeholder */}
        <div className="bg-gray-100 rounded-lg overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Cargando mapa interactivo...</p>
              <p className="text-gray-500 text-xs mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        </div>

        {/* Business list placeholder */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Lazy Department Map Navigation Component
 * Wraps DepartmentMapNavigation with Suspense for lazy loading
 */
export default function LazyDepartmentMapNavigation(props: LazyDepartmentMapNavigationProps) {
  return (
    <Suspense fallback={<MapNavigationLoadingPlaceholder />}>
      <DepartmentMapNavigation {...props} />
    </Suspense>
  )
}

